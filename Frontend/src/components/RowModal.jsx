import React, { useState, useEffect } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";

export const RowModal = ({ row, onClose, fetchData, setSelectedRow }) => {
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({
    number: "",
    name: "",
    date: "",
    time: "",
    address: "",
    status: "Start",
    email: "",
    sendEmail: false,
  });

  useEffect(() => {
    if (row) {
      setFormData({
        number: row.number,
        name: row.name,
        date: row.date?.split("T")[0] || "", // only YYYY-MM-DD
        time: row.time?.slice(0, 5) || "",
        address: row.address,
        status: row.status || "Start",
        email: row.email || "",
        sendEmail: false,
      });
      setEditable(false);
    }
  }, [row]);

  const handleClose = () => {
  if (setSelectedRow) setSelectedRow(null); // reset the main form
  onClose(); // close modal
  }

  // Close when clicking outside modal
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.id === "modal-overlay") {
        handleClose();
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [handleClose]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      const formattedDate = formData.date?.split("T")[0]; // ensure proper date
      const timeValue = formData.time && formData.time.length === 5 ? `${formData.time}:00` : formData.time;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!emailRegex.test(formData.email)) {
        return toast.error("Please enter a valid email address");
      }

      await axios.put(`http://localhost:4000/api/applicationsedit/${formData.number}`, {
        name: formData.name,
        date: formattedDate,
        time: timeValue,
        address: formData.address,
        status: formData.status,
        email: formData.email,
        sendEmail: formData.sendEmail, // include for conditional email sending
      });

      // Reset the main form
      if (setSelectedRow) setSelectedRow(null);

      fetchData();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update record");
    }
  };

  const inputClass = (isEditable) =>
    `w-full border rounded px-2 py-1 ${isEditable ? "bg-white cursor-text" : "bg-gray-100 cursor-not-allowed"}`;

  return (
    <div id="modal-overlay" className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-[90%] sm:w-[420px] relative" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold text-center mb-4 text-blue-700">Application Details</h2>

        <div className="space-y-3 text-gray-700">
          <div>
            <label className="font-semibold">Number:</label>
            <input type="text" name="number" value={formData.number} readOnly className={inputClass(false)} />
          </div>

          <div>
            <label className="font-semibold">Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} readOnly={!editable} className={inputClass(editable)} />
          </div>

          <div>
            <label className="font-semibold">Date:</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} readOnly={!editable} className={inputClass(editable)} />
          </div>

          <div>
            <label className="font-semibold">Time:</label>
            <input type="time" name="time" value={formData.time} onChange={handleChange} readOnly={!editable} className={inputClass(editable)} />
          </div>

          <div>
            <label className="font-semibold">Address:</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} readOnly={!editable} className={inputClass(editable)} />
          </div>

          <div>
            <label className="font-semibold">Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={!editable}
              className={`w-full border rounded px-2 py-1 ${!editable ? "bg-gray-100 cursor-not-allowed" : "bg-white cursor-pointer"}`}
            >
              <option value="Start">Start</option>
              <option value="Waiting">Waiting</option>
              <option value="Close">Close</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} readOnly={!editable} className={inputClass(editable)} />
          </div>

          {editable && (
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" name="sendEmail" checked={formData.sendEmail} onChange={handleChange} />
              <label>Send email notification?</label>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-4">
          {!editable ? (
            <button onClick={() => setEditable(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Modify
            </button>
          ) : (
            <>
              <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                Save
              </button>
              <button
                onClick={handleClose} // instead of manually resetting modal form
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Close
              </button>
            </>
          )}

          <button onClick={handleClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 font-bold text-lg">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};
