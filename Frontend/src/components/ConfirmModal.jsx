import React from "react";

export const ConfirmModal = ({ open, message, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm text-center">
        <p className="text-gray-700 text-lg mb-4">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
