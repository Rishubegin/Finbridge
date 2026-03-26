import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Get user name from localStorage
    const user = localStorage.getItem("FinBridge_user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name || "User");
      } catch (e) {
        console.error("Error parsing user data");
      }
    }
  }, []);

  const { logout } = useContext(AuthContext);

  const showToast = (message, type = "success") => {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 14px;
      background: ${type === "error" ? "#f44336" : "#4caf50"};
      color: #fff;
      border-radius: 8px;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
      font-weight: 600;
      opacity: 0.95;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 1400);
  };

  const handleLogout = () => {
    navigate("/");
    logout();
    localStorage.removeItem("FinBridge_remember");
    showToast("Logged out successfully", "success");
  };

  const navItems = [
    { label: "📊 Dashboard", path: "/dashboard" },
    { label: "📋 Credit Report", path: "/credit-report" },
    { label: "📈 History", path: "/history" },
    { label: "🚀 Improve Score", path: "/improve-score" },
    { label: "🏦 Bank Loans", path: "/bank-loans" }, // ← NEW
    { label: "👤 Profile", path: "/profile" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div
          className="navbar-logo"
          onClick={() => {
            navigate("/");
            logout();
            setIsMobileMenuOpen(false);
          }}
          style={{ cursor: "pointer" }}
        >
          <span className="navbar-logo-icon">💳</span>
          <span className="navbar-logo-text">FinBridge</span>
        </div>

        <button
          className="menu-toggle"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? "✖" : "☰"}
        </button>

        <ul className={`nav-menu${isMobileMenuOpen ? " active" : ""}`}>
          {navItems.map((item, index) => (
            <li key={index}>
              <button
                className="nav-link-btn"
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <div className="welcome-message">
            👋 Welcome back, <span className="user-name">{userName}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
