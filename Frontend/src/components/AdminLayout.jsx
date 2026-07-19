import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    if (saved !== null) setIsSidebarCollapsed(JSON.parse(saved));

    const handler = () => {
      const saved = localStorage.getItem("sidebarCollapsed");
      if (saved !== null) setIsSidebarCollapsed(JSON.parse(saved));
    };
    window.addEventListener("sidebarToggle", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("sidebarToggle", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div
        className={`min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <AdminNavbar isSidebarCollapsed={isSidebarCollapsed} />
        <div className="pt-16 px-4 md:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;