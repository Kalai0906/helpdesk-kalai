import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import { useEffect, useState } from "react";
import API from "../api/axios";

import "./Navbar.css";

export default function Navbar() {
  const { logout } = useContext(AuthContext);
  const [count, setCount] = useState(0);
    useEffect(() => {
    const fetchCount = async () => {
      const res = await API.get("/notifications/count");
      setCount(res.data.count);
    };

    fetchCount();
    const interval = setInterval(fetchCount, 5000);

    return () => clearInterval(interval);
  }, []);

  
  return (
    <div className="navbar">
      <h3>Helpdesk</h3>
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <NotificationBell />
        <button onClick={logout}>Logout</button>
      </div>
      <div className="bell">
        🔔 {count > 0 && <span className="badge">{count}</span>}
      </div>

    </div>
     

  
  );
}
