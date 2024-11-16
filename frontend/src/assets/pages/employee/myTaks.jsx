import { useState, useEffect } from "react";
import { useProjectStore } from "../../store/project.js";
import { useUserContext } from "../userContext.jsx";
import { useTaskStore } from "../../store/task.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const MyTasks = () => {
    const { fetchEmployeeTasks, fetchProjectById } = useProjectStore();
    const { updateStatus, downloadTaskAttachment, DisplayTaskAttachment } = useTaskStore();
    const { userName } = useUserContext();
    const [tasks, setTasks] = useState([]);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchTasksWithDetails = async () => {
            if (userName) {
                try {
                    const fetchedProjects = await fetchEmployeeTasks(userName);
                    const updatedTasks = await Promise.all(
                        fetchedProjects.map(async (task) => {
                            if (task.attachment) {
                                try {
                                    const response = await DisplayTaskAttachment(task.attachment);
                                    task.imgUrl = response.url || null;
                                } catch (error) {
                                    console.error("Error fetching attachment for task:", error);
                                    task.imgUrl = null;
                                }
                            } else {
                                task.imgUrl = null;
                            }

                            // Fetch project name if project ID exists
                            if (task.project) {
                                try {
                                    const projectResponse = await fetchProjectById(task.project);
                                    task.projectName = projectResponse?.name || "Unknown Project";
                                } catch (error) {
                                    console.error("Error fetching project name:", error);
                                    task.projectName = "Unknown Project";
                                }
                            } else {
                                task.projectName = "No Project Assigned";
                            }

                            return task;
                        })
                    );
                    setTasks(updatedTasks);
                } catch (error) {
                    console.error("Error fetching employee tasks:", error);
                }
            }
        };

        fetchTasksWithDetails();
    }, [userName, fetchEmployeeTasks, DisplayTaskAttachment, fetchProjectById]);

    const handleDownloadAttachment = async (task) => {
        const filename = task.attachment;
        if (!filename) {
            console.log("No attachment found for this task.");
            return;
        }
        setFile(filename);
        const response = await downloadTaskAttachment(filename);
        if (response.success) {
            toast.success("Attachment downloaded successfully");
        } else {
            console.error(response.message);
            toast.error(response.message);
        }
    };

    const handleStatusChange = async (taskId, currentStatus) => {
        try {
            let newStatus = "New";
            if (currentStatus === "New") {
                newStatus = "In Progress";
            } else if (currentStatus === "In Progress") {
                newStatus = "Completed";
            }
            const response = await updateStatus(newStatus, taskId);

            if (response.success) {
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task._id === taskId ? { ...task, status: newStatus } : task
                    )
                );
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

    const renderTaskCard = (task) => (
        <div key={task._id} className="bg-slate-100 p-6 rounded-lg shadow-md mb-8">
            <div className="flex justify-between items-center mb-4">
                <span>                <h3 className="font-semibold text-xl text-gray-800">{task.title}</h3>
                </span>
                <span> <h3 className="font-semibold text-xl text-gray-800">{task.projectName}</h3></span>
            </div>
            <div className="flex justify-between items-center mb-2 text-sm text-gray-500 font-medium mr-44">
                <span className="flex-1">Description</span>
                <span className="w-1/4 text-center">Due Date</span>
                <span className="w-1/4 text-center">Status</span>
            </div>
            <div className="flex justify-between items-center text-sm ">
                <p className="flex-1 leading-relaxed pr-4 font-medium">{task.description}</p>
                <span className="w-1/4 text-center text-gray-800 font-medium">{task.dueDate}</span>
                <span
                    className={`w-1/6 text-center px-3 py-1 text-sm font-semibold ${
                        task.status === "Completed"
                            ? "bg-green-200 text-green-700"
                            : task.status === "In Progress"
                            ? "bg-blue-200 text-blue-700"
                            : "bg-rose-500 text-white"
                    }`}
                >
                    {task.status}
                </span>
            
                <button
                    onClick={() => handleStatusChange(task._id, task.status)}
                    className={`text-sm w-1/6 font-semibold text-white ${
                        task.status === "Completed" ? "bg-slate-300" : "bg-purple-500"
                    } ml-4 py-1`}
                >
                    {task.status === "Completed" ? "Done" : task.status === "New" ? "Start" : "Submit"}
                </button>
            </div>
            <div className="text-sm text-gray-500 font-medium mr-44 mt-10 flex items-center gap-6">
                <span>Attachments:</span>
                <img src={task.imgUrl || "/doc.png"} alt="Task Attachment" className="w-16 h-16" />
                <button
                    onClick={() => handleDownloadAttachment(task)}
                    className="w-6/10 p-2 h-10 text-center ml-10 bg-slate-200 text-purple-900 border-spacing-2 border-purple-900"
                >
                    DOWNLOAD
                </button>
            </div>
        </div>
    );

    return (
        <div className="m-10 ml-96">
            <h1 className="font-bold text-2xl mb-6">My Tasks</h1>
            <div className="space-y-6">
                {tasks.length ? (
                    tasks.map((task) => renderTaskCard(task))
                ) : (
                    <p>Tasks Loading...</p>
                )}
            </div>
        </div>
    );
};
