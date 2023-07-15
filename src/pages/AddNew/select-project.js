import React from 'react';
import { Link, useNavigate } from "react-router-dom";

function SelectProject() {
    const [projects, setProjects] = React.useState([]);
    const navigate = useNavigate();
    React.useEffect(() => {
        (async () => {
            const projects = await window.yt.getProjects();

            // if the user has only one project, redirect to the add-new page for that project
            if (projects.length === 1) return navigate("/add-new/" + projects[0].id);

            setProjects(projects);
        })()
    }, []);


    return (
        <>
            <section className="p-4">
                <h3 className="text-2xl font-bold text-center mb-5  text-gray-600 dark:text-white">Select Project</h3>



                {projects.map(project => (
                    <Link to={"/add-new/" + project.shortName} key={project.id}>
                        <div className="hover:bg-gray-300 dark:hover:bg-gray-600 w-100 flex justify-between items-center border-gray-200 dark:border-gray-700 cursor-pointer rounded">
                            <div scope="row" className="flex items-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">

                                <img className="w-12 h-12 rounded" src={window.yt.baseUrl + project.iconUrl} alt="Project Logo" />

                                <div className="pl-3">
                                    <div className="text-base font-semibold"> {project.name}</div>
                                    <div className="font-normal text-gray-500 text-xs text-gray-500">[{project.shortName}] {project.description}</div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}


            </section>

        </>
    );
}

export default SelectProject;
