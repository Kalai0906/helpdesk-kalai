// SupportDashboard.js
import React from "react";
import "./Dashboard.css";

export default function SupportDashboard() {
  return (
    <div className="dashboard-container">
      <h2>Support Dashboard</h2>

      {/* Stats cards */}
      <div className="dashboard-stats">
        <div className="stat-card">Open Tickets: 12</div>
        <div className="stat-card">In Progress: 5</div>
        <div className="stat-card">Resolved: 20</div>
      </div>

      {/* Quick links */}
      <div className="quick-links">
        <a href="/tickets" className="link-btn">View Tickets</a>
        <a href="/notifications" className="link-btn">Notifications</a>
      </div>
    </div>
  );
}
