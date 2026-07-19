import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaUserCog,
  FaTrash,
  FaEdit,
  FaSpinner,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";
import { toast } from "react-toastify";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    location: "",
    role: "user",
  });

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/admin/users");
      const json = await response.json();
      if (json.success) {
        setUsers(json.users);
      } else {
        toast.error("Failed to load users");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Open delete confirmation modal
  const openDeleteModal = (user) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingUser(null);
  };

  // Confirm delete user
  const confirmDelete = async () => {
    if (!deletingUser) return;
    setIsDeleting(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${deletingUser._id}`,
        {
          method: "DELETE",
        },
      );
      const json = await response.json();
      if (json.success) {
        toast.success(`User "${deletingUser.name}" deleted successfully`);
        fetchUsers(); // refresh list
        closeDeleteModal();
      } else {
        toast.error(json.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Open edit modal
  const openEditModal = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      location: user.location || "",
      role: user.role || "user",
    });
    setShowEditModal(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
  };

  // Handle edit form change
  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  // Submit edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${editingUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editForm),
        },
      );
      const json = await response.json();
      if (json.success) {
        toast.success("User updated successfully");
        fetchUsers();
        closeEditModal();
      } else {
        toast.error(json.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-1.5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mt-7">
            Users Management
          </h1>
        </div>
        <p className="text-gray-500 mt-2 ml-4">Manage all registered users</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Location
                  </th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-[200px] truncate">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 hidden md:table-cell">
                      {user.location || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="group bg-blue-50 hover:bg-blue-500 text-blue-500 hover:text-white p-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                          title="Edit User"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="group bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white p-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                          title="Delete User"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======== DELETE CONFIRMATION MODAL ======== */}
      {showDeleteModal && deletingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                <FaExclamationTriangle className="w-8 h-8 text-rose-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Delete User
                </h2>
                <p className="text-sm text-gray-500">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-slate-600 mb-6">
              Are you sure you want to delete user{" "}
              <span className="font-semibold text-slate-800">
                {deletingUser.name}
              </span>
              ?
              <br />
              <span className="text-sm text-gray-400">
                All data associated with this user will be permanently removed.
              </span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className={`flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 ${
                  isDeleting ? "cursor-not-allowed" : "hover:-translate-y-0.5"
                }`}
              >
                {isDeleting ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash size={14} />
                    Delete User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======== EDIT USER MODAL ======== */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Edit User</h2>
                <p className="text-sm text-gray-400">Update user details</p>
              </div>
              <button
                onClick={closeEditModal}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={editForm.location}
                  onChange={handleEditChange}
                  placeholder="User location"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={editForm.role}
                  onChange={handleEditChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
