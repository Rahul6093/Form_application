import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { ConfirmModal } from "./ConfirmModal";

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

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null); 

  const [isEdit, setIsEdit] = useState(false);
  const [originalNumber, setOriginalNumber] = useState(null); // ✅ track original number

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const [loading, setLoading] = useState(false);

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
      if (selectedRow.image) {
        setPreview(`http://localhost:4000/uploads/${selectedRow.image}`);
      } else {
        setPreview(null);}
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
    setImage(null);
    setPreview(null);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // show local preview
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    document.getElementById("fileInput").value = null;
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
          if (res.data.image) {
            setPreview(`http://localhost:4000/uploads/${res.data.image}`);
          }
        } else {
          toast.error("Record not found");
        }
      } catch (err) {
        console.error(err);
        toast.error("Record not found");
      }
    }
  };

  const handleSubmit  = () => {
    setPendingAction("submit");
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {

    setConfirmOpen(false);
    setLoading(true); 

    if (
      !formData.number ||
      !formData.name ||
      !formData.date ||
      !formData.time ||
      !formData.address ||
      !formData.email
    ) {
      return toast.error("All fields are required, including email");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
    return toast.error("Please enter a valid email address");
   }

    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      formPayload.append(key, value)
    );

    if (image) formPayload.append("image", image);

    const timeValue =
      formData.time.length === 5 ? `${formData.time}:00` : formData.time;


    try {
      if (isEdit) {
        await axios.put(
          `http://localhost:4000/api/applicationsedit/${originalNumber}`, formPayload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );  

        if (formData.number != originalNumber) {
          toast(`Number field changed but original record ${originalNumber} was updated!`, {
            icon: "⚠️",
          });} 
        else {
          toast.success("Record updated successfully!");
        }

      } else {
        await axios.post("http://localhost:4000/api/applicationsadd", formPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Record added successfully!");
      }

      fetchData();
      setSelectedRow(null);
      resetForm(); // ✅ clear form
    } 
    catch (err) {
      console.error(err);
      toast.error("Error saving record");
    }
     finally {
        setLoading(false); // ✅ stop loading
    }
  };

  return (
    <form className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl space-y-6 mt-6">

    {loading && (
          <div className="fixed inset-0 h-screen w-screen bg-black/50 flex justify-center items-center z-50">
            <div className="loader"></div> 
          </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">

       <Toaster
        position="top-right"  
        reverseOrder={false}  
      />

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
            className="custom-checkbox"
            type="checkbox"
            name="sendEmail"
            checked={formData.sendEmail}
            onChange={handleChange}
          />
          <label>Send email notification?</label>
        </div>
      </div>

      <div className="flex flex-col mt-2">
          <label className="text-black">Attach Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border border-gray-300 p-1 rounded cursor-pointer text-black w-[350px]"
          />
            {(preview || image) && (
                <div className="mt-2 relative">
                  <img
                    src={image ? URL.createObjectURL(image) : preview}
                    alt="Preview"
                    className="h-24 w-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setPreview(null);
                      document.getElementById("fileInput") && (document.getElementById("fileInput").value = null);
                    }}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs px-2 py-1"
                  >
                    ✕
                  </button>
                </div>
              )}
      </div>


      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className={`w-1/2 p-2 ${
            isEdit
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-green-500 hover:bg-green-600"
          } text-white rounded-lg font-semibold`}
        >
          {loading ? "Processing..." : isEdit ? "Edit" : "Add"}
        </button>
      </div>

       <ConfirmModal
        open={confirmOpen}
        message={`Do you want to ${isEdit ? "update" : "add"} this record?`}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />

    </form>
    
  );
};
