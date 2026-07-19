import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/ContextReducer";
import { toast } from "react-toastify";
import {
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaHome,
  FaClipboardList,
  FaSignOutAlt,
  FaUser,
  FaHeart,
  FaMapMarkerAlt,
  FaCog,
  FaBell,
  FaQuestionCircle,
} from "react-icons/fa";

const Navbar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const data = useCart();
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("userEmail") || "Guest";
  const userName = localStorage.getItem("userName") || "User";
  const isLoggedIn = !!localStorage.getItem("authToken");

  const getInitials = (name) => {
    if (!name || name === "Guest") return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    toast.success("Logout Successful 👋");
    navigate("/login");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 sm:h-20 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group no-underline">
              <span className="text-2xl sm:text-3xl transition-transform group-hover:scale-105">🍔</span>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                GoFood
              </span>
            </Link>

            {/* Desktop Navigation – only Home & My Orders */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="text-white/80 hover:text-white font-medium transition-colors duration-200 no-underline"
              >
                Home
              </Link>
              {isLoggedIn && (
                <Link
                  to="/myorder"
                  className="text-white/80 hover:text-white font-medium transition-colors duration-200 no-underline"
                >
                  My Orders
                </Link>
              )}
            </div>

            {/* Right Section – Cart Icon + Profile */}
            <div className="flex items-center gap-2">
              {/* ✅ Cart Icon – only here, no text */}
              {isLoggedIn && (
                <button 
                  onClick={() => navigate("/cart")}
                  className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
                  aria-label="Cart"
                >
                  <FaShoppingCart className="text-white/80 hover:text-white text-lg" />
                  {data.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-yellow-400 text-slate-900 text-[10px] font-bold rounded-full shadow-lg shadow-yellow-400/30">
                      {data.length}
                    </span>
                  )}
                </button>
              )}

              {/* Profile */}
              <div className="ml-1">
                <div className="hidden md:flex items-center gap-2">
                  {isLoggedIn ? (
                    <div className="relative">
                      <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-xs font-bold text-slate-900 shadow-md">
                          {getInitials(userName)}
                        </div>
                        <svg
                          className={`w-3 h-3 text-white/60 transition-transform duration-200 ${
                            showProfile ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {showProfile && (
                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50">
                          <div className="p-4 text-center border-b border-gray-100 dark:border-gray-700">
                            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-lg font-bold text-slate-900 shadow-lg">
                              {getInitials(userName)}
                            </div>
                            <h4 className="mt-2 font-semibold text-gray-800 dark:text-white text-sm break-all">
                              {userName}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 break-all">
                              {userEmail}
                            </p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-medium rounded-full">
                              Customer
                            </span>
                          </div>

                          <div className="p-1.5">
                            <Link
                              to="/myorder"
                              onClick={() => setShowProfile(false)}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors no-underline"
                            >
                              <FaClipboardList className="text-gray-400" />
                              <span>My Orders</span>
                            </Link>
                            <Link
                              to="/wishlist"
                              onClick={() => setShowProfile(false)}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors no-underline"
                            >
                              <FaHeart className="text-gray-400" />
                              <span>Wishlist</span>
                            </Link>
                           
                            <Link
                              to="/profile"
                              onClick={() => setShowProfile(false)}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors no-underline"
                            >
                              <FaUser className="text-gray-400" />
                              <span>My Profile</span>
                            </Link>
                            <Link
                              to="/settings"
                              onClick={() => setShowProfile(false)}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors no-underline"
                            >
                              <FaCog className="text-gray-400" />
                              <span>Account Settings</span>
                            </Link>
                           
                            <Link
                              to="/help"
                              onClick={() => setShowProfile(false)}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors no-underline"
                            >
                              <FaQuestionCircle className="text-gray-400" />
                              <span>Help & Support</span>
                            </Link>
                          </div>

                          <button
                            onClick={() => {
                              setShowProfile(false);
                              handleLogout();
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 text-sm transition-colors"
                          >
                            <FaSignOutAlt />
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Link
                        to="/login"
                        className="px-3 py-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors no-underline"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="px-4 py-1.5 text-sm font-semibold bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-full shadow-lg shadow-yellow-400/20 transition-all duration-200 hover:scale-105 no-underline"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-white/80 hover:text-white text-2xl p-1.5"
                aria-label="Toggle menu"
              >
                {menuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>

        {/* ✅ Mobile Menu – No Cart Link, Logout at bottom */}
        {menuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-sm border-t border-white/10 px-4 py-3 shadow-2xl">
            <div className="flex flex-col gap-1.5">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors text-sm no-underline"
              >
                <FaHome className="text-yellow-400" />
                Home
              </Link>
              {isLoggedIn && (
                <>
                  <Link
                    to="/myorder"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors text-sm no-underline"
                  >
                    <FaClipboardList className="text-yellow-400" />
                    My Orders
                  </Link>
                  {/* ❌ Cart link removed from mobile menu – icon already in top navbar */}
                  <Link
                    to="/wishlist"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors text-sm no-underline"
                  >
                    <FaHeart className="text-yellow-400" />
                    Wishlist
                  </Link>
                 
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors text-sm no-underline"
                  >
                    <FaUser className="text-yellow-400" />
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors text-sm no-underline"
                  >
                    <FaCog className="text-yellow-400" />
                    Account Settings
                  </Link>
                
                  <Link
                    to="/help"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors text-sm no-underline"
                  >
                    <FaQuestionCircle className="text-yellow-400" />
                    Help & Support
                  </Link>
                </>
              )}

              <hr className="border-white/10 my-1" />

              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 text-white/60">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-xs font-bold text-slate-900">
                      {getInitials(userName)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white truncate">{userName}</p>
                      <p className="text-xs text-white/50 truncate">{userEmail}</p>
                    </div>
                  </div>
                  {/* ✅ Logout button - always visible */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors font-medium text-sm"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-center py-2.5 rounded-lg border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-all text-sm no-underline"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="text-center py-2.5 rounded-lg bg-yellow-400 text-slate-900 font-bold hover:bg-yellow-500 transition-all text-sm no-underline"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .md\\:hidden.bg-slate-900\\/95 {
          animation: slideDown 0.2s ease-out;
        }
        a {
          text-decoration: none !important;
        }
      `}</style>
    </>
  );
};

export default Navbar;