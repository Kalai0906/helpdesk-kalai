const TicketComment = require("../models/TicketComment");
const User = require("../models/User");


// GET comments by ticket
exports.getComments = async (req, res) => {
  const comments = await TicketComment.findAll({
    where: { ticketId: req.params.ticketId },
    include: [{ model: User, attributes: ["name", "role"] }],
    order: [["createdAt", "ASC"]],
  });

  res.json(comments);
};

// ADD comment
const Notification = require("../models/Notification");
const Ticket = require("../models/Ticket");

exports.addComment = async (req, res) => {
  const comment = await TicketComment.create({
    message: req.body.message,
    ticketId: req.params.ticketId,
    userId: req.user.id,
  });

  // 🔥 STEP-1 (Notification logic)
  const ticket = await Ticket.findByPk(req.params.ticketId);

  await Notification.create({
    message: `New comment on ticket: ${ticket.title}`,
    userId: ticket.customerId, // notify customer
  });

  res.json(comment);
};

