import { create } from 'zustand';

export const useEmployeeStore = create((set) => ({
    employees: [],

    createEmployee: async (newEmployee) => {
        if (!newEmployee.fullname || !newEmployee.email || !newEmployee.eid || !newEmployee.contact || !newEmployee.password || !newEmployee.position) {
            return { success: false, message: "Please fill all fields" };
        }

        try {
            // Send a POST request to create the employee
            const res = await fetch('http://localhost:5000/api/manager/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEmployee),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Error creating employee:", errorData);
                throw new Error(errorData.message || 'Something went wrong');
            }

            // Get the response data and update the state
            const data = await res.json();
            
            set((state) => ({ employees: [...state.employees, data.data] }));

            return { success: true, message: "Employee created successfully" };
        } catch (error) {
            console.error("Error:", error);
            return { success: false, message: error.message || 'Something went wrong' };
        }
    },

    fetchEmployees: async () => {
        try {
            const res = await fetch('http://localhost:5000/api/manager/employees');
            const data = await res.json();
            console.log("Fetched employees data:", data);
            set({ employees: data.data || [] });
        } catch (error) {
            console.error("Error fetching employees:", error);
            set({ employees: [] }); // Optionally set an empty list if fetch fails
        }
    },
}));
