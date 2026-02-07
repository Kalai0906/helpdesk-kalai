const Notification = require("../models/Notification");

const sendNotification = async (userId, message) => {
  await Notification.create({
    userId,
    message,
  });
};

module.exports = sendNotification;
