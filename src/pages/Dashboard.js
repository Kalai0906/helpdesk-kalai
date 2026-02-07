import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Navigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
 ResponsiveContainer   // ⭐ ADD THIS

} from "recharts";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    closed: 0,
    breached: 0,
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  
  useEffect(() => {
    const fetchStats = async () => {
      const res = await axios.get("http://localhost:5000/api/tickets/stats");
      setStats(res.data);
    };

    fetchStats();
  }, []);

  const chartData = [
    { name: "Open", value: stats.open },
    { name: "Closed", value: stats.closed },
    { name: "Breached", value: stats.breached },
  ];

  const COLORS = ["#2196f3", "#4caf50", "#f44336"];
  // 🔐 protect route
  if (!token) return <Navigate to="/login" />;

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        <h1>Welcome {user?.role} 👋</h1>

        {/* ===== Cards ===== */}
        <div className="card-grid">
          <div className="card">
            <h3>Total Tickets</h3>
            <p>{stats.total}</p>
          </div>

          <div className="card">
            <h3>Open</h3>
            <p>{stats.open}</p>
          </div>

          <div className="card">
            <h3>Closed</h3>
            <p>{stats.closed}</p>
          </div>

          <div className="card">
            <h3>SLA Breached</h3>
            <p>{stats.breached}</p>
          </div>
        </div>

        {/* ================= CHARTS ================= */}

        <div style={{ display: "flex", gap: 40, marginTop: 40 }}>

          {/* Bar Chart */}
          <ResponsiveContainer width="50%" height={300}>
            <BarChart
              data={[
                { name: "Total", value: stats.total },
                { name: "Open", value: stats.open },
                { name: "Closed", value: stats.closed },
                { name: "Notifications", value: stats.notifications },
              ]}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>


          {/* Pie Chart */}
          <ResponsiveContainer width="50%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Open", value: stats.open },
                  { name: "Closed", value: stats.closed },
                ]}
                dataKey="value"
                outerRadius={100}
                label
              >
                <Cell />
                <Cell />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;



