import React, { useState, useEffect } from "react";
import axios from "axios";
import { ApplicationTable } from "./components/ApplicationTable";
import { ApplicationForm } from "./components/ApplicationForm";
import { AddUserForm } from './components/AddUserForm';
import toast,{ Toaster } from "react-hot-toast";
import "./App.css";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "./components/ConfirmModal";

export default function App({user}) {
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false); 

  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user"); // remove stored user
    navigate("/login"); // redirect to login page
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/applications");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
     if (user) {
      setIsAdmin(user.permission === "Admin");
    }
    fetchData();
  }, [user]);

  const handleRowClick = (row) => {
    setSelectedRow(row); 
  };

  return (
    <div className="relative min-h-screen w-screen overflow-y-hidden bg-gray-100 py-5">
      <h1 className="text-blue-700 font-bold text-center">Application Form</h1>
      <Toaster position="top-right" reverseOrder={false} toastOptions={{duration: 5000, removeDelay: 1000}} />

      <ApplicationForm
        isAdmin={isAdmin} 
        fetchData={fetchData}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />

      <button
         onClick={() => setLogoutConfirm(true)}
        className="fixed top-10 right-10 z-50 px-5 py-2 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg"
      >
        Logout
      </button>

      {isAdmin && (
        <>
          {/* Manage Users Button */}
          <button
            onClick={() => setShowUserForm(true)}
            className="fixed top-25 right-10 z-50 px-5 py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg"
          >
            Manage Users
          </button>

          {/* AddUserForm Modal */}
          {showUserForm && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowUserForm(false)} // clicking outside closes modal
            >
              <div
                className="bg-white rounded-xl shadow-xl p-6 w-96 max-w-full"
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
              >
                <h2 className="text-gray-800 text-xl font-bold text-center mb-3">
                  Add User Credentials
                </h2>
                <AddUserForm fetchData={fetchData} />
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setShowUserForm(false)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <ApplicationTable
        data={data}
        fetchData={fetchData}
        setSelectedRow={setSelectedRow}
        isAdmin={isAdmin}
      />

      <ConfirmModal
        open={logoutConfirm}
        message="Are you sure you want to logout?"
        onConfirm={handleLogout}
        onCancel={() => setLogoutConfirm(false)}
        variant="bubble_overlay" // optional, depending on styling you want
      />
    </div>
  );
}
