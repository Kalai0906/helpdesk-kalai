const Ticket = require("../models/Ticket");
const User = require("../models/User");
const SlaRule = require("../models/SlaRule");
const { Op } = require("sequelize");
const Attachment = require("../models/Attachment");
const sendNotification = require("../utils/notify");

// Create new ticket (Customer)
exports.createTicket = async (req, res) => {
  try {
    const ticketData = { ...req.body };

    // -------------------------
    // file upload
    // -------------------------
    if (req.file) {
      ticketData.attachment = req.file.filename;
    }

    /* =========================
       🔥 SLA LOGIC START
    ========================== */

    const rule = await SlaRule.findOne({
      where: { priority: ticketData.priority },
    });

    if (rule) {
      const now = new Date();

      ticketData.responseDueAt = new Date(
        now.getTime() + rule.responseTime * 60000
      );

      ticketData.resolutionDueAt = new Date(
        now.getTime() + rule.resolutionTime * 60000
      );
    }

    /* =========================
       🔥 SLA LOGIC END
    ========================== */


    /* =========================
       🔥 STEP 1 → AUTO ASSIGN AGENT (ADD HERE)
    ========================== */

    const agents = await User.findAll({
      where: { role: "AGENT" }
    });

    let selectedAgent = null;
    let minTickets = Infinity;

    for (const agent of agents) {
      const count = await Ticket.count({
        where: {
          assignedTo: agent.id,
          status: { [Op.notIn]: ["RESOLVED", "CLOSED"] }
        }
      });

      if (count < minTickets) {
        minTickets = count;
        selectedAgent = agent;
      }
    }

    if (selectedAgent) {
      ticketData.assignedTo = selectedAgent.id;
    }

    /* =========================
       CREATE TICKET
    ========================== */

    const ticket = await Ticket.create(ticketData);
    const Notification = require("../models/Notification");

      await Notification.create({
        message: `New ticket created: ${ticket.title}`,
        userId: ticket.customerId,
      });

    res.status(201).json(ticket);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// List tickets
exports.listTickets = async (req, res) => {
  try {
    let tickets;

    if (req.user.role === "ADMIN" || req.user.role === "AGENT") {
      tickets = await Ticket.findAll({
        include: [
          { model: require("../models/User"), as: "customer", attributes: ["id", "name", "email"] },
          { model: require("../models/User"), as: "agent", attributes: ["id", "name", "email"] },
        ],
      });
    } else {
      // Customer: only own tickets
      tickets = await Ticket.findAll({
        where: { customerId: req.user.id },
        include: [
          { model: require("../models/User"), as: "customer", attributes: ["id", "name", "email"] },
          { model: require("../models/User"), as: "agent", attributes: ["id", "name", "email"] },
        ],
      });
    }

    res.json({
      message: "Tickets fetched successfully",
      tickets,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// Update ticket status or assign agent (Admin/Agent only)
exports.updateTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, agentId } = req.body;

    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (status) ticket.status = status;
    if (agentId) ticket.agentId = agentId;

    await ticket.save();
     res.json({
      message: "Ticket updated successfully",
      ticket,
      });

    await sendNotification(
    agentId,
    `A ticket has been assigned to you (Ticket ID: ${ticket.id})`
    );
    await sendNotification(
  ticket.createdBy,
  `Your ticket status updated to ${status}`
  );
 




// Step 3: Notify customer about status/agent update
const customer = await require("../models/User").findByPk(ticket.customerId);

if (customer) {
  await sendEmail(
    customer.email,
    `Ticket Update: ${ticket.title}`,
    `Your ticket with ID ${ticket.id} has been updated. Status: ${ticket.status}. Assigned agent: ${ticket.agentId || "Not assigned"}`
  );
}

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// Get single ticket
exports.getTickets = async (req, res) => {
  try {
    const { status, priority, search } = req.query;

    const where = {};

    if (status) where.status = status;
    if (priority) where.priority = priority;

    if (search) {
      where.title = {
        [require("sequelize").Op.like]: `%${search}%`,
      };
    }

    const tickets = await Ticket.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getTicketStats = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();

    const total = tickets.length;
    const open = tickets.filter(t => t.status === "Open").length;
    const closed = tickets.filter(t => t.status === "Closed").length;

    res.json({ total, open, closed });
  } catch (err) {
    res.status(500).json({ message: "Error fetching report stats" });
  }
};
exports.getTicketCount = async (req, res) => {
  const count = await Ticket.count();
  res.json({ count });
};
exports.getOpenTickets = async (req, res) => {
  const count = await Ticket.count({ where: { status: "Open" } });
  res.json({ count });
};
exports.getClosedTickets = async (req, res) => {
  const count = await Ticket.count({ where: { status: "Closed" } });
  res.json({ count });
};
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);

    if (!ticket)
      return res.status(404).json({ message: "Ticket not found" });

    await ticket.destroy();

    res.json({ message: "Ticket deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Customer: only own open tickets
exports.getCustomerOpenTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      where: {
        customerId: req.user.id,   // login aana customer id
        status: "OPEN"
      },
      include: [
        { model: require("../models/User"), as: "agent", attributes: ["id", "name", "email"] }
      ]
    });

    res.json({ tickets });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.getBreachedTickets = async (req, res) => {
  try {
    const breached = await Ticket.find({
      status: { $ne: "Closed" },
      dueDate: { $lt: new Date() }
    });

    res.json(breached);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ASSIGN AGENT
exports.assignAgent = async (req, res) => {
  try {
    const { agentId } = req.body;

    const ticket = await Ticket.findByPk(req.params.id);

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.agentId = agentId;
    await ticket.save();
    await Notification.create({
      message: `Ticket assigned to you`,
      userId: agentId,
    });


    res.json({ message: "Agent assigned", ticket });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE STATUS
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const ticket = await Ticket.findByPk(req.params.id);

    ticket.status = status;
    await ticket.save();
    await Notification.create({
      message: `Ticket status updated to ${status}`,
      userId: ticket.customerId,
    });



    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 📊 REPORT STATS
exports.getStats = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
