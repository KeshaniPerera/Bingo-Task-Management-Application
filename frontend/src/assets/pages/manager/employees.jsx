import { useState, useEffect } from "react";
import { AddEmployeePopup } from "../../components/addEmployeePopup.jsx";
import { useEmployeeStore } from "../../store/employee.js";

export const ManagerEmployees = () => {
    const { employees, fetchEmployees } = useEmployeeStore();

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const [isPopupOpen, setPopupStatus] = useState(false);

    const togglePopup = () => {
        setPopupStatus(!isPopupOpen);
    };

    return (
        <div className="flex mt-5 ml-96">
            <div className="w-3/4 h-auto rounded-md p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="font-semibold text-xl">Employees</h1>
                    <button
                        className="bg-purple-700 text-white font-semibold px-4 rounded-md text-xs tracking-wide p-2"
                        onClick={togglePopup}
                    >
                        ADD EMPLOYEE
                    </button>
                </div>
                <div
                            
                            className="flex items-center space-x-4 p-4 text-neutral-800 text-xs font-bold mb-4"
                        >
                        <p className="flex-1"><strong>Name</strong> </p>
                        <p className="flex-1"><strong>Email</strong> </p>
                        <p className="flex-1"><strong>Contact</strong> </p>
                            </div>

                {employees && employees.length > 0 ? (
                    employees.map((employee, index) => (
                        <div
                            key={index}
                            className="flex items-center space-x-4 p-4 bg-slate-100 text-neutral-500 text-xs font-bold mb-4"
                        >
                            <p className="flex-1"> {employee.fullname}</p>
                            <p className="flex-1"> {employee.email}</p>
                            <p className="flex-1"> {employee.contact}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No employees found.</p>
                )}
            </div>

            {isPopupOpen && <AddEmployeePopup togglePopup={togglePopup} />}
        </div>
    );
};
