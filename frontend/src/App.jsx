import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";

import Dashboard from './pages/Admin/Dashboard';
import RegisterBond from './pages/Admin/RegisterBond';
import ManageBonds from './pages/Admin/ManageBonds';

import UserDashboard from './pages/User/UserDashboard';

import PrivateRoute from './routes/PrivateRoute';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/register-bonds" element={<RegisterBond />} />
            <Route path="/admin/manage-bonds" element={<ManageBonds />} />
          </Route>

          {/* User Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
          </Route>

        </Routes>
      </Router>
    </div>
  )
}

export default App