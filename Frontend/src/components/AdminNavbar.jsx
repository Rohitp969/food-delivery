import React, { useState, useRef, useEffect } from "react";
import { 
  Bell, 
  Search, 
  Menu, 
  X, 
  LogOut, 
  Settings, 
  HelpCircle, 
  ChevronDown,
  UserCircle,
  LayoutDashboard,
  ShoppingBag,
  Users as UsersIcon,
  UtensilsCrossed
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const AdminNavbar = ({ isSidebarCollapsed }) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Order Received", time: "2 min ago", read: false },
    { id: 2, title: "Payment Successful", time: "15 min ago", read: false },
    { id: 3, title: "New User Registered", time: "1 hour ago", read: true },
  ]);
  
  const adminName = localStorage.getItem("userName") || "Admin";
  const adminEmail = localStorage.getItem("userEmail") || "admin@example.com";
  const adminRole = localStorage.getItem("userRole") || "Administrator";
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    const results = [
      { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={16} /> },
      { name: "Orders", path: "/admin/orders", icon: <ShoppingBag size={16} /> },
      { name: "Users", path: "/admin/users", icon: <UsersIcon size={16} /> },
      { name: "Food List", path: "/admin/food-list", icon: <UtensilsCrossed size={16} /> },
    ].filter(item => 
      item.name.toLowerCase().includes(query)
    );
    setSearchResults(results);
  };

  const navigateTo = (path) => {
    navigate(path);
    setSearchQuery("");
    setSearchResults([]);
    setIsMobileSearchOpen(false);
    setIsProfileOpen(false);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      "/admin/dashboard": "Dashboard",
      "/admin/orders": "Orders",
      "/admin/users": "Users",
      "/admin/food-list": "Food List",
      "/admin/add-food": "Add Food",
      "/admin/sales": "Sales",
      "/admin/profile": "Profile",
      "/admin/settings": "Settings",
      "/admin/help": "Help & Support",
    };
    return titles[path] || "Admin";
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast.success("All notifications marked as read");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Get initials (e.g., "Rohit Prajapati" → "RP")
  const getInitials = (name) => {
    if (!name) return "A";
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    const first = parts[0].charAt(0).toUpperCase();
    const last = parts[parts.length - 1].charAt(0).toUpperCase();
    return first + last;
  };

  return (
    <>
      <nav
        className={`fixed h-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-4 md:px-8 z-40 transition-all duration-300 ${
          isSidebarCollapsed ? "lg:left-20" : "lg:left-64"
        } left-0 right-0 shadow-sm`}
      >
        {/* Left Section */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("mobileSidebarToggle"))}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={22} className="text-gray-700" />
          </button>

          <div className="min-w-0">
            <h1 className="text-lg md:text-xl font-bold text-gray-800 truncate">
              {getPageTitle()}
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">
              Welcome Back 👋
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search */}
          <div className="hidden md:flex relative">
            <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2.5 w-48 lg:w-72 transition-all focus-within:ring-2 focus-within:ring-green-500 focus-within:bg-white">
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
                className="ml-2 bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {searchQuery && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                {searchResults.map((result) => (
                  <button
                    key={result.path}
                    onClick={() => navigateTo(result.path)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="text-gray-500">{result.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{result.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Search */}
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Search"
          >
            <Search size={20} className="text-gray-600" />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-slideDown">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-green-600 hover:text-green-700 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 ${
                          !notif.read ? 'bg-green-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                            notif.read ? 'bg-gray-300' : 'bg-green-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${notif.read ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>
                              {notif.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-4 py-2 border-t border-gray-100 text-center">
                  <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ✅ Avatar ONLY – No name/email outside dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="p-1 rounded-xl hover:bg-gray-100 transition-colors group"
              aria-label="Profile"
            >
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md group-hover:shadow-lg transition-all">
                {getInitials(adminName)}
              </div>
            </button>

            {/* ✅ Dropdown – Shows Full Name, Full Email, and Options */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-slideDown">
                {/* User Info – Full Name & Email */}
                <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md flex-shrink-0">
                      {getInitials(adminName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 truncate">
                        {adminName}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        {adminEmail}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-semibold rounded-full">
                        {adminRole}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu Items – NO Dashboard (already in sidebar) */}
                <div className="py-2">
                  <button
                    onClick={() => navigateTo("/admin/profile")}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                  >
                    <UserCircle size={16} className="text-gray-400" />
                    My Profile
                  </button>
                  <button
                    onClick={() => navigateTo("/admin/settings")}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                  >
                    <Settings size={16} className="text-gray-400" />
                    Settings
                  </button>
                  <button
                    onClick={() => navigateTo("/admin/help")}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                  >
                    <HelpCircle size={16} className="text-gray-400" />
                    Help & Support
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-100 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-sm text-red-600 font-medium"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="md:hidden fixed top-20 left-0 right-0 bg-white border-b border-gray-200 p-4 z-30 shadow-lg animate-slideDown">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-11 pr-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                autoFocus
              />
            </div>
            <button
              onClick={() => {
                setIsMobileSearchOpen(false);
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {searchQuery && searchResults.length > 0 && (
            <div className="mt-3 bg-white rounded-xl border border-gray-200 overflow-hidden">
              {searchResults.map((result) => (
                <button
                  key={result.path}
                  onClick={() => navigateTo(result.path)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
                >
                  <span className="text-gray-500">{result.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{result.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default AdminNavbar;