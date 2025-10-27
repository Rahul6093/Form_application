import React, { useState, useEffect } from "react";
import axios from "axios";
import { ApplicationTable } from "./components/ApplicationTable";
import { ApplicationForm } from "./components/ApplicationForm";
import toast,{ Toaster } from "react-hot-toast";

export default function App() {
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/applications");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRowClick = (row) => {
    setSelectedRow(row); // send clicked row to form
  };

  return (
    <div className="min-h-screen w-screen overflow-y-hidden bg-gray-100 py-5">
      <h1 className="text-blue-700 font-bold text-center">Application Form</h1>
      <Toaster position="top-right" reverseOrder={false} toastOptions={ {duration: 5000, removeDelay: 1000} }/>
      <ApplicationForm
        fetchData={fetchData}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
      <ApplicationTable
        data={data}
        fetchData={fetchData}
        onRowClick={handleRowClick}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}
