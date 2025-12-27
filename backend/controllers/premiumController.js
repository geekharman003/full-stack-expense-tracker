const User = require("../models/userModel");

const loadLeaderBorad = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["name", "totalExpenses"],
      order: [["totalExpenses", "DESC"]],
      raw: true,
    });

    if (!users) {
      return res.status(404).send("no user found");
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { loadLeaderBorad };
