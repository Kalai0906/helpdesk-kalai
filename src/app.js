const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const ticketRoutes = require("./routes/ticket.routes");
const attachmentRoutes = require("./routes/attachment.routes");
const slaRoutes = require("./routes/sla.routes");
const notificationRoutes = require("./routes/notification.routes");
const kbRoutes = require("./routes/kb.routes");
const reportRoutes = require("./routes/report.routes");


const app = express();

app.use(cors());
app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);
// After auth routes
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/attachments", attachmentRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/sla", slaRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/kb", kbRoutes);
app.use("/api/reports", reportRoutes);


app.get("/", (req, res) => {
  res.send("Helpdesk API running 🚀");
});

module.exports = app;

