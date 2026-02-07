import React, { useEffect, useState } from "react";
import API from "../../api/axios"; // your axios instance
import { NavLink } from "react-router-dom";
import "./Dashboard.css";

export default function ManagerDashboard() {
  const [tickets, setTickets] = useState([]);
  const [ticketCounts, setTicketCounts] = useState({
    OPEN: 0,
    IN_PROGRESS: 0,
    WAITING_FOR_CUSTOMER: 0,
    RESOLVED: 0,
    CLOSED: 0,
  });

  // Fetch tickets assigned to this manager
  useEffect(() => {
    API.get("/tickets")
      .then((res) => {
        const allTickets = res.data;
        setTickets(allTickets);

        // Count tickets by status
        const counts = { OPEN: 0, IN_PROGRESS: 0, WAITING_FOR_CUSTOMER: 0, RESOLVED: 0, CLOSED: 0 };
        allTickets.forEach((t) => {
          if (counts[t.status] !== undefined) counts[t.status]++;
        });
        setTicketCounts(counts);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Manager Dashboard</h2>

      <div className="dashboard-stats">
        <div className="stat-card">Open: {ticketCounts.OPEN}</div>
        <div className="stat-card">In Progress: {ticketCounts.IN_PROGRESS}</div>
        <div className="stat-card">Waiting for Customer: {ticketCounts.WAITING_FOR_CUSTOMER}</div>
        <div className="stat-card">Resolved: {ticketCounts.RESOLVED}</div>
        <div className="stat-card">Closed: {ticketCounts.CLOSED}</div>
      </div>

      <h3>Recent Tickets</h3>
      <div className="ticket-list">
        {tickets.slice(0, 5).map((ticket) => (
          <div key={ticket.id} className="ticket-card">
            <NavLink to={`/tickets/${ticket.id}`}>
              <h4>{ticket.subject}</h4>
            </NavLink>
            <p>Status: {ticket.status}</p>
            <p>Priority: {ticket.priority}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
