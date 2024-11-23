import { Link, useNavigate } from 'react-router-dom'; 
import { useUserContext } from '../pages/userContext';

export const NavBar = () => {
    const { userType, setEmail, setUserType, setUserName } = useUserContext(); 
    const navigate = useNavigate(); 

    const handleLogout = () => {
        setEmail("");
        setUserType("");
        setUserName("");
        navigate('/'); 
    };

    return (
        <div className="bg-slate-100 fixed top-0 left-0 h-full w-1/5 p-6 z-10">
            <nav>
                <img 
                    src="Bingo_logo.svg" 
                    className="w-28 mb-4" 
                    alt="Bingo Logo"
                />
                <ul className="flex flex-col space-y-8 font-title m-2 font-topics mt-5">
                    {userType === "manager" ? (
                        <>
                            <li className="flex flex-wrap">
                                <Link to="/manager" className="flex items-center gap-4">
                                    <img src="dashboard.svg" className="w-5" alt="Dashboard Icon" />
                                    <span className="hidden md:inline ml-2">Dashboard</span> {/* Hide text on small screens */}
                                </Link>
                            </li>
                            <li className="flex flex-wrap">
                                <Link to="/manager/Projects" className="flex items-center gap-4">
                                    <img src="project.svg" className="w-5" alt="Projects Icon" />
                                    <span className="hidden md:inline ml-2">Projects</span>
                                </Link>
                            </li>
                            <li className="flex flex-wrap">
                                <Link to="/manager/Employees" className="flex items-center gap-4">
                                    <img src="employees.svg" className="w-5" alt="Employees Icon" />
                                    <span className="hidden md:inline ml-2">Employees</span>
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="flex flex-wrap">
                                <Link to="/employee" className="flex items-center gap-4">
                                    <img src="dashboard.svg" className="w-5" alt="Dashboard Icon" />
                                    <span className="hidden sm:inline ml-2">Dashboard</span>
                                </Link>
                            </li>
                            <li className="flex flex-wrap">
                                <Link to="/employee/projects" className="flex items-center gap-4">
                                    <img src="project.svg" className="w-5" alt="Tasks Icon" />
                                    <span className="hidden sm:inline ml-2">Projects</span>
                                </Link>
                            </li>
                            <li className="flex flex-wrap">
                                <Link to="/employee/myTasks" className="flex items-center gap-4">
                                    <img src="task.svg" className="w-5" alt="Tasks Icon" />
                                    <span className="hidden sm:inline ml-2">Tasks</span>
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
                <li className="flex flex-wrap bg-lightPurple mr-4 p-2 rounded-md mt-96" onClick={handleLogout}>
                    <div className="flex items-center gap-4">
                        <img src="logout.svg" className="w-5" alt="Profile Icon" />
                        <span className="hidden sm:inline ml-2">LOGOUT</span>
                    </div>
                </li>
            </nav>
        </div>
    );
};
