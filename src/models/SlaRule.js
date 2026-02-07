const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SlaRule = sequelize.define("SlaRule", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  priority: {
    type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
    unique: true,
    allowNull: false,
  },
  responseTime: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: false,
  },
  resolutionTime: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: false,
  },
});

module.exports = SlaRule;
