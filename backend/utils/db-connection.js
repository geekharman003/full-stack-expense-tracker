const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("expensetracker", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("database connected");
  } catch (err) {
    console.log(err.message);
  }
})();

module.exports = sequelize;
