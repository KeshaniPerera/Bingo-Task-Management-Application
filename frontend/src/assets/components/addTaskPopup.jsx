import { useState, useEffect } from "react";
import { useEmployeeStore } from "../store/employee.js";
import { useTaskStore } from "../store/task.js";
import { useProjectStore } from "../store/project.js";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserContext } from "../pages/userContext.jsx";

export const AddTaskPopup = ({ togglePopup }) => {

    const  email = useUserContext();
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        attachment: '',
        project: '',
        status: 'New',
    });

    const { employees, fetchEmployees } = useEmployeeStore();
    const { fetchProjectById,updateStatus } = useProjectStore();
    const { createTask, uploadTaskAttachment } = useTaskStore();
    const location = useLocation();

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    useEffect(() => {
        const taskId = location.pathname.split("/").pop();
    
        const fetchProject = async (id) => {
            try {
                const projectData = await fetchProjectById(id);
                if (projectData) {
                    setNewTask((prevTask) => ({
                        ...prevTask,
                        project: projectData._id,  // Assuming projectData contains _id
                    }));
    
                    // Check if the project status is "New" and update it
                    if (projectData.status === "New") {
                        const response = await updateStatus("In Progress", projectData._id); // Use projectData._id here
                        // Handle the response if necessary (e.g., show a success message or update the UI)
                    }
                } else {
                    console.error("Project not found.");
                }
            } catch (error) {
                console.error("Error fetching project data:", error);
            }
        };
    
        if (taskId) {
            fetchProject(taskId);
        }
    }, [location.pathname, fetchProjectById]);
    
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "attachment" && files && files[0]) {
            setNewTask((prevTask) => ({
                ...prevTask,
                [name]: files[0].name,
            }));
            handleAttachment(e);
        }
      
        else {
            setNewTask((prevTask) => ({
                ...prevTask,
                [name]: value,
            }));
        }
    };

    const handleAttachment = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const { success, message } = await uploadTaskAttachment(newTask._id, file);
                if (success) {
                    toast.success(message);
                } else {
                    toast.error(message);
                }
            } catch (error) {
                console.error("Error uploading attachment:", error);
                toast.error("Error uploading attachment");
            }
        }
    };

    const handleAddTask = async (event) => {
        event.preventDefault();

        let attachmentName = newTask.attachment;

        if (newTask.attachment instanceof File) {
            attachmentName = await handleAttachment(newTask.attachment);
            if (!attachmentName) {
                return;
            }
        }

        const taskWithAttachment = { ...newTask, attachment: attachmentName,  };

        try {
            const { success, message } = await createTask(taskWithAttachment);
            if (success) {
                toast.success(message);
            } else {
                toast.error(message);
            }
        } catch (error) {
            console.error("Error creating task:", error);
            toast.error("Error creating task");
        }

        togglePopup();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h1 className="text-xl font-semibold mb-4">Add Task Details</h1>
                <form onSubmit={handleAddTask} className="space-y-4" encType="multipart/form-data">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            required
                            onChange={handleChange}
                            value={newTask.title}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            required
                            onChange={handleChange}
                            value={newTask.description}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                        <select
                            name="assignedTo"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            required
                            onChange={handleChange}
                            value={newTask.assignedTo}
                        >
                            <option value="">Select Employee</option>
                            {employees && employees.map((employee) => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.fullname}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due On</label>
                        <input
                            type="date"
                            name="dueDate"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            required
                            onChange={handleChange}
                            value={newTask.dueDate}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Attachments  </label>
                        <input
                            type="file"
                            name="attachment"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="submit"
                            className="bg-fuchsia-500 text-white px-4 py-2 rounded hover:bg-fuchsia-700"
                        >
                            ADD
                        </button>
                        <button
                            type="button"
                            onClick={togglePopup}
                            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
