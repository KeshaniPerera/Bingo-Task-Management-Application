import { useState, useEffect } from "react";
import { useProjectStore } from "../../store/project.js";
import { useUserContext } from "../userContext.jsx";

export const EmployeeProjects = () => {
    const { fetchEmployeeTasks, employeeProjects, fetchProjectById } = useProjectStore();
    const { userName } = useUserContext();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        if (userName) {
            fetchEmployeeTasks(userName)
                .catch((error) => console.error("Error fetching employee projects:", error));
        }
    }, [fetchEmployeeTasks, userName]);

    useEffect(() => {
        if (employeeProjects.length !== 0) {
            const fetchProjectsById = async () => {
                const projectDetails = await Promise.all(
                    employeeProjects.map(async (item) => await fetchProjectById(item.project))
                );
                setProjects(projectDetails);
            };
            fetchProjectsById();
        }
    }, [employeeProjects, fetchProjectById]);

    // Separate projects by status
    const inProgressProjects = projects.filter((project) => project.status === "In Progress");
    const completedProjects = projects.filter((project) => project.status === "Completed");

    return (
        <div className="m-10 lg:ml-96 sm:ml-auto  md-ml-60">
            <h1 className="font-bold text-2xl mb-6">My Projects</h1>
            
            {/* In Progress Projects */}
            {inProgressProjects.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">In Progress</h2>
                    {inProgressProjects.map((project, index) => (
                        <div key={index} className="bg-slate-100 mt-4 p-4 flex flex-col space-y-4 rounded-md items-start mb-4">
                            <div className="flex justify-between w-full">
                                <h3 className="font-medium text-zinc-600">{project.name}</h3>
                                <h3 className="text-sm font-semibold text-white bg-indigo-400 rounded-md px-3 py-3">{project.status}</h3>
                            </div>
                            <h3 className="text-xs text-zinc-400">Additional Info</h3>
                        </div>
                    ))}
                </div>
            )}

            {/* Completed Projects */}
            {completedProjects.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Completed</h2>
                    {completedProjects.map((project, index) => (
                        <div key={index} className="bg-slate-100 mt-4 p-4 flex flex-col space-y-4 rounded-md items-start mb-4">
                            <div className="flex justify-between w-full">
                                <h3 className="font-medium text-zinc-600">{project.name}</h3>
                                <h3 className="text-sm font-semibold text-white bg-purple-400 rounded-md px-3 py-3">{project.status}</h3>
                            </div>
                            <h3 className="text-xs text-zinc-400">Additional Info</h3>
                        </div>
                    ))}
                </div>
            )}

            {/* If no projects found */}
            {inProgressProjects.length === 0 && completedProjects.length === 0 && (
                <p className="text-gray-500">Loading Projects..</p>
            )}
        </div>
    );
};
