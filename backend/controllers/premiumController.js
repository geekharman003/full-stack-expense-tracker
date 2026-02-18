const User = require("../models/userModel");
const Expense = require("../models/expenseModel");
const FilesDownloaded = require("../models/filesDownloadedModel");

const S3Service = require("../services/S3Service");

const checkPremium = async (req, res) => {
  const { id } = req.user;

  const user = await User.findByPk(id, {
    attributes: ["isPremium"],
    raw: true,
  });

  if (!user) {
    return res.status(404).json({
      status: false,
      message: "no user found",
    });
  }

  res.status(200).json(user);
};

const loadLeaderBorad = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["name", "totalExpenses"],
      order: [["totalExpenses", "DESC"]],
      limit: 3,
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

const downloadExpenses = async (req, res) => {
  try {
    const { user } = req;
    const expenses = await Expense.findAll({
      attributes: ["amount", "description", "category"],
      where: {
        userId: user.id,
      },
      raw: true,
    });

    if (!expenses.length) {
      return res.status(404).json({
        success: false,
        message: "no expense found",
      });
    }

    const stringifiedExpenses = JSON.stringify(expenses);
    const filename = "Expenses";

    const objectURL = await S3Service.uploadToS3(
      user,
      stringifiedExpenses,
      filename,
    );
    const downloadedExpense = await FilesDownloaded.create(
      {
        url: objectURL,
        userId: user.id,
      },
      { raw: true },
    );

    res.status(200).json({
      success: true,
      objectURL,
      urlId: downloadedExpense.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

const getDownloadedExpenses = async (req, res) => {
  try {
    const urls = await FilesDownloaded.findAll({
      attributes: ["id", "url"],
      where: {
        userId: req.user.id,
      },
      raw: true,
    });

    res.status(200).json({
      success: true,
      urls,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = {
  checkPremium,
  loadLeaderBorad,
  downloadExpenses,
  getDownloadedExpenses,
};
