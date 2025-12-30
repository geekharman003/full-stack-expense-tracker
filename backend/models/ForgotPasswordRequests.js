const { DataTypes } = require("sequelize");
const db = require("../utils/db-connection");

const ForgotPasswordRequests = db.define("ForgotPasswordRequests", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = ForgotPasswordRequests;
