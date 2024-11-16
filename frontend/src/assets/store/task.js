import { create } from "zustand";

export const useTaskStore = create((set) => ({
    tasks: [],
    
    createTask: async (newTask) => {
        if (!newTask.title || !newTask.description || !newTask.dueDate || !newTask.status || !newTask.project || !newTask.assignedTo || !newTask.attachment) {
            return { success: false, message: "Please fill all fields" };
        }

        const res = await fetch("http://localhost:5000/api/manager/uploadtask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTask),
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error("Error creating task:", errorData);
            throw new Error(errorData.message || "Something went wrong");
        }

        const data = await res.json();
        set((state) => ({ tasks: [...state.tasks, data.data] }));
        return { success: true, message: "Task created successfully" };
    },

    fetchTasks: async () => {
        try {
            const res = await fetch("http://localhost:5000/api/employee/tasks");
            if (!res.ok) {
                throw new Error("Failed to fetch tasks");
            }
            const data = await res.json();
            
        // Ensure tasks is an array before setting it to avoid any undefined issues
        const tasks = Array.isArray(data.data) ? data.data : [];
        set({ tasks });
        
        return tasks; 
    } catch (error) {
        console.error("Error fetching tasks:", error);
        set({ tasks: [] }); // Ensure tasks is always an array in case of an error
        return []; // Return an empty array to prevent undefined errors
    }
},



    uploadTaskAttachment: async (taskId, file) => {
        if (!file) {
            return { success: false, message: "No file selected" };
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("filename", file.name);

        const res = await fetch(`http://localhost:5000/api/uploadtaskAttachment`, {
            method: "POST",
            headers: {
                "filename": file.name,
            },
            body: formData,
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error("Error uploading attachment:", errorData);
            throw new Error(errorData.message || "File upload failed");
        }

        const data = await res.json();
        set((state) => {
            const updatedTasks = state.tasks.map((task) =>
                task._id === taskId ? { ...task, attachment: data.fileId } : task
            );
            return { tasks: updatedTasks };
        });

        return { success: true, message: "Attachment uploaded successfully" };
    },

    fetchTaskByProject: async (projectId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/manager/tasks/${projectId}`);
            if (!res.ok) {
                throw new Error("Failed to fetch tasks");
            }
            const data = await res.json();
            set({ tasks: data.data });
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    },

    
    downloadTaskAttachment: async (filename) => {
        try {
            const res = await fetch(`http://localhost:5000/api/downloadAttachment/${filename}`, {
                method: "GET",
            });

            if (!res.ok) {
                throw new Error("Failed to download attachment");
            }

            // Convert response to blob for download
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            // Create an anchor element to download the file
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();

            // Clean up
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            return { success: true, message: "Attachment downloaded successfully" };
        } catch (error) {
            console.error("Error downloading attachment:", error);
            return { success: false, message: "Failed to download attachment" };
        }
    },
   
    updateStatus: async (status, _id) => {
        if (!status) {
            return { success: false, message: "Please provide the status" };
        }

        try {
            const res = await fetch(`http://localhost:5000/api/employee/updatetaskstatus/${_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Error updating status:", errorData);
                return { success: false, message: errorData.message || "Something went wrong" };
            }

            const data = await res.json();
            console.log("Update successful:", data);

            set((state) => ({
                tasks: state.tasks.map((task) =>
                    task._id === _id ? { ...task, status: data.data.status } : task
                ),
            }));

            return { success: true, message: "Task status updated successfully" };
        } catch (error) {
            console.error("Update failed:", error);
            return { success: false, message: error.message };
        }
    },
    DisplayTaskAttachment: async (filename) => {
        try {
            const res = await fetch(`http://localhost:5000/api/viewAttachmentByName/${filename}`, {
                method: "GET",
            });
    
            if (!res.ok) {
                throw new Error("Failed to fetch attachment");
            }
    
            // Convert response to a blob
            const blob = await res.blob();
    
            // Ensure the blob has the correct image type 
            const fileType = blob.type; // This should match the content type set on the server
    
            if (!fileType.startsWith("image/")) {
                throw new Error("Fetched file is not an image");
            }
    
            // Create a blob URL
            const url = URL.createObjectURL(blob);
    
            // Return the URL for use in an image tag
            return { success: true, url };
    
        } catch (error) {
            console.error("Error displaying attachment:", error);
            return { success: false, message: "Failed to display attachment" };
        }
    }
    
    
    
}));