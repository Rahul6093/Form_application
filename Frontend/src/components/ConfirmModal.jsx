import React from "react";

export const ConfirmModal = ({ open, message, onConfirm, onCancel , variant = "default"}) => {
  if (!open) return null;

  const overlayClass =
    variant === "bubble_overlay"
      ? "absolute left-0 top-0 w-screen h-screen bg-black/70 flex items-center justify-center z-50"
      : "fixed left-0 top-0 w-screen h-screen bg-black/70 flex items-center justify-center z-50";

  return (
    <div className={overlayClass} onClick={onCancel}>
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm text-center" 
            onClick={(e) => e.stopPropagation()} >
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
