const Notification = require("../models/Notification");

// GET all notifications
exports.getAll = async (req, res) => {
  const notifications = await Notification.findAll({
    where: { userId: req.user.id },
    order: [["createdAt", "DESC"]],
  });

  res.json(notifications);
};


// MARK single read
exports.markRead = async (req, res) => {
  await Notification.update(
    { isRead: true },
    { where: { id: req.params.id, userId: req.user.id } }
  );

  res.json({ message: "Marked as read" });
};


// MARK all read
exports.markAllRead = async (req, res) => {
  await Notification.update(
    { isRead: true },
    { where: { userId: req.user.id } }
  );

  res.json({ message: "All notifications read" });
};

exports.getNotificationCount = async (req, res) => {
  const count = await Notification.count({
    where: {
      userId: req.user.id,
      isRead: false,
    },
  });

  res.json({ count });
};

