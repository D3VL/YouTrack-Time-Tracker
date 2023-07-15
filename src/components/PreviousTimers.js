import React from 'react';
import { getReadableTimeSince, parseDuration } from '../functions';

function PreviousTimers() {

    const [workItems, setWorkItems] = React.useState([]);

    const loadWorkItems = async () => {
        const currentUser = await window.yt.getCurrentUser();

        const query = `"[YTT.${currentUser.id}*" AND work date: {This Week}`
        const workItems = await window.yt.getWorkItems(query, 100);
        const activeList = workItems.filter((workItem) => (workItem?.yttData?.active)).map(workItem => workItem?.yttData?.id || workItem.id);

        const mergedItems = workItems
            .sort((a, b) => (b.updated - a.updated))
            .filter((workItem) => (!workItem?.yttData?.active))
            .filter((workItem) => (!activeList.includes(workItem?.yttData?.id || workItem.id)))
            .reduce((acc, workItem) => {
                const id = workItem.yttData?.id || workItem.id;

                workItem.duration.parsed = parseDuration(workItem?.duration?.presentation || '0s');
                workItem.text = workItem.text.replace(/\[YTT.*]/, '').trim();

                if (!acc[id]) acc[id] = workItem;
                else {
                    acc[id].duration.parsed += workItem.duration.parsed;
                    acc[id].duration.presentation = getReadableTimeSince(new Date() - acc[id].duration.parsed * 1000).replace(' 0s', '')
                }
                return acc;
            }, {})


        setWorkItems(Object.values(mergedItems));
    }

    React.useEffect(() => {
        loadWorkItems();

        const reloader = setInterval(() => {
            loadWorkItems();
        }, 1000)

        return () => { clearInterval(reloader) }
    }, []);

    const restartTimer = async (workItem) => {
        const currentUser = await window.yt.getCurrentUser();
        const id = workItem.yttData?.id || workItem.id;

        const YTTStr = window.yt.constructYTT(currentUser.id, { active: ((new Date().getTime() / 1e4) - 1e8).toFixed(), id });
        try {
            const newTimer = await window.yt.createTimer(workItem.issue.id, YTTStr, workItem.text);
            console.log(newTimer);
        } catch (e) {
            console.log(e);
            alert('Error: ' + e.message);
        }
    }

    return (
        <>
            {workItems.length > 0 && (<h3 className="text-xl font-bold text-center mb-2 text-gray-600 dark:text-white">Recent Timers</h3>)}
            {workItems.map(workItem => (
                <div key={workItem.id} className="block w-full p-3 px-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 my-2">
                    <div className="mb-2">
                        <p className="text-gray-600 dark:text-gray-200">{workItem.text}</p>
                    </div>
                    <div className="flex items-center justify-between align-middle">

                        <div className="flex items-center">
                            <a href={window.yt.userUrl + '/projects/' + workItem.issue.project.id} target="_blank" rel="noreferrer" className="flex flex-col mr-5">
                                <span className="text-sm font-medium text-gray-400">Project</span>
                                <span className="text-sm text-gray-600 dark:text-white">{workItem.issue.project.name}</span>
                            </a>
                            <a href={window.yt.userUrl + '/issue/' + workItem.issue.idReadable} target="_blank" rel="noreferrer" className="flex flex-col mr-5">
                                <span className="text-sm font-medium text-gray-400">Issue</span>
                                <span className="text-sm text-gray-600 dark:text-white">{workItem.issue.idReadable}</span>
                            </a>
                            {workItem?.type && (<div className="flex flex-col mr-5">
                                <span className="text-sm font-medium text-gray-400">Type</span>
                                <span className="text-sm text-gray-600 dark:text-white" style={{ color: workItem?.type?.color?.background || 'unset' }}>{workItem?.type?.name}</span>
                            </div>)}
                            {workItem?.duration?.presentation && (<div className="flex flex-col mr-5">
                                <span className="text-sm font-medium text-gray-400">Time Spent</span>
                                <span className="text-sm text-gray-600 dark:text-white">{workItem?.duration?.presentation}</span>
                            </div>)}
                        </div>

                        <button onClick={() => { restartTimer(workItem) }} className="flex items-center justify-center rounded  bg-green-600 hover:bg-green-700  px-3 py-1 font-bold">Start</button>
                    </div>
                </div>
            ))}
        </>
    );
}

export default PreviousTimers;
