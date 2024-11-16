import { create } from 'zustand';

export const useProjectStore = create((set) => ({
    projects: [],
    employeeProjects: [], 
    setProjects: (projects) => set({ projects }),

    createProject: async (newProject) => {
        if (!newProject.name || !newProject.description || !newProject.startDate || !newProject.endDate || !newProject.status) {
            return { success: false, message: "Please fill all fields" };
        }

        const res = await fetch('http://localhost:5000/api/manager/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProject),
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error("Error creating project:", errorData);
            throw new Error(errorData.message || 'Something went wrong');
        }

        const data = await res.json();
        set((state) => ({ projects: [...state.projects, data.data] }));

        return { success: true, message: "Project created successfully" };
    },

  fetchProjects: async () => {
    try {
        const res = await fetch('http://localhost:5000/api/manager/projects');
        const data = await res.json();
        console.log("Fetched projects data:", data);
        
        const projects = Array.isArray(data.data) ? data.data : [];
        set({ projects });
        
        return projects; // Return the fetched projects array
    } catch (error) {
        console.error("Error fetching projects:", error);
        set({ projects: [] }); // Ensure projects is always an array in case of an error
        return []; // Return an empty array to prevent undefined errors
    }
},



    fetchProjectById: async (id) => {
        const res = await fetch(`http://localhost:5000/api/manager/projects/${id}`);
        if (!res.ok) {
            throw new Error("Failed to fetch project details");
        }
        const data = await res.json();
        return data.data;
    },

    fetchEmployeeTasks: async (employee) => {
        const res = await fetch(`http://localhost:5000/api/employee/projects/employee/${employee}`);
        if (!res.ok) {
            throw new Error("Failed to fetch employee projects");
        }
        const data = await res.json();
        set({ employeeProjects: data.data || [] });
        return data.data; 
    },
    updateStatus: async (status, _id) => {
        if (!status) {
            return { success: false, message: "Please provide the status" };
        }

        try {
            const res = await fetch(`http://localhost:5000/api/manager/updateprojectstatus/${_id}`, {


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

         

            return { success: true, message: "Project status marked completed" };
        } catch (error) {
            console.error("Update failed:", error);
            return { success: false, message: error.message };
        }
    },



}));
