import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#070b12] text-white overflow-x-hidden">
      <Sidebar />
      <main className="min-w-0 md:ml-72 md:w-[calc(100%-18rem)]">
        <div className="px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;