import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const res = await API.get("/notifications");
    setNotifications(res.data);
  };

  const markRead = async (id) => {
    await API.put(`/notifications/${id}/read`);
    fetchNotifications();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Notifications 🔔</h2>

      {notifications.length === 0 && <p>No notifications</p>}

      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            border: "1px solid #ccc",
            marginBottom: 10,
            padding: 10,
            background: n.read ? "#f5f5f5" : "#e3f2fd",
          }}
        >
          <p>{n.message}</p>
          <small>{new Date(n.createdAt).toLocaleString()}</small>

          {!n.read && (
            <button onClick={() => markRead(n.id)}>Mark Read</button>
          )}
        </div>
      ))}
    </div>
  );
}
