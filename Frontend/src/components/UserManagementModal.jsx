import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// User Management Modal
export const UserManagementModal = ({ show, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (show) fetchUsers();
  }, [show]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/users");
      setUsers(res.data);
      console.log("Fetched users:", res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...users];
    updated[index][field] = value;
    setUsers(updated);
  };

  const handleSave = async () => {
    setLoading(true);
    console.log("All users", users);
    try {
      for (const user of users) {
        console.log("Updating user no:", user.id);
        await axios.put(`http://localhost:4000/api/users/${user.id}`, user);
       
      }    
      toast.success("Users updated successfully!");
      fetchUsers();
      onClose();
    } catch (err) {
      console.error(err);
    //   console.log("id no:", id);
      console.log("error:", err);
      toast.error("Failed to update users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/users/${id}`);
      toast.success("User deleted!");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded w-3/4 max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-blue-700">User Management</h2>
        <div className="overflow-x-auto max-h-[60vh]">
          <table className="w-full border border-gray-300">
            <thead className=" bg-blue-500 text-white">
              <tr>
                <th className="border px-2 py-1">Username</th>
                <th className="border px-2 py-1">Password</th>
                <th className="border px-2 py-1">Permission</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user.id}>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      value={user.username}
                      onChange={(e) => handleChange(i, "username", e.target.value)}
                      className="border px-1 py-0.5 rounded w-full"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      value={user.password}
                      onChange={(e) => handleChange(i, "password", e.target.value)}
                      className="border px-1 py-0.5 rounded w-full"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <select
                      value={user.permission}
                      onChange={(e) => handleChange(i, "permission", e.target.value)}
                      className="border px-1 py-0.5 rounded w-full"
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="border px-2 py-1">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};