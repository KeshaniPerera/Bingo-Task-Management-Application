import { NavBar } from '../../components/navBar.jsx';
import { Routes, Route } from 'react-router-dom';
import { ManagerProjects } from './projects.jsx';
import { ManagerEmployees } from './employees.jsx';
import { ProjectDetails } from './projectDetails.jsx';
import {ManagerAnalytics} from './mainAnalytics.jsx';

export const ManagerDashboard = () => {
  return (
    <div className="flex">
      <NavBar />
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<ManagerAnalytics/>} />
          <Route path="projects" element={<ManagerProjects />} />
          <Route path="projects/:projectId" element={<ProjectDetails />} />
          <Route path="employees" element={<ManagerEmployees />} />
        </Routes>
      </div>
    </div>
  );
};
