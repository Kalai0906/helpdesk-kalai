const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Ticket = require("./Ticket");

const TicketComment = sequelize.define("TicketComment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

TicketComment.belongsTo(User, { foreignKey: "userId" });
TicketComment.belongsTo(Ticket, { foreignKey: "ticketId" });

module.exports = TicketComment;
