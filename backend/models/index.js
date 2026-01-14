const User = require("./userModel");
const Expense = require("./expenseModel");
const Payments = require("./paymentModel");
const ForgotPasswordRequests = require("./ForgotPasswordRequests");
const FilesDownloaded = require("./filesDownloadedModel");

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Payments);
Payments.belongsTo(User);

User.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(User);

User.hasMany(FilesDownloaded);
FilesDownloaded.belongsTo(User);

module.exports = { User, Expense, Payments };
