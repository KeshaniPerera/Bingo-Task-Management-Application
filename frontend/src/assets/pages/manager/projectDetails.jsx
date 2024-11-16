import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useProjectStore } from '../../store/project.js';
import { useEmployeeStore } from '../../store/employee.js';
import { useTaskStore } from '../../store/task.js';
import { AddTaskPopup } from '../../components/addTaskPopup.jsx';


export const ProjectDetails = () => {
    const { projectId } = useParams();
    const { tasks, fetchTaskByProject, downloadTaskAttachment, DisplayTaskAttachment } = useTaskStore();
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

    const handleAttachmentUpload = async (task) => {
        const filename = task.attachment;
        if (!filename) {
            console.log("No attachment found for this task.");
            return;
        }
        downloadTaskAttachment(filename);
    };

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

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const newTasks = tasks.filter(task => task.status === "New");
    const inProgressTasks = tasks.filter(task => task.status === "In Progress");
    const completedTasks = tasks.filter(task => task.status === "Completed");

    return project ? (
        <div>
            <div className="flex flex-col p-7 pr-10 mr-40 ml-96">
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
            <div className="flex mt-5 ml-96">
                <div className="w-3/4 h-auto rounded-md p-4">
                    <h1 className="font-semibold text-xl mb-4">Tasks</h1>


                    {newTasks.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-lg font-medium mb-3 ">New</h2>
                            <div className="flex  text-gray-500 text-xs font-medium mb-4 p-4 bg-white">
                            <p className="mb-2 flex-1"><strong>Title</strong> </p>
                            <p className="mb-2 flex-1"><strong>Date</strong> </p>
                            <p className="mb-2 flex-1"><strong>Status</strong> </p>
                            <p className="mb-2 flex-1"><strong>Assigned To</strong> </p>
                            <p className="mb-2 flex-1"><strong>Attachment</strong> </p>

                            </div>



                            {newTasks.map((task) => (
                                <TaskItem key={task._id} task={task} onDownload={() => handleAttachmentUpload(task)} DisplayTaskAttachment={DisplayTaskAttachment} />
                            ))}
                        </div>
                    )}

                    {inProgressTasks.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-3">In Progress</h2>
                            <div className="flex  text-gray-500 text-xs font-medium mb-4 p-4 bg-white">
                            <p className="mb-2 flex-1"><strong>Title</strong> </p>
                            <p className="mb-2 flex-1"><strong>Date</strong> </p>
                            <p className="mb-2 flex-1"><strong>Status</strong> </p>
                            <p className="mb-2 flex-1"><strong>Assigned To</strong> </p>
                            <p className="mb-2 flex-1"><strong>Attachment</strong> </p>

                            </div>
                            
                            {inProgressTasks.map((task) => (
                                <TaskItem key={task._id} task={task} onDownload={() => handleAttachmentUpload(task)} DisplayTaskAttachment={DisplayTaskAttachment} />
                            ))}
                        </div>
                    )}

                    {completedTasks.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-3">Completed</h2>
                              <div className="flex  text-gray-500 text-xs font-medium mb-4 p-4 bg-white">
                            <p className="mb-2 flex-1"><strong>Title</strong> </p>
                            <p className="mb-2 flex-1"><strong>Date</strong> </p>
                            <p className="mb-2 flex-1"><strong>Status</strong> </p>
                            <p className="mb-2 flex-1"><strong>Assigned To</strong> </p>
                            <p className="mb-2 flex-1"><strong>Attachment</strong> </p>

                            </div>
                            {completedTasks.map((task) => (
                                <TaskItem key={task._id} task={task} onDownload={() => handleAttachmentUpload(task)} DisplayTaskAttachment={DisplayTaskAttachment} />
                            ))}
                        </div>
                    )}

                    {newTasks.length === 0 && inProgressTasks.length === 0 && completedTasks.length === 0 && (
                        <p className="text-gray-500">No tasks found.</p>
                    )}
                </div>
            </div>
        </div>
    ) : (
        <p>Loading project details...</p>
    );
};

const TaskItem = ({ task, onDownload, DisplayTaskAttachment }) => {
    const [imgUrl, setImgUrl] = useState("");

    useEffect(() => {
        const fetchAttachment = async () => {
            if (task.attachment) {
                try {
                    const response = await DisplayTaskAttachment(task.attachment);
                    setImgUrl(response.url); 
                    console.log(response.url);

                } catch (error) {
                    console.error("Error fetching attachment:", error);
                }
            }
            else{
                setImgUrl("doc.png");
            }
        };
        fetchAttachment();
    }, [task.attachment, DisplayTaskAttachment]);

    return (
        <div className="flex flex-col bg-slate-100 text-black text-xs font-bold mb-4 p-4">
            <div className="flex items-center space-x-4">
                <p className="flex-1">{task.title}</p>
                <p className="flex-1">{task.dueDate}</p>
                <p className="flex-1">{task.status}</p>
                <p className="flex-1">{task.assignedTo}</p>
                <button 
                    className="flex-1 bg-purple-200 text-purple-700 h-8 font-semibold px-4 rounded-md text-xs tracking-wide"     
                    onClick={onDownload} 
                >
                    DOWNLOAD
                </button>
            </div>
            <div className="flex justify-between w-full">
            <p className="mt-6 text-neutral-700">{task.description}</p>
            {imgUrl ? (
    <img src={imgUrl} alt="Task Attachment" className="mt-4 w-24 h-24 mr-7" />
) : (
    <img src="/doc.png" alt="Task Attachment" className="mt-4 w-24 h-24 mr-7"  />
    
)}
</div>
        </div>
    );
};

export default ProjectDetails;
