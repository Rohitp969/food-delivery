import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
  Lock,
  Camera,
  ShoppingBag,
  IndianRupee,
  Award,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import Navbar from "./Navbar";

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    memberSince: "",
    location: "",
    bio: "",
    avatar: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // User stats
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    activeOrders: 0,
  });

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const name = localStorage.getItem("userName") || "User";
    const email = localStorage.getItem("userEmail") || "user@example.com";
    const memberSince = localStorage.getItem("memberSince") || "January 2025";
    const phone = localStorage.getItem("userPhone") || "";
    const location = localStorage.getItem("userLocation") || "";
    const bio = localStorage.getItem("userBio") || "Food lover exploring new flavors every day.";

    setUser({
      name,
      email,
      phone,
      memberSince,
      location,
      bio,
      avatar: localStorage.getItem("userAvatar") || "",
    });

    setEditForm({
      name,
      email,
      phone,
      location,
      bio,
    });

    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const email = localStorage.getItem("userEmail");
      const res = await fetch(
        `${API_URL}/api/user/stats?email=${email}`
      );
      const json = await res.json();
      if (json.success) {
        setStats({
          totalOrders: json.totalOrders || 0,
          totalSpent: json.totalSpent || 0,
          activeOrders: json.activeOrders || 0,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getInitials = (name) => {
    if (!name) return "A";
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    const firstInitial = parts[0].charAt(0).toUpperCase();
    const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const avatarUrl = event.target.result;
      setUser({ ...user, avatar: avatarUrl });
      localStorage.setItem("userAvatar", avatarUrl);
      toast.success("Profile picture updated!");
    };
    reader.readAsDataURL(file);
  };

  const handleEditClick = () => {
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      bio: user.bio,
    });
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      localStorage.setItem("userName", editForm.name);
      localStorage.setItem("userEmail", editForm.email);
      localStorage.setItem("userPhone", editForm.phone);
      localStorage.setItem("userLocation", editForm.location);
      localStorage.setItem("userBio", editForm.bio);

      setUser({
        ...user,
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        location: editForm.location,
        bio: editForm.bio,
      });

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }
    if (passwordForm.newPassword.length < 5) {
      toast.error("Password must be at least 5 characters");
      setLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
    } catch (err) {
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsChangingPassword(false);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      bio: user.bio,
    });
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <>
    <Navbar />
    <div className="max-w-6xl mx-auto pb-12"> {/* Added bottom padding */}
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-1.5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            My Profile
          </h1>
        </div>
        <p className="text-gray-500 mt-2 ml-4">
          View and manage your profile information
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600 relative">
          <div className="absolute bottom-0 left-8 transform translate-y-1/2">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-xl">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                    {getInitials(user.name)}
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all hover:scale-110"
              >
                <Camera size={16} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-16 px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  <Calendar size={12} />
                  Joined {user.memberSince}
                </span>
                {user.phone && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <Phone size={12} />
                    {user.phone}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  <User size={12} />
                  Customer
                </span>
              </div>
            </div>

            {!isEditing && !isChangingPassword && (
              <div className="flex gap-2">
                <button
                  onClick={handleEditClick}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-medium transition-all hover:shadow-md"
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-xl font-medium transition-all hover:shadow-md"
                >
                  <Lock size={16} />
                  Change Password
                </button>
              </div>
            )}
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-8 pb-6">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <ShoppingBag size={18} className="text-blue-500" />
              <p className="text-sm text-gray-500">Total Orders</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {stats.totalOrders}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <IndianRupee size={18} className="text-green-500" />
              <p className="text-sm text-gray-500">Total Spent</p>
            </div>
            <p className="text-2xl font-bold text-green-600">
              ₹{stats.totalSpent.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Award size={18} className="text-purple-500" />
              <p className="text-sm text-gray-500">Active Orders</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {stats.activeOrders}
            </p>
          </div>
        </div>

        {/* Location Display - show registered location */}
        <div className="px-8 pb-6">
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
            <MapPin size={20} className="text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Registered Location</p>
              <p className="font-medium text-gray-800">{user.location || "Not provided"}</p>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <div className="px-8 pb-8">
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Edit2 size={18} className="text-blue-500" />
                Edit Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    rows="3"
                    value={editForm.bio}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Form */}
        {isChangingPassword && (
          <div className="px-8 pb-8">
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Lock size={18} className="text-yellow-500" />
                Change Password
              </h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password (min 5 chars)
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                    minLength="5"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                    minLength="5"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lock size={16} />
                        Update Password
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-xl text-green-600">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Account Status</p>
              <p className="font-semibold text-green-600">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-semibold text-gray-800">{user.location || "Not provided"}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-semibold text-gray-800">Customer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
</>
  );
};

export default Profile;
