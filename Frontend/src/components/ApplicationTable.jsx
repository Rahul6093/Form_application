import React, { useState } from "react";
import axios from "axios";
import { RowModal } from "./RowModal";
import { ConfirmModal } from "./ConfirmModal";
import { ExcelExportdropdown } from "./ExcelExportDropdown";
import toast, { Toaster } from "react-hot-toast";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const ApplicationTable = ({ data, fetchData, onRowClick, setSelectedRow }) => {
  const [modalData, setModalData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteNumber, setPendingDeleteNumber] = useState(null);

  const handleDelete = async (number, e) => {
    e.stopPropagation();
    setPendingDeleteNumber(number);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    try {
      await axios.delete(`http://localhost:4000/api/applications/${pendingDeleteNumber}`);
      fetchData();
      toast.success("Record deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete record");
    }
  };

  const handleRowClick = (row) => {
    setModalData(row);
    onRowClick(row);
  };

  const closeModal = () => setModalData(null);

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  };

  const filteredData = data.filter((row) => {
    const term = searchTerm.toLowerCase();
    return (
      row.number?.toString().includes(term) ||
      row.name?.toLowerCase().includes(term) ||
      row.address?.toLowerCase().includes(term) ||
      row.status?.toLowerCase().includes(term) ||
      (row.email || "").toLowerCase().includes(term) ||
      formatDate(row.date).includes(term) ||
      (row.time || "").includes(term)
    );
  });

  const downloadPDF = () => {
  
    if (filteredData.length === 0) {
      toast.error("No data to download!");
      return;
    }

    const doc = new jsPDF();

    const logo = "/sample.jpg"; // ✅ correct path for Vite public folder
    const img = new Image();
    img.src = logo;

    img.onload = () => {
      // ✅ Add logo first
      doc.addImage(img, "PNG", 175, 10, 20, 20);

      // ✅ Add title + date
      doc.setFontSize(16);
      doc.text("Application Table", 14, 20);
      const currentDate = new Date().toLocaleString();
      doc.setFontSize(10);
      doc.text(`Generated on: ${currentDate}`, 14, 28);

      // ✅ Prepare table
      const tableColumn = ["Number", "Name", "Date", "Time", "Address", "Status", "Email"];
      const tableRows = filteredData.map((row) => [
        row.number,
        row.name,
        row.date?.split("T")[0] || "",
        row.time,
        row.address,
        row.status,
        row.email,
      ]);

    // ✅ Add table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: "striped",
      headStyles: { fillColor: [25, 118, 210], textColor: 255, fontStyle: "bold" },
      styles: { fontSize: 10 },
    });

    // ✅ Save only after all added
    doc.save("application_table.pdf");
    };

     img.onerror = () => {
    doc.setFontSize(16);
    doc.text("Application Table", 14, 20);
    const currentDate = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.text(`Generated on: ${currentDate}`, 14, 28);

    const tableColumn = ["Number", "Name", "Date", "Time", "Address", "Status", "Email"];
    const tableRows = filteredData.map((row) => [
      row.number,
      row.name,
      row.date?.split("T")[0] || "",
      row.time,
      row.address,
      row.status,
      row.email,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: "striped",
    });

    doc.save("application_table.pdf");
  };
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 relative">
      <div className="flex justify-between items-center mb-3 text-gray-500">
        <input
          type="text"
          placeholder=" Search by any field..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="space-x-5"> 
          <button
            onClick={downloadPDF}
            className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
          >
            Download PDF
          </button>

          <ExcelExportdropdown filteredData={filteredData} />
        </div>

      </div>

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
              <th className="border p-2 text-left">Email</th>
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
                  <td className="p-2 text-center">{row.email}</td>
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
                <td colSpan="8" className="text-center p-4 text-gray-500 italic">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalData && <RowModal row={modalData} onClose={closeModal}  setSelectedRow={setSelectedRow} fetchData={fetchData} />}
      <ConfirmModal
        open={confirmOpen}
        message="Do you want to delete this record?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};
