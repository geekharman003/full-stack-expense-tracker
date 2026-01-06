const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  "expensetracker",
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("database connected");
  } catch (err) {
    console.log(err.message);
  }
})();

module.exports = sequelize;
