import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

export default function Reports() {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    closed: 0,
    agentStats: [],
  });

  useEffect(() => {
    API.get("/tickets/reports/stats")
      .then((res) => {
        const tickets = res.data;

        const total = tickets.length;
        const open = tickets.filter(t => t.status === "Open").length;
        const closed = tickets.filter(t => t.status === "Closed").length;
        const high = tickets.filter(t => t.priority === "HIGH").length;
        const medium = tickets.filter(t => t.priority === "MEDIUM").length;
        const low = tickets.filter(t => t.priority === "LOW").length;

        const breached = tickets.filter(t => t.isBreached === true).length;
        const safe = tickets.filter(t => t.isBreached === false).length;
        // =====================
        // Agent Performance
        // =====================

        const closedTickets = tickets.filter(t => t.status === "CLOSED");

        const map = {};

        closedTickets.forEach(t => {
          const name = t.agent?.name || "Unassigned";

          if (!map[name]) map[name] = 0;
          map[name]++;
        });

        const agentStats = Object.keys(map).map(name => ({
          name,
          count: map[name],
        }));


        setStats({
          total,
          open,
          closed,
          high,
          medium,
          low,
          breached,
          safe,
        });


      })
      .catch(() => {});
  }, []);
  // =====================
  // Chart Data
  // =====================
  const chartData = [
    { name: "Open", value: stats.open },
    { name: "Closed", value: stats.closed },
  ];
  // =====================
  // Priority Chart Data
  // =====================
  const priorityData = [
    {
      name: "HIGH",
      value: stats.high || 0,
    },
    {
      name: "MEDIUM",
      value: stats.medium || 0,
    },
    {
      name: "LOW",
      value: stats.low || 0,
    },
  ];
  // =====================
  // SLA Chart Data
  // =====================
  const slaData = [
    { name: "Breached", value: stats.breached || 0 },
    { name: "On Time", value: stats.safe || 0 },
  ];



  return (
    <div style={{ padding: 30 }}>
      <h2>Reports Dashboard</h2>

      {/* CARDS */}
      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <div style={cardStyle}>
          <h3>Total Tickets</h3>
          <p style={numberStyle}>{stats.total}</p>
        </div>

        <div style={cardStyle}>
          <h3>Open Tickets</h3>
          <p style={numberStyle}>{stats.open}</p>
        </div>

        <div style={cardStyle}>
          <h3>Closed Tickets</h3>
          <p style={numberStyle}>{stats.closed}</p>
        </div>
      </div>

      {/* =====================
          🔥 ADD HERE (Charts)
      ===================== */}

      <h3 style={{ marginTop: 40 }}>Status Distribution</h3>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              label
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* =====================
      🔥 PRIORITY BAR CHART
          ===================== */}

          <h3 style={{ marginTop: 40 }}>Priority Distribution</h3>

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        {/* =====================
                🔥 SLA BREACH PIE
            ===================== */}

            <h3 style={{ marginTop: 40 }}>SLA Breach Status</h3>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={slaData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>


    </div>
  );
}

const cardStyle = {
  background: "#fff",
  padding: 20,
  width: 200,
  borderRadius: 8,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const numberStyle = {
  fontSize: 32,
  fontWeight: "bold",
};
