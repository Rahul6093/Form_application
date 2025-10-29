import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UserManagementModal } from "./UserManagementModal";
import { ConfirmModal } from "./ConfirmModal";

export const AddUserForm = ({ fetchData }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    permission: "User",
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
    setConfirmOpen(false);
    setLoading(true);
    try {
      await axios.post("http://localhost:4000/api/users", formData);
      toast.success("User added successfully!");
      setFormData({ username: "", password: "", permission: "User" });
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, permission } = formData;
    if (!username || !password || !permission) {
      return toast.error("All fields are required");
    }

    if (password.length < 6) {
      return toast.error("Password should be at least 6 characters");
    }
    setConfirmOpen(true); 
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="relative space-y-3 text-gray-800">
        <div className="flex flex-col">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="border px-2 py-1 rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border px-2 py-1 rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label>Permission</label>
          <select
            name="permission"
            value={formData.permission}
            onChange={handleChange}
            className="border px-2 py-1 rounded"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`flex-1 p-2 mt-2 text-white rounded ${
              loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? "Adding..." : "Add User"}
          </button>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex-1 p-2 mt-2 text-white rounded bg-blue-500 hover:bg-blue-600"
          >
            Edit Users
          </button>
        </div>
      </form>

      <UserManagementModal show={showModal} onClose={() => setShowModal(false)} />

      <ConfirmModal
        open={confirmOpen}
        message={`Are you sure you want to add ${formData.username}?`}
        onConfirm={handleAddUser}
        onCancel={() => setConfirmOpen(false)}
        variant = "bubble_overlay"
      />
    </>
  );
}