const sequelize = require("../utils/db-connection");
const { QueryTypes } = require("sequelize");
const loadLeaderBorad = async (req, res) => {
  // first sum all the expenses of a user
  // then group them into one record
  // which will contain the total expense of that user.
  //   then sort them in descending order

  try {
    const users = await sequelize.query(
      `select u.name,coalesce(sum(e.amount),0) as totalExpense
       from users u
       left join expenses e
       ON u.id = e.userId
       group by u.id
       order by totalExpense DESC`,
      { type: QueryTypes.SELECT }
    );

    if (!users) {
      return res.status(404).send("no user found");
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { loadLeaderBorad };
