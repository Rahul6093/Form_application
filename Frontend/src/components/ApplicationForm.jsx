import React, { useState, useEffect } from "react";
import axios from "axios";

export const ApplicationForm = ({ fetchData, selectedRow, setSelectedRow }) => {
  const [formData, setFormData] = useState({
    number: "",
    name: "",
    date: "",
    time: "",
    address: "",
    status: "Start",
  });

  const [originalNumber, setOriginalNumber] = useState(null);
  const [isEdit, setIsEdit] = useState(false); // false = Add, true = Edit

  useEffect(() => {
    if (selectedRow) {
      setFormData({
        number: selectedRow.number,
        name: selectedRow.name,
        date: selectedRow.date?.split("T")[0] || "",
        time: selectedRow.time?.slice(0, 5) || "",
        address: selectedRow.address,
        status: selectedRow.status,
      });
      setOriginalNumber(selectedRow.number);
      setIsEdit(true); // switch to edit mode
    }
  }, [selectedRow]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberEnter = async (e) => {
    if (e.key === "Enter" && formData.number) {
      try {
        const res = await axios.get(`http://localhost:4000/api/applications/${formData.number}`);
        if (res.data) {
          // Existing record found → Edit mode
          setFormData({
            number: res.data.number,
            name: res.data.name,
            date: res.data.date?.split("T")[0] || "",
            time: res.data.time?.slice(0, 5) || "",
            address: res.data.address,
            status: res.data.status,
          });
          setOriginalNumber(res.data.number);
          setIsEdit(true);
        } else {
          // No record → Add mode
          setOriginalNumber(null);
          setIsEdit(false);
          setFormData((prev) => ({ ...prev, name: "", date: "", time: "", address: "", status: "Start" }));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async () => {
    if (isEdit) {
      // Edit mode
      if (!originalNumber) {
        alert("Select a record to edit first");
        return;
      }

      try {
        await axios.put(`http://localhost:4000/api/applicationsedit/${originalNumber}`, formData);
        fetchData();
        setFormData({ number: "", name: "", date: "", time: "", address: "", status: "Start" });
        setOriginalNumber(null);
        setIsEdit(false);
        setSelectedRow(null);
      } catch (err) {
        console.error(err);
        alert("Error updating record");
      }
    } else {
      // Add mode
      try {
        const { number, ...dataWithoutNumber } = formData; // exclude number if using auto-increment
        await axios.post("http://localhost:4000/api/applicationsadd", dataWithoutNumber);
        fetchData();
        setFormData({ number: "", name: "", date: "", time: "", address: "", status: "Start" });
        setOriginalNumber(null);
      } catch (err) {
        console.error(err);
        alert("Error adding record");
      }
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
            onKeyDown={handleNumberEnter}
            placeholder="Enter number"
            required
          />
        </div>

        <div className="flex flex-col">
          <label>Name</label>
          <input name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="flex flex-col">
          <label>Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>

        <div className="flex flex-col">
          <label>Time</label>
          <input type="time" name="time" value={formData.time} onChange={handleChange} required />
        </div>

        <div className="flex flex-col">
          <label>Address</label>
          <input name="address" value={formData.address} onChange={handleChange} required />
        </div>

        <div className="flex flex-col">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Start">Start</option>
              <option value="Waiting">Waiting</option>
              <option value="Close">Close</option>
          </select>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={handleSubmit}
          className={`w-1/2 p-2 ${
            isEdit ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"
          } text-white rounded-lg font-semibold`}
        >
          {isEdit ? "Edit" : "Add"}
        </button>
      </div>
    </form>
  );
};
