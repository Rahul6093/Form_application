import React, { useEffect, useState } from "react";
import axios from "axios";
import { ConfirmModal } from "./ConfirmModal";

export const EmailFormat = ({ show, onClose }) => {
  const [templates, setTemplates] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState(null); // { name, index, content }
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (show) fetchTemplates();
  }, [show]);

  const fetchTemplates = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/emailTemplates");
      setTemplates(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openEditor = (templateName, index, content) => {
    setSelectedTemplate({ templateName, index, content });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:4000/api/emailTemplates/${selectedTemplate.templateName}/${selectedTemplate.index}`,
        { content: selectedTemplate.content }
      );
      setConfirmOpen(false);
      setSelectedTemplate(null);
      fetchTemplates();
    } catch (err) {
      console.error(err);
    }
  };

  if (!show) return null;

  return (
  <>  
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 text-black" onClick={onClose}>
      <div className="relative bg-white p-6 rounded w-4/5 max-w-4xl h-[80vh] overflow-y-auto"  onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Email Templates</h2>

        <table className="w-full text-left border-collapse border">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="border px-2 py-1">Template</th>
              <th className="border px-2 py-1">Editable Part</th>
              <th className="border px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(templates).map((templateName) =>
              templates[templateName].map((content, idx) => (
                <tr key={templateName + idx} className="border-b">
                  <td className="px-2 py-1">{templateName}</td>
                  <td className="px-2 py-1">{content.slice(0, 50)}...</td>
                  <td className="px-2 py-1">
                    <button
                      onClick={() => openEditor(templateName, idx, content)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {selectedTemplate && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded w-3/4 max-w-2xl">
              <h3 className="font-bold mb-2">
                Editing: {selectedTemplate.templateName}
              </h3>
              <textarea
                className="w-full h-48 border p-2 rounded"
                value={selectedTemplate.content}
                onChange={(e) =>
                  setSelectedTemplate((prev) => ({ ...prev, content: e.target.value }))
                }
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setConfirmOpen(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          className="absolute bottom-5 right-5 bg-red-500 text-white px-3 py-1 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
    <ConfirmModal
          open={confirmOpen}
          message="Are you sure you want to save changes?"
          onConfirm={handleSave}
          onCancel={() => {setConfirmOpen(false);  
          setSelectedTemplate(null) }}
          
        />
  </>      
  );
};
