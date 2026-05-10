import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiCalendar,
  FiShield,
  FiUserCheck,
  FiUserX,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";
import Navbar from "../components/layout/Navbar";
import ConfirmModal from "../components/common/ConfirmModal";
import AlertModal from "../components/common/AlertModal";

const AdminUsers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { users, fetchUsers, updateUserRole, deleteUser, loading } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [showRoleConfirm, setShowRoleConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    loadUsers();
  }, [user, navigate]);

  const loadUsers = async () => {
    await fetchUsers();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const handleRoleClick = (userId, currentRole, userName) => {
    setSelectedUser({ id: userId, role: currentRole, name: userName });
    setNewRole(currentRole === "admin" ? "user" : "admin");
    setShowRoleConfirm(true);
  };

  const confirmRoleChange = async () => {
    await updateUserRole(selectedUser.id, newRole);
    setShowRoleConfirm(false);
    setAlertConfig({
      title: "Success",
      message: `${selectedUser.name}'s role has been changed to ${newRole}`,
      type: "success",
    });
    setShowAlert(true);
    setSelectedUser(null);
  };

  const handleDeleteClick = (userId, userName) => {
    setSelectedUser({ id: userId, name: userName });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    await deleteUser(selectedUser.id);
    setShowDeleteConfirm(false);
    setAlertConfig({
      title: "Success",
      message: `${selectedUser.name} has been deleted successfully.`,
      type: "success",
    });
    setShowAlert(true);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || u.role === roleFilter;

    return matchesSearch && matchesRole && u._id !== user?.id;
  });

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-emerald-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition"
            >
              <FiArrowLeft /> Back
            </button>
            <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-40 h-40 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
              </div>
              <div className="relative z-10 px-6 py-3">
                <h1 className="text-2xl font-bold text-white">
                  User Management
                </h1>
              </div>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition"
          >
            <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
            >
              <option value="all">All Roles</option>
              <option value="user">Regular Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-700/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                          <FiUser className="w-4 h-4 text-white" />
                        </div>
                        <Link
                          to={`/profile/${u._id}`}
                          className="font-medium text-white hover:text-emerald-400 hover:underline transition"
                        >
                          {u.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <FiMail className="text-gray-500" size={14} />
                        {u.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <FiCalendar className="text-gray-500" size={14} />
                        {new Date(u.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-medium inline-flex items-center gap-1 ${
                          u.role === "admin"
                            ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                            : "bg-gray-700 text-emerald-400"
                        }`}
                      >
                        <FiShield size={12} />
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRoleClick(u._id, u.role, u.name)}
                          className="p-2 text-emerald-400 hover:bg-gray-700 rounded-lg transition"
                          title={
                            u.role === "admin" ? "Remove admin" : "Make admin"
                          }
                        >
                          {u.role === "admin" ? (
                            <FiUserX size={18} />
                          ) : (
                            <FiUserCheck size={18} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteClick(u._id, u.name)}
                          className="p-2 text-red-400 hover:bg-gray-700 rounded-lg transition"
                          title="Delete user"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiUser className="w-10 h-10 text-gray-500" />
              </div>
              <p className="text-gray-400">No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Role Change Modal */}
      <ConfirmModal
        isOpen={showRoleConfirm}
        onClose={() => setShowRoleConfirm(false)}
        onConfirm={confirmRoleChange}
        title="Change User Role"
        message={`Are you sure you want to change ${selectedUser?.name}'s role from "${selectedUser?.role}" to "${newRole}"?`}
        confirmText="Yes, Change Role"
        cancelText="Cancel"
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete user "${selectedUser?.name}"? This will also delete all their items and cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </div>
  );
};

export default AdminUsers;
