import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./Tickets.css";
import { Link } from "react-router-dom";

export default function TicketList() {
  const [tickets, setTickets] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState("latest");

  // ✅ pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 5;
  const fetchTickets = async () => {
    try {
      const res = await API.get("/tickets");
      setTickets(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);


  // ✅ filter logic
  const filteredTickets = tickets.filter((t) => {
    return (
      t.title.toLowerCase().includes(search.toLowerCase()) &&
      (status ? t.status === status : true) &&
      (priority ? t.priority === priority : true)
    );
  });
  // ✅ sorting logic
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (sort === "latest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);

    if (sort === "priority") {
      const order = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return order[b.priority] - order[a.priority];
    }

    if (sort === "status") {
      return a.status.localeCompare(b.status);
    }

    return 0;
  });


  // ✅ pagination logic
  const indexOfLast = currentPage * ticketsPerPage;
  const indexOfFirst = indexOfLast - ticketsPerPage;
  const currentTickets = sortedTickets.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  return (
    <div className="ticket-container">
      <h2>Tickets</h2>

      <Link to="/tickets/create">
        <button>Create Ticket</button>
      </Link>

      <br /><br />

      {/* 🔎 FILTERS */}
      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
        <input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select onChange={(e) => { setStatus(e.target.value); setCurrentPage(1); }}>
          <option value="">All Status</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="CLOSED">CLOSED</option>
        </select>

        <select onChange={(e) => { setPriority(e.target.value); setCurrentPage(1); }}>
          <option value="">All Priority</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>
        {/* ✅ NEW SORT */}
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
        </select>
      </div>

      {/* 🎟️ TICKETS */}
      {currentTickets.map((t) => (
        <div key={t.id} className={`ticket-card ${t.status}`}>
          <h4>{t.title}</h4>
          <p>Status: {t.status}</p>
          <p>Priority: {t.priority}</p>

          {t.attachment && (
            <a
              href={`http://localhost:5000/uploads/${t.attachment}`}
              target="_blank"
              rel="noreferrer"
            >
              View File
            </a>
          )}

          <br />
          <Link to={`/tickets/${t.id}`}>View</Link>
        </div>
      ))}

      {/* 📄 PAGINATION */}
      <div style={{ marginTop: 20 }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              fontWeight: currentPage === i + 1 ? "bold" : "normal",
              margin: "0 5px",
            }}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
