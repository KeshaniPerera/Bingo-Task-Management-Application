import { useState, useEffect } from "react";
import { AddProjectPopup } from "../../components/addProjectPopup";
import { useProjectStore } from "../../store/project.js";
import { Link } from 'react-router-dom';
import { toast } from "react-toastify"; 

export const ManagerProjects = () => {
    const [isPopupOpen, setPopupStatus] = useState(false);
    const { fetchProjects, projects, updateStatus, setProjects } = useProjectStore();

    const togglePopup = () => {
        setPopupStatus(!isPopupOpen);
    };

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    console.log(projects);

    const handleStatusChange = async (projectId, currentStatus) => {
        try {
            let newStatus = "In Progress";
            if (currentStatus === "In Progress") {
                newStatus = "Completed";
            }
            const response = await updateStatus(newStatus, projectId);

            if (response.success) {
                fetchProjects();  
                toast.success("Status updated successfully");
            } else {
                console.error(response.message);
                toast.error(response.message);
            }
        } catch (error) {
            console.error("Error updating status", error);
            toast.error("Error updating status");
        }
    };

    const inProgressProjects = projects.filter(project => project.status === "In Progress" || project.status === "New");
    const completedProjects = projects.filter(project => project.status === "Completed");

    return (
        <div>
            <div className="flex mt-5 ml-96">
                <div className="w-3/4 h-auto rounded-md p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="font-semibold text-xl">Projects</h1>
                        <button
                            className="bg-purple-700 text-white font-semibold px-4 rounded-md text-xs tracking-wide p-2"
                            onClick={togglePopup}
                        >
                            ADD PROJECT
                        </button>
                    </div>

                    {/* Show loading state while projects are being fetched */}
                    {projects.length === 0 ? (
                        <div className="flex justify-center items-center">
                            <p>Loading projects...</p>
                        </div>
                    ) : (
                        <>
                            {/* In Progress Projects */}
                            {inProgressProjects.length > 0 && (
                                <div>
                                    {inProgressProjects.map((project) => (
                                        <div key={project._id} className="flex mt-5 justify-between p-5 bg-slate-100 text-neutral-500 text-xs font-bold">
                                            <Link to={`/manager/projects/${project._id}`}>
                                                <p>{project.name}</p>
                                            </Link>
                                            <button
                                                className="flex-2 bg-fuchsia-200 p-3 font-medium text-black border-solid"
                                                onClick={() => handleStatusChange(project._id, project.status)}
                                            >
                                                Mark Complete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {completedProjects.length > 0 && (
                                <div>
                                    <h2 className="text-lg font-semibold  mt-8">Completed Projects</h2>
                                    {completedProjects.map((project) => (
                                        <div key={project._id} className="flex mt-5 justify-between p-5 bg-slate-100 text-neutral-500 text-xs font-bold">
                                            <Link to={`/manager/projects/${project._id}`}>
                                                <p>{project.name}</p>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {inProgressProjects.length === 0 && completedProjects.length === 0 && (
                                <p>No projects available</p>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Add Project Popup */}
            {isPopupOpen && <AddProjectPopup togglePopup={togglePopup} />}
        </div>
    );
};
