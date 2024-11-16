
import { useState } from "react";
import { useProjectStore } from "../store/project.js";
import Datepicker from "react-tailwindcss-datepicker";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AddProjectPopup = ({ togglePopup }) => {
    const addProject = useProjectStore((state) => state.createProject); 

    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'New'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProject((prevProject) => ({
            ...prevProject,
            [name]: value,
        }));
    };

    const handleDateChange = (value) => {
        setNewProject((prevProject) => ({
            ...prevProject,
            startDate: value.startDate,
            endDate: value.endDate
        }));
    };

    const handleAddProject = async (event) => {
        event.preventDefault();
        if (!newProject.name || !newProject.description || !newProject.startDate || !newProject.endDate || !newProject.status) {
            console.log("All fields are required.");
            return;
        }

        // Convert startDate and endDate to strings
        const projectData = {
            ...newProject,
            startDate: newProject.startDate ? newProject.startDate.toString() : '',
            endDate: newProject.endDate ? newProject.endDate.toString() : ''
        };

        try {
            // Use the addProject action from your project store
            const { success, message } = await addProject(projectData);
            if (success) {
                toast.success(message); // Use the success message returned
                setNewProject({ name: '', description: '', startDate: '', endDate: '', status: 'Created' });
            } else {
                toast.error(message);
            }
        } catch (error) {
            console.error("Error creating project:", error);
            toast.error("Error creating project");
        }
        togglePopup();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h1 className="text-xl font-semibold mb-4">Add Project Details</h1>
                
                <form onSubmit={handleAddProject} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                        <input 
                            type="text" 
                            placeholder="Enter project name" 
                            name="name"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            onChange={handleChange}
                            value={newProject.name}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea 
                            placeholder="Enter project description" 
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            name="description"
                            required
                            onChange={handleChange}
                            value={newProject.description}
                        ></textarea>
                    </div>
                    
                    <Datepicker
                        primaryColor="purple"
                        value={{ startDate: newProject.startDate, endDate: newProject.endDate }}
                        onChange={handleDateChange}
                        showShortcuts={true}
                    /> 
                    
                    <div className="flex justify-end space-x-3">
                        <button 
                            type="submit" 
                            className="bg-fuchsia-500 text-white px-4 py-2 rounded hover:bg-fuchsia-800"
                        >
                            ADD
                        </button>
                        <button 
                            type="button" 
                            onClick={togglePopup} 
                            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-800"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
