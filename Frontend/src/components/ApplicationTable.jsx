import React, { useState } from "react";
import axios from "axios";
import { RowModal } from "./RowModal";

export const ApplicationTable = ({ data, fetchData, onRowClick }) => {
  const [modalData, setModalData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (number, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`http://localhost:4000/api/applications/${number}`);
        fetchData();
      } catch (err) {
        console.error(err);
        alert("❌ Failed to delete record");
      }
    }
  };

  const handleRowClick = (row) => {
    setModalData(row);
    onRowClick(row);
  };

  const closeModal = () => {
    setModalData(null);
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  // 🔍 Filtered data based on search term
  const filteredData = data.filter((row) => {
    const term = searchTerm.toLowerCase();
    return (
      row.number?.toString().includes(term) ||
      row.name?.toLowerCase().includes(term) ||
      row.address?.toLowerCase().includes(term) ||
      row.status?.toLowerCase().includes(term) ||
      formatDate(row.date).includes(term) ||
      row.time?.includes(term)
    );
  });

  return (
    <div className="max-w-5xl mx-auto mt-8 relative">
      {/* 🔍 Search/filter input */}
      <div className="flex justify-between items-center mb-3 text-gray-500">
        <input
          type="text"
          placeholder=" Search by any field..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Scrollable table container */}
      <div className="max-h-[308px] overflow-y-auto border border-gray-300 rounded-lg shadow-lg scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-white">
        <table className="w-full bg-white text-sm">
          <thead className="bg-blue-600 text-white sticky top-0 z-10">
            <tr>
              <th className="border p-2 text-left">Number</th>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Time</th>
              <th className="border p-2 text-left">Address</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr
                  key={row.number}
                  className="text-black border-b border-gray-300 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(row)}
                >
                  <td className="p-2 text-center">{row.number}</td>
                  <td className="p-2">{row.name}</td>
                  <td className="p-2 text-center">{formatDate(row.date)}</td>
                  <td className="p-2 text-center">{row.time}</td>
                  <td className="p-2">{row.address}</td>
                  <td className="p-2 text-center">{row.status}</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={(e) => handleDelete(row.number, e)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500 italic">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalData && (
        <RowModal row={modalData} onClose={closeModal} fetchData={fetchData} />
      )}
    </div>
  );
};
