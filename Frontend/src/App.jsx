import React, { useState, useEffect } from "react";
import axios from "axios";
import { ApplicationTable } from "./components/ApplicationTable";
import { ApplicationForm } from "./components/ApplicationForm";
import { AddUserForm } from './components/AddUserForm';
import toast,{ Toaster } from "react-hot-toast";
import "./App.css";

export default function App({user}) {
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false); 

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
    setSelectedRow(row); // send clicked row to form
  };

  return (
          <div className="relative min-h-screen w-screen overflow-y-hidden bg-gray-100 py-5">
                <h1 className="text-blue-700 font-bold text-center">Application Form</h1>
                <Toaster position="top-right" reverseOrder={false} toastOptions={ {duration: 5000, removeDelay: 1000} }/>
                <ApplicationForm
                  isAdmin={isAdmin} 
                  fetchData={fetchData}
                  selectedRow={selectedRow}
                  setSelectedRow={setSelectedRow}
                />

                 {/* Right: Admin Panel */}
                {isAdmin && (
                  <div className=" absolute right-0 z-index-10 top-20 mr-1">
                    <button
                      onClick={() => setShowUserForm(!showUserForm)}
                      className="bg-blue-500 text-white px-3 py-2 rounded mb-4 w-full"
                    >
                      {showUserForm ? "Hide Add User Form" : "Add New User"}
                    </button>

                    {showUserForm && (
                      <div className="bg-white p-4 rounded shadow-md absolute -ml-15">
                        {/* Add User Form */}
                        <h2 className="text-blue-700 font-bold mb-2 text-center">Add User Credentials</h2>
                        <AddUserForm fetchData={fetchData} />
                      </div>
                    )}
                  </div>
                )}

                <ApplicationTable
                  data={data}
                  fetchData={fetchData}
                  onRowClick={handleRowClick}
                  setSelectedRow={setSelectedRow}
                  isAdmin={isAdmin}
                />
          </div>
  );

}
