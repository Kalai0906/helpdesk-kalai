import { useEffect, useState } from "react";
import axios from "axios";

export default function CustomerDashboard() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      try {
        const res = await axios.get("http://localhost:5000/api/tickets/my-open", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setTickets(res.data.tickets);
      } catch (err) {
        console.error("Failed to fetch tickets", err);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div>
      <h2>My Open Tickets</h2>
      <ul>
        {tickets.map(ticket => (
          <li key={ticket.id}>
            {ticket.title} - {ticket.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
