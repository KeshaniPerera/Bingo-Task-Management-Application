// ProjectDetails Component
import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from "react";
import { useProjectStore } from '../../store/project.js';
import { useEmployeeStore } from '../../store/employee.js';
import { useTaskStore } from '../../store/task.js';
import { AddTaskPopup } from '../../components/addTaskPopup.jsx';

export const ProjectDetails = () => {
    const { projectId } = useParams();
    const { tasks, fetchTaskByProject } = useTaskStore();
    const fetchProjectById = useProjectStore((state) => state.fetchProjectById);
    const fetchEmployees = useEmployeeStore((state) => state.fetchEmployees);

    const [project, setProject] = useState(null);

    const [isPopupOpen, setPopupStatus] = useState(false);
    const togglePopup = () => setPopupStatus(!isPopupOpen);

    useEffect(() => {
        if (projectId) {
            fetchTaskByProject(projectId);
        }
    }, [projectId, fetchTaskByProject]);

    useEffect(() => {
        const loadProject = async () => {
            try {
                const projectData = await fetchProjectById(projectId);
                setProject(projectData);
            } catch (error) {
                console.error("Error fetching project:", error);
            }
        };
        loadProject();
    }, [projectId, fetchProjectById]);

    // Fetch employees only once on initial load
    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    return project ? (
        <div>
            <div className="flex flex-col p-7 pr-10 mr-40 ">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">{project.name}</h1>
                    <button
                        className="bg-purple-700 text-white h-8 font-semibold px-4 rounded-md text-xs tracking-wide"
                        onClick={togglePopup}
                    >
                        ADD TASK
                    </button>
                </div>
                {isPopupOpen && <AddTaskPopup togglePopup={togglePopup} />}

                <p className="mb-2"><strong>Description:</strong> {project.description}</p>
                <p className="mb-2"><strong>Start Date:</strong> {project.startDate}</p>
                <p className="mb-2"><strong>End Date:</strong> {project.endDate}</p>
                <p className="mb-2"><strong>Status:</strong> {project.status}</p>
            </div>
            
            {/* Tasks Section */}
            <div className="flex mt-5 ml-5">
                <div className="w-3/4 h-auto rounded-md p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="font-semibold text-xl">Tasks</h1>
                        
                    </div>
                    <div className="flex items-center space-x-4 p-4 text-neutral-800 text-xs font-bold mb-4">
                        <p className="flex-1"><strong>Title</strong></p>
                        <p className="flex-1"><strong>Description</strong></p>
                        <p className="flex-1"><strong>Due Date</strong></p>
                        <p className="flex-1"><strong>Status</strong></p>
                        <p className="flex-1"><strong>Project</strong></p>
                        <p className="flex-1"><strong>Assigned To</strong></p>
                        <p className="flex-1"><strong>Attachment</strong></p>
                    </div>

                    {tasks && tasks.length > 0 ? (
                        tasks.map((task, index) => (
                            <div>
                            <div key={index} className="flex items-center space-x-4 p-4 bg-slate-100 text-neutral-500 text-xs font-bold mb-4">
                                <p className="flex-1">{task.title}</p>
                                <p className="flex-1">{task.description}</p>
                                <p className="flex-1">{task.dueDate}</p>
                                <p className="flex-1">{task.status}</p>
                                <p className="flex-1">{task.project}</p>
                                <p className="flex-1">{task.assignedTo}</p>
                                
                            </div>

                            </div>
                            
                        ))
                    ) : (
                        <p className="text-gray-500">No tasks found.</p>
                    )}
                </div>
            </div>
        </div>
    ) : (
        <p>Loading project details...</p>
    );
};

export default ProjectDetails;
