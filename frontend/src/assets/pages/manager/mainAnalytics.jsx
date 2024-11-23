import { useEffect, useState } from "react";
import { useProjectStore } from "../../store/project.js";
import { useSpring, animated } from "react-spring";

export const ManagerAnalytics = () => {
    const { fetchProjects } = useProjectStore();
    const [projects, setProjects] = useState([]);
    const [noOfInProgressProjects, setNoOfInProgressProjects] = useState(0);
    const [noOfCompletedProjects, setNoOfCompletedProjects] = useState(0);
    const [noOfNewProjects, setNoOfNewProjects] = useState(0);

    const Animation = ({ n }) => {
        const { number } = useSpring({
            from: { number: 0 },
            number: n,
            delay: 200,
            config: { mass: 5, tension: 30, friction: 20 },
        });
        return <animated.span>{number.to((val) => val.toFixed(0))}</animated.span>;
    };

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const projectsData = await fetchProjects();
                setProjects(projectsData);

                const newProjects = projectsData.filter(project => project.status === "New");
                const inProgressProjects = projectsData.filter(project => project.status === "In Progress");
                const completedProjects = projectsData.filter(project => project.status === "Completed");

                setNoOfInProgressProjects(inProgressProjects.length);
                setNoOfCompletedProjects(completedProjects.length);
                setNoOfNewProjects(newProjects.length);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        loadProjects();
    }, [fetchProjects]);

    return (
        <div className="m-10 lg:ml-96  md-ml-60">
            <h1 className="font-bold text-2xl mb-6">Analytics</h1>
            <div className="bg-slate-100 mt-4 p-4 space-y-4 rounded-md flex justify-center items-center">

                {/* Centered row with three containers */}
                <div className="grid gap-4 justify-center items-center sm:grid-cols-1 md:grid-cols-3">
                    {/* First container */}
                    <div className="flex flex-col bg-white rounded-md w-44 h-44 items-center justify-center shadow-sm">
                        <h4 className="text-base font-medium mb-4">New Projects</h4>
                        <span className="text-3xl font-bold text-mediumPurple">
                            <Animation n={noOfNewProjects} />
                        </span>
                    </div>

                    {/* Second container */}
                    <div className="flex flex-col bg-white rounded-md w-44 h-44 items-center justify-center shadow-sm">
                        <h4 className="text-base font-medium mb-4">In Progress</h4>
                        <span className="text-3xl font-bold text-mediumPurple">
                            <Animation n={noOfInProgressProjects} />
                        </span>
                    </div>

                    {/* Third container */}
                    <div className="flex flex-col bg-white rounded-md w-44 h-44 items-center justify-center shadow-sm">
                        <h4 className="text-base font-medium mb-4">Completed Projects</h4>
                        <span className="text-3xl font-bold text-mediumPurple">
                            <Animation n={noOfCompletedProjects} />
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-slate-100 mt-4 p-4 flex flex-col space-y-4 rounded-md items-center mb-4">
                <img src="manager.jpg" alt="manager" className="h-64 justify-center" />
            </div>
        </div>
    );
};
