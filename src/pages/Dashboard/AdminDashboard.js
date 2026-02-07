import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { NavLink } from "react-router-dom";
import "./Dashboard.css";

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [ticketCounts, setTicketCounts] = useState({
    OPEN: 0,
    IN_PROGRESS: 0,
    WAITING_FOR_CUSTOMER: 0,
    RESOLVED: 0,
    CLOSED: 0,
  });

  // Fetch all tickets
  useEffect(() => {
    API.get("/tickets")
      .then((res) => {
        setTickets(res.data);

        const counts = { OPEN: 0, IN_PROGRESS: 0, WAITING_FOR_CUSTOMER: 0, RESOLVED: 0, CLOSED: 0 };
        res.data.forEach((t) => {
          if (counts[t.status] !== undefined) counts[t.status]++;
        });
        setTicketCounts(counts);
      })
      .catch((err) => console.log(err));
  }, []);

  // Fetch all users
  useEffect(() => {
    API.get("/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>

      <div className="dashboard-stats">
        <div className="stat-card">Total Users: {users.length}</div>
        <div className="stat-card">Total Tickets: {tickets.length}</div>
        <div className="stat-card">Open: {ticketCounts.OPEN}</div>
        <div className="stat-card">In Progress: {ticketCounts.IN_PROGRESS}</div>
        <div className="stat-card">Waiting for Customer: {ticketCounts.WAITING_FOR_CUSTOMER}</div>
        <div className="stat-card">Resolved: {ticketCounts.RESOLVED}</div>
        <div className="stat-card">Closed: {ticketCounts.CLOSED}</div>
      </div>

      <h3>Quick Links</h3>
      <div className="quick-links">
        <NavLink to="/users" className="link-btn">Manage Users</NavLink>
        <NavLink to="/reports" className="link-btn">View Reports</NavLink>
        <NavLink to="/tickets" className="link-btn">View Tickets</NavLink>
        <NavLink to="/notifications">🔔 Notifications</NavLink>

      </div>
    </div>
  );
}
