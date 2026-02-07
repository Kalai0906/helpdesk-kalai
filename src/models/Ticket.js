const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Ticket = sequelize.define("Ticket", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"),
    defaultValue: "OPEN",
  },
  priority: {
    type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
    defaultValue: "MEDIUM",
  },
  responseDueAt: {
  type: DataTypes.DATE,
  allowNull: true,
},
resolutionDueAt: {
  type: DataTypes.DATE,
  allowNull: true,
},
isBreached: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
},
customerId: DataTypes.INTEGER,
agentId: DataTypes.INTEGER
});

// Associations
Ticket.belongsTo(User, { as: "customer", foreignKey: "customerId" });
Ticket.belongsTo(User, { as: "agent", foreignKey: "agentId" });

module.exports = Ticket;
