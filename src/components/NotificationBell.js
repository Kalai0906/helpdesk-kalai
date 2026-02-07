import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import "./Notification.css";

export default function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    API.get("/notifications")
      .then((res) => {
        const unread = res.data.filter((n) => !n.isRead).length;
        setCount(unread);
      })
      .catch(() => {});
  }, []);

  return (
    <Link to="/notifications" className="bell">
      🔔
      {count > 0 && <span className="badge">{count}</span>}
    </Link>
  );
}
