import { useNavigate } from "react-router-dom";

export const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center h-screen bg-gray-100 text-center">
            <img 
                src="Bingo_logo.svg" 
                alt="Bingo Logo" 
                className="h-36 mb-2" 
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Welcome to Bingo!
            </h1>
            <p className="text-gray-600 text-md mb-8 px-8 max-w-screen-lg">
                Make your like easier with Bingo, designed to help teams collaborate effectively, streamline workflows, and achieve goals faster. Whether you're managing projects, assigning tasks, or tracking progress, Bingo has you covered!
            </p>
            <button 
                onClick={() => navigate("/login")} 
                className="bg-purple-500 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-md shadow-md transform transition duration-300 hover:scale-105 justify-center flex items-center gap-1"
            >
                GET STARTED
                <img src="right.png" alt="Login Icon" className="w-5 inline ml-2" />
        
            </button>

            <img src="home.png" alt="Login Icon" className="max-w-screen-md inline ml-2 mt-10" />

        </div>
    );
};
