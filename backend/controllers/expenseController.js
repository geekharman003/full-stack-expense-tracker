const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const geminiService = require("../services/geminiService");
const sequelize = require("../utils/db-connection");


// adds the expense
const addExpense = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { amount, description, category } = req.body;
    const { user } = req;

    if (!amount || !description) {
      return res
        .status(400)
        .send("amount,description and category are required");
    }

    // const category = await geminiService.createCategory(description);

    const fetchedUser = await User.findByPk(user.id, {
      raw: true,
      transaction,
    });
    const prevTotalExpense = fetchedUser.totalExpenses;
    const newTotalExpense = prevTotalExpense + Number(amount);

    await User.update(
      {
        totalExpenses: newTotalExpense,
      },
      {
        where: {
          id: user.id,
        },
        transaction,
      },
    );

    const expense = await Expense.create(
      {
        amount,
        description,
        category,
        userId: user.id,
      },
      {
        raw: true,
        transaction,
      },
    );

    if (!expense) {
      throw new Error("error creating entry in database");
    }

    await transaction.commit();

    res.status(201).json(expense.toJSON());
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};


// delete the expense
const deleteExpense = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { user } = req;

    const fetchedUser = await User.findByPk(user.id, {
      raw: true,
      transaction,
    });
    const expense = await Expense.findByPk(id, { raw: true, transaction });

    const newTotalExpense = fetchedUser.totalExpenses - expense.amount;

    await User.update(
      {
        totalExpenses: newTotalExpense,
      },
      {
        where: {
          id: user.id,
        },
        transaction,
      },
    );

    const expenseToDelete = await Expense.destroy({
      where: {
        id,
      },
      transaction,
    });

    if (!expenseToDelete) {
      return res.status(404).send("expense not found");
    }

    await transaction.commit();
    res.status(200).json({
      message: "expense deleted successfully",
      success: true,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).send(error.message);
  }
};

// load all expenses
const loadAllExpenses = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { user } = req;
    const expenses = await Expense.findAll({
      where: {
        userId: user.id,
      },
      transaction,
    });

    const fetchedUser = await User.findByPk(user.id, {
      raw: true,
      transaction,
    });
    const isPremiumUser = fetchedUser.isPremium;

    if (expenses.length === 0) {
      return res
        .status(404)
        .send({ message: "no expense found", isPremiumUser });
    }

    await transaction.commit();
    res.status(200).json({ expenses, isPremiumUser });
  } catch (error) {
    await transaction.rollback();
    res.status(500).send(error.message);
  }
};

// 
const loadNExpenses = async (req, res) => {
  const page = Number(req.query.page);
  const { id } = req.user;

  const ITEMS_PER_PAGE = 3;
  const offset = (page - 1) * ITEMS_PER_PAGE;
  let totalItems = null;

  try {
    const total = await Expense.count({
      where: {
        userId: id,
      },
    });

    totalItems = total;

    const expenses = await Expense.findAll({
      where: {
        userId: id,
      },
      attributes: ["id","amount","description","category"],
      raw: true,
      limit: Number(ITEMS_PER_PAGE),
      offset: Number(offset),
    });

    res.status(200).json({
      expenses,
      pagination: {
        currentPage: page,
        hasNextPage: totalItems > page * ITEMS_PER_PAGE,
        nextPage: page + 1,
        hasPrevPage: page > 1,
        prevPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        totalItems,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = { addExpense, deleteExpense, loadAllExpenses, loadNExpenses };
