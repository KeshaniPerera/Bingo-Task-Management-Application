import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEmployeeStore } from '../store/employee';

export const AddEmployeePopup = ({ togglePopup }) => {
    const [newEmployee, setNewEmployee] = useState({
        fullname: '',
        eid: '',
        email: '',
        contact: '',
        password: '',
        position: '',
    });

    const { createEmployee } = useEmployeeStore();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee((prevEmployee) => ({
            ...prevEmployee,
            [name]: value,
        }));
    };

    const handleAddEmployee = async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Basic validation check
        if (!newEmployee.fullname || !newEmployee.eid || !newEmployee.email || !newEmployee.contact || !newEmployee.password || !newEmployee.position) {
            toast.error("All fields are required.");
            return;
        }

        const { success, message } = await createEmployee(newEmployee);

        if (success) {
            toast.success(message);
            setNewEmployee({ fullname: '', eid: '', email: '', contact: '', password: '', position: '' });
        } else {
            toast.error(message);
        }

        togglePopup();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h1 className="text-xl font-semibold mb-4">Add Employee Details</h1>
                <form onSubmit={handleAddEmployee} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="fullname"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            required
                            onChange={handleChange}
                            value={newEmployee.fullname}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">EID</label>
                        <input
                            type="text"
                            name="eid"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            required
                            onChange={handleChange}
                            value={newEmployee.eid}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            required
                            onChange={handleChange}
                            value={newEmployee.email}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                        <input
                            type="text"
                            name="position"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            required
                            onChange={handleChange}
                            value={newEmployee.position}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                        <input
                            type="text"
                            name="contact"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            required
                            onChange={handleChange}
                            value={newEmployee.contact}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            required
                            onChange={handleChange}
                            value={newEmployee.password}
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
