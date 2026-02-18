require("dotenv").config();

const db = require("./utils/db-connection");
const fs = require("fs");
const cors = require("cors");
// const cookieParser = require("cookie-parser");
const models = require("./models");

const paymentsRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const premiumRoutes = require("./routes/premiumRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

const brevoService = require("./services/brevoService");
const cashFreeService = require("./services/cashfreeService");
const geminiService = require("./services/geminiService");

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cors());
// app.use(cookieParser());

app.use("/", paymentsRoutes);
app.use("/user", userRoutes);
app.use("/expenses", expenseRoutes);
app.use("/premium", premiumRoutes);
app.use("/password", passwordRoutes);

db.sync()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log("server is running");
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
