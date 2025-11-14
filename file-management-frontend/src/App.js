import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import FileUpload from "./components/FileUpload";
import FileList from "./components/FileList";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const token = localStorage.getItem("token"); // ✅ Check if user is logged in

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <Router>
      <div className="App">
        {/* ===== Navbar ===== */}
        <nav className="navbar">
          <div className="nav-logo">Sculpx File Manager</div>
          <ul className="nav-links">
            {token && (
              <>
                <li>
                  <Link to="/upload">Upload</Link>
                </li>
                <li>
                  <Link to="/files">Files</Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    style={{
                      background: "#ff4d4d",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* ===== Main Content ===== */}
        <main className="main-content">
          {!token ? (
            <>
              <h1 className="page-title">🔐 Please Login to Continue</h1>
              <Login />
            </>
          ) : (
            <Routes>
              <Route path="/" element={<Navigate to="/upload" />} />
              <Route path="/upload" element={<FileUpload />} />
              <Route path="/files" element={<FileList />} />
            </Routes>
          )}
        </main>

        {/* Toast Notifications */}
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
