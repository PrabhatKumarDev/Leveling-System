import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthForm from "./AuthForm";
import DashboardLayout from "./DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import DashboardHome from "./DashboardHome";
import Habits from "./Habits";
import Shop from "./Shop";
import Inventory from "./Inventory";

const AppRoutes = () => {
  return (
    <>
     <Routes className="min-h-screen overflow-x-hidden">
      {/* Public */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <AuthForm />
          </PublicRoute>
        }
      />

      {/* Protected Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Nested routes */}
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="habits" element={<Habits />} />
        <Route path="shop" element={<Shop />} />
<Route path="inventory" element={<Inventory />} />
      </Route>
    </Routes>
    </>
  );
};

export default AppRoutes;
