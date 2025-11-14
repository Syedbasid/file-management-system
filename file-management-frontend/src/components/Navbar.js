import React from "react";
import { FolderOpen, UploadCloud } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2">
          <FolderOpen size={28} />
          <h1 className="text-2xl font-semibold tracking-wide">
            File Management System
          </h1>
        </div>

        {/* Upload Shortcut Button */}
        <a
          href="#upload"
          className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all"
        >
          <UploadCloud size={20} />
          <span className="font-medium">Upload</span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
