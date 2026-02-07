import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  return (
    <div
      style={{
        width: "220px",
        background: "#0f172a",
        color: "white",
        padding: "20px"
      }}
    >
      <h3>Menu</h3>

      {/* ADMIN */}
      {role === "admin" && (
        <>
          <Link to="/admin">Dashboard</Link><br />
          <Link to="/users">Users</Link><br />
          <Link to="/tickets">Tickets</Link><br />
          <Link to="/reports">Reports</Link><br />
          <Link to="/sla">SLA</Link>
          <Link to="/sla">SLA Settings</Link>
        </>
      )}

      {/* MANAGER */}
      {role === "manager" && (
        <>
          <Link to="/manager">Dashboard</Link><br />
          <Link to="/tickets">Tickets</Link><br />
          <Link to="/reports">Reports</Link>
        </>
      )}

      {/* AGENT */}
      {role === "support" && (
        <>
          <Link to="/agent">Dashboard</Link><br />
          <Link to="/tickets">My Tickets</Link>
        </>
      )}

      {/* CUSTOMER */}
      {role === "user" && (
        <>
          <Link to="/customer">Dashboard</Link><br />
          <Link to="/tickets">My Tickets</Link>
        </>
      )}

    </div>
  );
}
