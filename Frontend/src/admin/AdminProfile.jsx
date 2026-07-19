import React, { useState, useEffect, useRef } from "react";
import { 
  User, Mail, Shield, Calendar, Edit2, Save, X, Camera, Phone, MapPin, Award, CheckCircle
} from "lucide-react";
import { toast } from "react-toastify";

const AdminProfile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    memberSince: "",
    location: "",
    bio: "",
    avatar: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [stats, setStats] = useState({
    totalOrdersManaged: 0,
    totalUsersManaged: 0,
    totalFoodsManaged: 0,
  });

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  });

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Admin User";
    const email = localStorage.getItem("userEmail") || "admin@example.com";
    const role = localStorage.getItem("userRole") || "Administrator";
    const memberSince = localStorage.getItem("memberSince") || "January 2025";
    const phone = localStorage.getItem("userPhone") || "+91 9876543210";
    const location = localStorage.getItem("userLocation") || "Mumbai, India";
    const bio = localStorage.getItem("userBio") || "Passionate about delivering the best food experience.";

    setUser({
      name,
      email,
      phone,
      role,
      memberSince,
      location,
      bio,
      avatar: localStorage.getItem("userAvatar") || "",
    });

    setEditForm({ name, email, phone, location, bio });

    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/dashboard");
      const json = await res.json();
      if (json.success) {
        setStats({
          totalOrdersManaged: json.totalOrders || 0,
          totalUsersManaged: json.totalUsers || 0,
          totalFoodsManaged: json.totalFoods || 0,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getInitials = (name) => {
    if (!name) return "A";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase();
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
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
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

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-1.5 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mt-7">
            My Profile
          </h1>
        </div>
        <p className="text-gray-500 mt-2 ml-4">View and manage your profile information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
        {/* Cover */}
        <div className="h-40 bg-gradient-to-r from-green-500 to-emerald-600 relative">
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-white text-sm font-medium flex items-center gap-2">
            <Shield size={14} />
            Administrator
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row md:items-start gap-6 -mt-12">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-xl">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center text-3xl font-bold">
                    {getInitials(user.name)}
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all hover:scale-110"
              >
                <Camera size={16} />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </div>

            <div className="flex-1 pt-8 md:pt-0">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      <Shield size={12} /> {user.role}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      <Calendar size={12} /> Joined {user.memberSince}
                    </span>
                    {user.phone && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        <Phone size={12} /> {user.phone}
                      </span>
                    )}
                  </div>
                </div>

                {!isEditing && (
                  <button
                    onClick={handleEditClick}
                    className="flex items-center gap-2 px-4 py-2.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl font-medium transition-all hover:shadow-md"
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-8 pb-6">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.totalOrdersManaged}</p>
            <p className="text-sm text-gray-500">Orders Managed</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.totalUsersManaged}</p>
            <p className="text-sm text-gray-500">Users Managed</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.totalFoodsManaged}</p>
            <p className="text-sm text-gray-500">Foods Managed</p>
          </div>
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <div className="px-8 pb-8">
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Edit2 size={18} className="text-green-500" />
                Edit Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" name="name" value={editForm.name} onChange={handleEditChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" name="email" value={editForm.email} onChange={handleEditChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" name="phone" value={editForm.phone} onChange={handleEditChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input type="text" name="location" value={editForm.location} onChange={handleEditChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea name="bio" rows="3" value={editForm.bio} onChange={handleEditChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 resize-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={handleSaveProfile} disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all disabled:opacity-50">
                  {loading ? (<>Saving...</>) : (<><Save size={16} /> Save Changes</>)}
                </button>
                <button onClick={handleCancel} className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all">
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-xl text-green-600"><CheckCircle size={20} /></div>
            <div><p className="text-sm text-gray-500">Account Status</p><p className="font-semibold text-green-600">Active</p></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600"><Award size={20} /></div>
            <div><p className="text-sm text-gray-500">Role</p><p className="font-semibold text-gray-800">{user.role}</p></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><MapPin size={20} /></div>
            <div><p className="text-sm text-gray-500">Location</p><p className="font-semibold text-gray-800">{user.location}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;