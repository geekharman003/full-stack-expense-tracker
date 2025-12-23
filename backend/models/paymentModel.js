const db = require("../utils/db-connection");
const { DataTypes } = require("sequelize");

const Payments = db.define("Payments", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentSessionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  orderAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  orderCurrency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Payments;
