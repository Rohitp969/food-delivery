import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingCart,
  Users,
  BarChart3,
  LogOut,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { FaPlus } from "react-icons/fa";

const menus = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
  { name: "Food List", path: "/admin/food-list", icon: <UtensilsCrossed size={20} /> },
  { name: "AddFood", path: "/admin/add-food", icon: <FaPlus size={14} /> },
  { name: "Orders", path: "/admin/orders", icon: <ShoppingCart size={20} /> },
  { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
  { name: "Sales", path: "/admin/sales", icon: <BarChart3 size={20} /> },
  
];

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    if (saved !== null) setIsCollapsed(JSON.parse(saved));

    const handleMobileToggle = () => setIsMobileOpen(prev => !prev);
    window.addEventListener("mobileSidebarToggle", handleMobileToggle);
    const handleResize = () => { if (window.innerWidth >= 1024) setIsMobileOpen(false); };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mobileSidebarToggle", handleMobileToggle);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
    window.dispatchEvent(new Event("sidebarToggle"));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} h-18 px-4 border-b border-gray-700/50 flex-shrink-0`}>
        <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center w-full" : ""}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20 flex-shrink-0">
            <span className="text-white">GF</span>
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold text-white mt-3">GoFood</h2>
              <p className="text-[10px] text-emerald-400 font-medium tracking-wider uppercase">Admin</p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button onClick={toggleSidebar} className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white">
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* Menu */}
      <div className="flex-1 py-4 px-3 overflow-y-auto">
        {menus.map((menu) => (
          <NavLink
            key={menu.name}
            to={menu.path}
            onClick={() => setIsMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? "bg-emerald-600/20 text-emerald-400 shadow-lg shadow-emerald-500/10"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              } ${isCollapsed ? "justify-center" : ""}`
            }
          >
            <span className="flex-shrink-0">{menu.icon}</span>
            {!isCollapsed && <span className="text-sm font-medium">{menu.name}</span>}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap border border-gray-700 shadow-xl z-50">
                {menu.name}
              </div>
            )}
          </NavLink>
        ))}
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700/50 p-3 flex-shrink-0 space-y-2">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full ${
            isCollapsed ? "justify-center" : ""
          } text-red-400 hover:text-red-300 hover:bg-red-500/10 group relative`}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap border border-gray-700 shadow-xl z-50">
              Logout
            </div>
          )}
        </button>
        {isCollapsed ? (
          <button onClick={toggleSidebar} className="w-full flex justify-center px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 group relative">
            <ChevronRight size={18} />
            <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap border border-gray-700 shadow-xl z-50">Expand</div>
          </button>
        ) : (
          <button onClick={toggleSidebar} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50">
            <ChevronLeft size={18} />
            <span className="text-sm font-medium">Collapse</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setIsMobileOpen(false)} />
      )}
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white z-50 transition-all duration-300 ease-in-out shadow-2xl ${isCollapsed ? "w-20" : "w-64"}`}>
        <SidebarContent />
      </aside>
      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white z-50 transition-transform duration-300 ease-in-out shadow-2xl ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700/50 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20">
                <span className="text-white">GF</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">GoFood</h1>
                <p className="text-[10px] text-emerald-400 font-medium tracking-wider uppercase">Admin</p>
              </div>
            </div>
            <button onClick={() => setIsMobileOpen(false)} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 py-4 px-3 overflow-y-auto">
            {menus.map((menu) => (
              <NavLink key={menu.name} to={menu.path} onClick={() => setIsMobileOpen(false)} className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive ? "bg-emerald-600/20 text-emerald-400" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`
              }>
                {menu.icon}
                <span className="text-sm font-medium">{menu.name}</span>
              </NavLink>
            ))}
          </div>
          <div className="border-t border-gray-700/50 p-3">
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
              <LogOut size={20} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;