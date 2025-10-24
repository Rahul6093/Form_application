import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const ApplicationForm = ({ fetchData, selectedRow, setSelectedRow }) => {
  const [formData, setFormData] = useState({
    number: "",
    name: "",
    date: "",
    time: "",
    address: "",
    status: "Start",
    email: "",
    sendEmail: true,
  });

  const [isEdit, setIsEdit] = useState(false);
  const [originalNumber, setOriginalNumber] = useState(null); // ✅ track original number

  // Populate form on edit via selectedRow
  useEffect(() => {
    if (selectedRow) {
      setFormData({
        number: selectedRow.number,
        name: selectedRow.name,
        date: selectedRow.date?.split("T")[0] || "",
        time: selectedRow.time?.slice(0, 5) || "",
        address: selectedRow.address,
        status: selectedRow.status,
        email: selectedRow.email,
        sendEmail: false,
      });
      setOriginalNumber(selectedRow.number); // ✅ store original
      setIsEdit(true);
    } else {
      resetForm();
    }
  }, [selectedRow]);

  const resetForm = () => {
    setFormData({
      number: "",
      name: "",
      date: "",
      time: "",
      address: "",
      status: "Start",
      email: "",
      sendEmail: true,
    });
    setOriginalNumber(null);
    setIsEdit(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Auto-load on Enter in Number field
  const handleNumberKeyPress = async (e) => {
    if (e.key === "Enter" && formData.number) {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/applications/${formData.number}`
        );
        if (res.data) {
          setFormData({
            number: res.data.number,
            name: res.data.name,
            date: res.data.date?.split("T")[0] || "",
            time: res.data.time?.slice(0, 5) || "",
            address: res.data.address,
            status: res.data.status,
            email: res.data.email,
            sendEmail: false,
          });
          setOriginalNumber(res.data.number); // ✅ store original for editing
          setIsEdit(true);
        } else {
          alert("Record not found");
        }
      } catch (err) {
        console.error(err);
        alert("Error fetching record");
      }
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.number ||
      !formData.name ||
      !formData.date ||
      !formData.time ||
      !formData.address ||
      !formData.email
    ) {
      return alert("All fields are required, including email");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
    return toast.error("Please enter a valid email address");
   }

    const timeValue =
      formData.time.length === 5 ? `${formData.time}:00` : formData.time;

    try {
      if (isEdit) {
        // ✅ Use originalNumber instead of possibly edited formData.number
        await axios.put(
          `http://localhost:4000/api/applicationsedit/${originalNumber}`,
          {
            name: formData.name,
            date: formData.date,
            time: timeValue,
            address: formData.address,
            status: formData.status,
            email: formData.email,
            sendEmail: formData.sendEmail,
          }
        );

        if (formData.number !== originalNumber) {
          toast(`Number field changed but original record ${originalNumber} was updated!`, {
            icon: "⚠️",
          });} 
        else {
          toast.success("Record updated successfully!");
        }

      } else {
        await axios.post("http://localhost:4000/api/applicationsadd", formData);
      }

      fetchData();
      setSelectedRow(null);
      resetForm(); // ✅ clear form
    } catch (err) {
      console.error(err);
      alert("Error saving record");
    }
  };

  return (
    <form className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl space-y-6 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
        <div className="flex flex-col">
          <label>Number</label>
          <input
            name="number"
            value={formData.number}
            onChange={handleChange}
            onKeyDown={handleNumberKeyPress}
            placeholder="Enter number and press Enter"
            required
          />
        </div>

        <div className="flex flex-col">
          <label>Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label>Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label>Address</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Start">Start</option>
            <option value="Waiting">Waiting</option>
            <option value="Close">Close</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input
            className="text-green-600 bg-gray-100 border-gray-300 rounded "
            type="checkbox"
            name="sendEmail"
            checked={formData.sendEmail}
            onChange={handleChange}
          />
          <label>Send email notification?</label>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={handleSubmit}
          className={`w-1/2 p-2 ${
            isEdit
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-green-500 hover:bg-green-600"
          } text-white rounded-lg font-semibold`}
        >
          {isEdit ? "Edit" : "Add"}
        </button>
      </div>
    </form>
  );
};
