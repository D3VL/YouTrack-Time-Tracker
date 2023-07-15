import React from 'react';
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function SelectIssue() {

    const { project } = useParams();


    const [issues, setIssues] = React.useState([]);

    React.useEffect(() => {
        (async () => {
            const issues = await window.yt.getIssuesForProject(project, true)

            console.log(issues);
            setIssues(issues);

        })()
    }, []);

    return (
        <>
            <section className="p-4">
                <h3 className="text-2xl font-bold text-center mb-5  text-gray-600 dark:text-white">Select Issue</h3>

                {issues.map(issue => (
                    <Link to={"/add-new/" + project + "/" + issue.idReadable}>
                        <div className="hover:bg-gray-300 dark:hover:bg-gray-600 w-100  border-gray-200 dark:border-gray-700 cursor-pointer rounded">
                            <div className="flex items-center px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                <span className=" text-gray-600 dark:text-gray-400 text-xs">[{issue.idReadable}]</span>
                                <div className="font-normal  text-gray-600 dark:text-white ml-2">
                                    {issue.summary}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                <Link to={"/add-new/" + project + "/new-issue"}>
                    <button className="p-4 mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"> Add New </button>
                </Link>




            </section>
        </>
    );
}

export default SelectIssue;
