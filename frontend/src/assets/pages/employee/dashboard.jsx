import { MyTasks } from "./myTaks";
import { EmployeeProjects } from "./projects";
import { EmployeeAnalytics} from "../../pages/employee/mainAnalytics.jsx"
import { NavBar } from "../../components/navBar";
import { Routes, Route } from "react-router-dom";


export const EmployeeDashboard = () => {
  return (
    <div className="flex">
      <NavBar />
      <div className="flex-1 p-4"> 
        <Routes>
          <Route path="/" element={<EmployeeAnalytics/>} />
          <Route path="projects" element={<EmployeeProjects />} />
          <Route path="myTasks" element={<MyTasks />} />
        </Routes>
      </div>
    </div>
  );
};
