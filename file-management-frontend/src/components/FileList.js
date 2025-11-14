// frontend/src/components/FileList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Download, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch uploaded files for the logged-in user
  const fetchFiles = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to see your files");
      return;
    }

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/myfiles`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFiles(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch files:", err);
      toast.error("Unable to fetch files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // ✅ Handle File Download
  const handleDownload = async (fileId, filename) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/download/${fileId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      // Trigger file download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(`✅ Downloaded ${filename}`);
    } catch (err) {
      console.error("❌ Download failed:", err);
      toast.error("Download failed!");
    }
  };

  // ✅ Handle File Delete
  const handleDelete = async (fileId, filename) => {
    const token = localStorage.getItem("token");
    if (!window.confirm(`Are you sure you want to delete "${filename}"?`)) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/delete/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(`🗑️ Deleted ${filename}`);
      setFiles((prev) => prev.filter((f) => f._id !== fileId));
    } catch (err) {
      console.error("❌ Delete failed:", err);
      toast.error("Failed to delete file!");
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-6 mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
        Your Uploaded Files
      </h2>

      {loading ? (
        <div className="text-center py-6 text-gray-500">Loading files...</div>
      ) : files.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          No files uploaded yet.
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file) => (
            <div
              key={file._id}
              className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-4 rounded-lg shadow-sm border transition"
            >
              <div>
                <p className="font-medium text-gray-800">{file.filename}</p>
                <p className="text-sm text-gray-500">
                  Uploaded:{" "}
                  {new Date(file.uploadDate).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleDownload(file.fileId, file.filename)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
                >
                  <Download size={18} /> Download
                </button>

                <button
                  onClick={() => handleDelete(file._id, file.filename)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
                >
                  <Trash2 size={18} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileList;
