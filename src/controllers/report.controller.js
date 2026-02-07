const Ticket = require("../models/Ticket");
const User = require("../models/User");
const { Op } = require("sequelize");

// Tickets summary by status & priority
exports.getTicketSummary = async (req, res) => {
  const totalTickets = await Ticket.count();
  const openTickets = await Ticket.count({ where: { status: "OPEN" } });
  const inProgress = await Ticket.count({ where: { status: "IN_PROGRESS" } });
  const resolved = await Ticket.count({ where: { status: "RESOLVED" } });
  const closed = await Ticket.count({ where: { status: "CLOSED" } });

  const highPriority = await Ticket.count({ where: { priority: "HIGH" } });
  const mediumPriority = await Ticket.count({ where: { priority: "MEDIUM" } });
  const lowPriority = await Ticket.count({ where: { priority: "LOW" } });

  res.json({
    totalTickets,
    openTickets,
    inProgress,
    resolved,
    closed,
    highPriority,
    mediumPriority,
    lowPriority,
  });
};

// SLA breach report
exports.getSlaBreaches = async (req, res) => {
  const breachedTickets = await Ticket.findAll({
    where: { isBreached: true },
  });

  res.json(breachedTickets);
};

// User activity report
exports.getUserActivity = async (req, res) => {
  const users = await User.findAll({
    attributes: ["id", "name", "role"],
  });

  const activity = [];

  for (let user of users) {
    const ticketsCreated = await Ticket.count({
      where: { createdBy: user.id },
    });
    const ticketsAssigned = await Ticket.count({
      where: { assignedTo: user.id },
    });

    activity.push({
      id: user.id,
      name: user.name,
      role: user.role,
      ticketsCreated,
      ticketsAssigned,
    });
  }

  res.json(activity);
};
exports.getStats = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};