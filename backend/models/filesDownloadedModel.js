const { DataTypes } = require("sequelize");
const db = require("../utils/db-connection");

const FilesDownloaded = db.define("filesdownloaded", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = FilesDownloaded;
