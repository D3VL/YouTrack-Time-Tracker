import React from 'react';
import { useParams, useNavigate } from "react-router-dom";

function CreateIssue() {

    const { project } = useParams();
    const navigate = useNavigate();


    const [createEnabled, setCreateEnabled] = React.useState(false);
    const summaryField = React.useRef(null);
    const descriptionField = React.useRef(null);

    const doCreateIssue = async () => {
        const projectData = await window.yt.getProject(project);
        try {
            const issue = await window.yt.createIssue(projectData.id, summaryField.current.value, descriptionField.current.value);
            navigate("/add-new/" + project + "/" + issue.idReadable);
        } catch (e) {
            alert(e);
        }
    }


    return (
        <>
            <section className="p-4">
                <h3 className="text-2xl font-bold text-center mb-5 text-gray-900 dark:text-white">Create A New Issue</h3>

                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Summary <span className="text-red-500 text-sm text-bold">*</span></label>
                    <input ref={summaryField} onChange={(e) => { setCreateEnabled(e.target.value.length > 3) }} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>

                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                    <textarea ref={descriptionField} rows="5" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                </div>

                <button onClick={doCreateIssue} className={"p-4 w-full bg-green-600 text-white font-bold py-2 px-4 rounded" + (createEnabled ? ' hover:bg-green-700 ' : ' opacity-50 cursor-not-allowed')}> Create </button>

            </section>
        </>
    );
}

export default CreateIssue;
