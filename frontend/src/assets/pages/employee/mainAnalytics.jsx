import { useEffect, useState } from "react";
import { useProjectStore } from "../../store/project.js";
import { useTaskStore } from "../../store/task.js";
import { useUserContext } from ".././userContext.jsx";
import { useSpring, animated } from "react-spring";

export const EmployeeAnalytics = () => {
    const { fetchProjects } = useProjectStore();
    const { fetchTasks } = useTaskStore();
    const [tasks, setTasks] = useState([]);
    const [noOfNewTasks, setNoOfNewTasks] = useState(0);
    const [noOfInProgressTasks, setNoOfInProgressTasks] = useState(0);
    const [noOfProjects, setNoOfProjects] = useState(0);
    
    const { userName } = useUserContext();

    // Animation component with proper syntax
    const Animation = ({ n }) => {
        const { number } = useSpring({
            from: { number: 0 },
            number: n,
            delay: 200,
            config: { mass: 5, tension: 30, friction: 20 },
        });
        return <animated.span>{number.to(val => val.toFixed(0))}</animated.span>;
    };

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const tasksData = await fetchTasks();
                setTasks(tasksData);
                console.log("Tasks:", tasksData);

                // Filter tasks with "New" and "In Progress" statuses assigned to userName
                const newTasks = tasksData.filter(task => task.status === "New" && task.assignedTo === userName);
                const inProgressTasks = tasksData.filter(task => task.status === "In Progress" && task.assignedTo === userName);
                
                // Get unique projects where assignedTo is userName
                const uniqueProjects = new Set(
                    tasksData
                        .filter(task => task.assignedTo === userName)
                        .map(task => task.project)
                );
                
                // Update state variables
                setNoOfNewTasks(newTasks.length);
                setNoOfInProgressTasks(inProgressTasks.length);
                setNoOfProjects(uniqueProjects.size); 
            } catch (error) {
                console.error("Error fetching Tasks:", error);
            }
        };
        loadTasks();
    }, [fetchTasks, userName]);

    return (
        <div className="m-10 lg:ml-96 sm:ml-auto md-ml-60">
            <h1 className="font-bold text-2xl mb-6">Analytics</h1>
            <div className="bg-slate-100 mt-4 p-4 flex flex-col space-y-4 rounded-md items-start mb-4">
                {/* Centered row with three containers */}
                <div className="flex space-x-4 mt-4 justify-center items-center w-full">
                    {/* First container */}
                    <div className="bg-white rounded-md w-44 h-44 flex flex-col items-center justify-center shadow-sm">
                        <h4 className="text-base font-medium mb-4">New Tasks</h4>
                        <span className="text-3xl font-bold text-mediumPurple"><Animation n={noOfNewTasks} /></span>
                    </div>
                    
                    {/* Second container */}
                    <div className="bg-white rounded-md w-44 h-44 flex flex-col items-center justify-center shadow-sm">
                        <h4 className="text-base font-medium mb-4">Tasks In Progress</h4>
                        <span className="text-3xl font-bold text-mediumPurple"><Animation n={noOfInProgressTasks} /></span>
                    </div>
                    
                    {/* Third container */}
                    <div className="bg-white rounded-md w-44 h-44 flex flex-col items-center justify-center shadow-sm">
                        <h4 className="text-base font-medium mb-4">Current Projects</h4>
                        <span className="text-3xl font-bold text-mediumPurple"><Animation n={noOfProjects} /></span>
                    </div>
                </div>
            </div>
            <div className="bg-slate-100 mt-4 p-4 flex flex-col space-y-4 rounded-md items-center mb-4">
                <img src="employee.jpg" alt="employee" className="h-64 justify-center" />
                </div>
        </div>
    );
};
