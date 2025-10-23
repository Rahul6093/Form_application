import React, { useState, useEffect } from "react";
import axios from "axios";

export const RowModal = ({ row, onClose, fetchData }) => {
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({
    number: "",
    name: "",
    date: "",
    time: "",
    address: "",
    status: "Start",
  });

  useEffect(() => {
    if (row) {
      setFormData({
        number: row.number,
        name: row.name,
        date: row.date?.split("T")[0] || "",
        time: row.time?.slice(0, 5) || "",
        address: row.address,
        status: row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase()
      });
      setEditable(false); // read-only by default
    }
  }, [row]);

  // Close when clicking outside modal
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.id === "modal-overlay") {
        onClose();
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:4000/api/applicationsedit/${formData.number}`, formData);
      fetchData();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update record");
    }
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-[90%] sm:w-[400px] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-center mb-4 text-blue-700">
          Application Details
        </h2>

        <div className="space-y-3 text-gray-700">
          <div>
            <label className="font-semibold">Number:</label>
            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              readOnly
              className={
                            `w-full border rounded px-2 py-1 ${
                            !editable ? "cursor-not-allowed bg-gray-100" : "cursor-text" }`
                        }
            />
          </div>

          <div>
            <label className="font-semibold">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              readOnly={!editable}
              className={
                            `w-full border rounded px-2 py-1 ${
                            !editable ? "cursor-not-allowed bg-gray-100" : "cursor-text" }`
                        }
            />
          </div>

          <div>
            <label className="font-semibold">Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              readOnly={!editable}
              className={
                            `w-full border rounded px-2 py-1 ${
                            !editable ? "cursor-not-allowed bg-gray-100" : "cursor-text" }`
                        }
            />
          </div>

          <div>
            <label className="font-semibold">Time:</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              readOnly={!editable}
              className={
                            `w-full border rounded px-2 py-1 ${
                            !editable ? "cursor-not-allowed bg-gray-100" : "cursor-text" }`
                        }
            />
          </div>

          <div>
            <label className="font-semibold">Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              readOnly={!editable}
              className={
                            `w-full border rounded px-2 py-1 ${
                            !editable ? "cursor-not-allowed bg-gray-100" : "cursor-text" }`
                        }
            />
          </div>

          <div>
            <label className="font-semibold">Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={!editable}
              className={
                            `w-full border rounded px-2 py-1 ${
                            !editable ? "cursor-not-allowed bg-gray-100" : "cursor-text" }`
                        }
            >
              <option value="Start">Start</option>
              <option value="Waiting">Waiting</option>
              <option value="Close">Close</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          {!editable && (
            <button
              onClick={() => setEditable(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Modify
            </button>
          )}
          {editable && (
            <>
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => { setEditable(false); setFormData(row); }}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Close
              </button>
            </>
          )}

          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 font-bold text-lg"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};
