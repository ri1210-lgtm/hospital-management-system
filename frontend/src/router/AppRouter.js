import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Patients from "../pages/Patients";
import RegisterPatient from "../pages/RegisterPatient";
import Prescription from "../pages/Prescription";
import Users from "../pages/Users";
import { ProtectedRoute } from "../utils/auth";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
        <Route path="/register-patient" element={<ProtectedRoute><RegisterPatient /></ProtectedRoute>} />
        <Route path="/prescription" element={<ProtectedRoute><Prescription /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
