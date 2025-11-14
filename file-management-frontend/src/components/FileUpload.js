import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CloudUpload } from "lucide-react";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload file to backend
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in before uploading a file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Display backend success message
      toast.success(res.data.message || `✅ Uploaded: ${file.name}`);

      setFile(null);

      // Optionally refresh file list after a short delay
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      console.error("❌ Upload error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "❌ Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto mt-10 p-8 bg-white rounded-2xl shadow-md border border-gray-100">
      {/* Upload area */}
      <div className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all cursor-pointer">
        <CloudUpload size={48} className="text-blue-500 mb-3" />
        <p className="text-gray-600 mb-3 text-center">
          {file ? (
            <span className="font-medium text-gray-800">{file.name}</span>
          ) : (
            <>Drag & drop a file here or click to browse</>
          )}
        </p>

        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-all"
        >
          Choose File
        </label>
      </div>

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`mt-6 w-full py-3 rounded-lg font-semibold text-white transition-all ${
          uploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>
    </div>
  );
};

export default FileUpload;
