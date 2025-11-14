import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Download, Trash2 } from "lucide-react";

const FileItem = ({ file, onDelete }) => {
  const handleDownload = () => {
    window.open(`${process.env.REACT_APP_API_URL}/${file.filename}`);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/${file.filename}`);
      toast.success("File deleted successfully!");
      if (onDelete) onDelete(file.filename); // update UI dynamically
    } catch (err) {
      toast.error("Delete failed!");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-between bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition-all duration-200 border border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 font-bold rounded-lg">
          {file.filename[0].toUpperCase()}
        </div>
        <span className="font-medium text-gray-800 truncate w-40 sm:w-60">
          {file.filename}
        </span>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={handleDownload}
          className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition"
        >
          <Download size={16} />
          <span className="hidden sm:inline">Download</span>
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center space-x-1 bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition"
        >
          <Trash2 size={16} />
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default FileItem;
