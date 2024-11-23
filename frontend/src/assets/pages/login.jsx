import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useEmployeeStore } from "../store/employee.js";
import { useUserContext } from "./userContext.jsx";

export const Login = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const { setEmail, setUserType, setUserName } = useUserContext();
    const { employees, fetchEmployees } = useEmployeeStore();

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const handleChanges = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleLogin = (e) => {
        e.preventDefault();

        if (user.email === "manager" && user.password === "manager") {
            navigate("/manager");
            setEmail(user.email);
            setUserType("manager");
        } else {
            const matchedEmployee = employees.find(
                (employee) =>
                    employee.email === user.email && employee.password === user.password
            );

            if (matchedEmployee) {
                navigate("/employee");
                setEmail(user.email);
                setUserType("employee");
                setUserName(matchedEmployee.fullname);
            } else {
                alert("Invalid username or password");
            }
        }
    };

    const loginAsManager = () => {
        setEmail("manager");
        setUserType("manager");
        navigate("/manager");
    };

    return (
        <div className=" h-screen bg-gray-100 grid md:grid-cols-2">
            {/* Left Side */}
            {/* Left Side */}
<div className="flex-1 flex flex-col justify-center items-center bg-purple-400 text-white p-5">

                <h1 className="text-3xl font-bold mb-4">Manager Login</h1>
                <p className="text-center max-w-lg mb-6">
                    Assume there is only one manager account for the time being as the project is under construction. And only manager can create accounts for the employees. Then the employees can login with those credentials.
                </p>
                <button
                    onClick={loginAsManager}
                    className="bg-white text-purple-800 py-2 px-6 rounded-lg font-medium hover:bg-gray-100 transition duration-300"
                >
                    Login as Manager
                </button>
            </div>

            {/* Right Side */}
           {/* Right Side */}
<div className="flex-1 flex items-center justify-center">

                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg m-5">
                    <img
                        src="Bingo_logo.svg"
                        alt="Bingo Logo"
                        className="w-24 mx-auto mb-6"
                    />
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
                        Employee Login
                    </h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-gray-700 font-medium mb-1"
                            >
                                Email
                            </label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                onChange={handleChanges}
                                value={user.email}
                                placeholder="Enter your email"
                                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-gray-700 font-medium mb-1"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                onChange={handleChanges}
                                value={user.password}
                                placeholder="Enter your password"
                                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-800 transition duration-300"
                        >
                            LOGIN
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
