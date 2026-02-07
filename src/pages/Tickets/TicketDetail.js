import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";
import "./Tickets.css";
export default function TicketDetail() {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [agents, setAgents] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.user?.role || user?.role; // handle your login structure

  // -------------------------
  // Load ticket + comments
  // -------------------------
  useEffect(() => {
    fetchTicket();
    fetchComments();
    fetchAgents();
  }, []);

  const fetchTicket = async () => {
    const res = await API.get(`/tickets/${id}`);
    setTicket(res.data);
  };

  const fetchComments = async () => {
    const res = await API.get(`/comments/${id}`);
    setComments(res.data);
  };

  const fetchAgents = async () => {
    if (role === "ADMIN" || role === "MANAGER") {
      const res = await API.get("/users?role=AGENT");
      setAgents(res.data);
    }
  };

  // -------------------------
  // Add Comment
  // -------------------------
  const addComment = async () => {
    if (!comment.trim()) return;

    const res = await API.post(`/comments/${id}`, {
      message: comment,
    });

    // instantly add to UI
    setComments([...comments, res.data]);

    setComment("");
  };


  // -------------------------
  // Assign Agent
  // -------------------------
  const assignAgent = async (agentId) => {
    await API.put(`/tickets/${id}/assign`, {
      agentId,
    });

    fetchTicket();
  };

  // -------------------------
  // Change Status
  // -------------------------
  const updateStatus = async (status) => {
    await API.put(`/tickets/${id}/status`, {
      status,
    });

    fetchTicket();
  };

  if (!ticket) return <h3>Loading...</h3>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{ticket.title}</h2>
      <p>{ticket.description}</p>

      <p>Status: {ticket.status}</p>
      <p>Priority: {ticket.priority}</p>

      {/* -------------------------
          STATUS CHANGE
      ------------------------- */}
      <select onChange={(e) => updateStatus(e.target.value)}>
        <option>Change Status</option>
        <option value="OPEN">OPEN</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="RESOLVED">RESOLVED</option>
        <option value="CLOSED">CLOSED</option>
      </select>

      {/* -------------------------
          ASSIGN AGENT (Admin/Manager only)
      ------------------------- */}
      {(role === "ADMIN" || role === "MANAGER") && (
        <>
          <h3>Assign Agent</h3>
          <select onChange={(e) => assignAgent(e.target.value)}>
            <option>Select Agent</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </>
      )}

      {/* -------------------------
          COMMENTS
      ------------------------- */}
      <h3>Comments</h3>
       <div
          style={{
            border: "1px solid #ddd",
            padding: 10,
            height: 250,
            overflowY: "auto",
            marginBottom: 10,
          }}
        >
          {comments.map((c) => (
            <div
              key={c.id}
              style={{
                background: "#f1f1f1",
                padding: 8,
                borderRadius: 6,
                marginBottom: 6,
              }}
            >
              <b>{c.User?.name}</b> ({c.User?.role})
              <p style={{ margin: 0 }}>{c.message}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            style={{ flex: 1 }}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Type comment..."
          />
          <button onClick={addComment}>Send</button>
        </div>
      
    </div>
  );
}

