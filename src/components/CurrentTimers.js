import React from 'react';
import { getReadableTimeSince } from '../functions';
function CurrentTimers() {

    // returns a string like "1d 2h 30m 15s" if the time is exactly 3 hours still return "3h 0m 0s"


    const [workItems, setWorkItems] = React.useState([]);
    const [timerValues, setTimerValues] = React.useState({});
    const timers = {};

    const loadWorkItems = async () => {
        const currentUser = await window.yt.getCurrentUser();

        const query = `[YTT.${currentUser.id}*active::`
        const workItems = await window.yt.getWorkItems(query);
        const tmpTimerValues = {};

        const transformed = workItems.filter((workItem) => (workItem?.yttData?.active)).map(workItem => {
            let startedAt = new Date(parseInt(`1${workItem.yttData.active}0000`));
            if (startedAt > new Date()) startedAt = new Date();

            timers[workItem.id] = startedAt
            tmpTimerValues[workItem.id] = getReadableTimeSince(startedAt);

            return {
                ...workItem,
                startedAt,
                text: workItem.text.replace(/\[YTT.*]/, '').trim()
            }
        })

        setTimerValues(tmpTimerValues);
        setWorkItems(transformed);
    }

    React.useEffect(() => {
        loadWorkItems();

        const reloader = setInterval(() => {
            loadWorkItems();
        }, 1000)

        return () => { clearInterval(reloader) }
    }, []);

    const stopTimer = async (workItem) => {
        const currentUser = await window.yt.getCurrentUser();
        // calculate minutes since workItem.startedAt
        const minutes = Math.floor((new Date() - workItem.startedAt) / 1000 / 60);
        console.log("STOPPING", workItem)
        // remove the timer from the workItem.text
        const newText = `${window.yt.constructYTT(currentUser.id, { id: (workItem?.yttData?.id ? workItem.yttData.id : workItem.id) })} ${workItem.text.replace(/\[YTT.*]/g, '').trim()}`

        try {
            await window.yt.updateTimer(workItem.issue.id, workItem.id, minutes, newText);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            {workItems.map(workItem => (
                <div key={workItem.id} className="block w-full p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 mb-4">
                    <div className="flex items-center justify-between align-middle">
                        <div className="mr-5">
                            <h1 className="text-gray-600 dark:text-white text-4xl">{timerValues[workItem.id]}</h1>
                            <p className="text-black dark:text-gray-400">{workItem.text}</p>
                        </div>
                        <button className="flex items-center justify-center px-8 py-4 rounded bg-red-500 font-bold" onClick={() => { stopTimer(workItem) }}>STOP</button>
                    </div>

                    <hr className="my-4 border-gray-200 dark:border-gray-700" />

                    <div className="flex items-center">
                        <a href={window.yt.userUrl + '/projects/' + workItem.issue.project.id} target="_blank" className="flex flex-col mr-5">
                            <span className="text-sm font-medium text-gray-400">Project</span>
                            <span className="text-sm text-gray-600 dark:text-white">{workItem.issue.project.name}</span>
                        </a>
                        <a href={window.yt.userUrl + '/issue/' + workItem.issue.idReadable} target="_blank" className="flex flex-col mr-5">
                            <span className="text-sm font-medium text-gray-400">Issue</span>
                            <span className="text-sm text-gray-600 dark:text-white">{workItem.issue.idReadable}</span>
                        </a>
                        {workItem?.type && (<div className="flex flex-col mr-5">
                            <span className="text-sm font-medium text-gray-400">Type</span>
                            <span className="text-sm text-gray-600 dark:text-white" style={{ color: workItem?.type?.color?.background || 'unset' }}>{workItem?.type?.name}</span>
                        </div>)}
                        {workItem?.duration?.presentation && workItem?.duration?.presentation !== "1m" && (<div className="flex flex-col mr-5">
                            <span className="text-sm font-medium text-gray-400">Time Spent</span>
                            <span className="text-sm text-gray-600 dark:text-white">{workItem?.duration?.presentation}</span>
                        </div>)}

                    </div>

                </div>
            ))}
        </>
    );
}

export default CurrentTimers;
