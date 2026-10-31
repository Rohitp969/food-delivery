import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { useNewOrders } from "../lib/useNewOrders";
import { cx } from "../lib/styles";

const readCollapsed = () => {
  try {
    return JSON.parse(localStorage.getItem("sidebarCollapsed")) === true;
  } catch {
    return false;
  }
};

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const newOrders = useNewOrders();

  const toggleCollapsed = () => {
    setCollapsed((value) => {
      localStorage.setItem("sidebarCollapsed", JSON.stringify(!value));
      return !value;
    });
  };

  return (
    <div className="min-h-screen bg-canvas">
      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        newOrders={newOrders}
      />
      <div className={cx("transition-[padding] duration-200", collapsed ? "lg:pl-[72px]" : "lg:pl-64")}>
        <AdminNavbar onOpenMenu={() => setMobileOpen(true)} newOrders={newOrders} />
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
