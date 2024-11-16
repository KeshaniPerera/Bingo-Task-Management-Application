import { useState } from 'react'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Home} from './assets/pages/home.jsx'
import {Login} from './assets/pages/login.jsx'
import {ManagerDashboard} from './assets/pages/manager/dashboard.jsx'
import {EmployeeDashboard} from './assets/pages/employee/dashboard.jsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from './assets/pages/userContext.jsx';




function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      <UserProvider>

      <Router>
   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/manager/*" element={<ManagerDashboard />} />
        <Route path="/employee/*" element={<EmployeeDashboard />} />


     

      </Routes>
      </Router>
      <ToastContainer />
      </UserProvider>



      </div>
  
    </>
  )
}

export default App
