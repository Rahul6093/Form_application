import React, { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-hot-toast";

export const ExcelExportdropdown = ({ filteredData }) => {
  const [open, setOpen] = useState(false);

  const exportToExcel = (type) => {
    if (!filteredData || filteredData.length === 0) {
      toast.error("No data to export!");
      return;
    }

    const wsData = filteredData.map((row) => ({
      Number: row.number,
      Name: row.name,
      Date: row.date?.split("T")[0] || "",
      Time: row.time,
      Address: row.address,
      Status: row.status,
      Email: row.email,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Applications");

    const filename = "application_table";
    switch (type) {
      case "xlsx":
        XLSX.writeFile(wb, `${filename}.xlsx`);
        break;
      case "xls":
        XLSX.writeFile(wb, `${filename}.xls`);
        break;
      case "csv":
        XLSX.writeFile(wb, `${filename}.csv`);
        break;
      default:
        toast.error("Unsupported format");
    }

    setOpen(false); // close dropdown
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
      >
        Download Excel
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow-lg z-50">
          <button
            onClick={() => exportToExcel("xlsx")}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            XLSX
          </button>
          <button
            onClick={() => exportToExcel("xls")}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            XLS
          </button>
          <button
            onClick={() => exportToExcel("csv")}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            CSV
          </button>
        </div>
      )}
    </div>
  );
};
