const express = require("express");
const app = express();
const db = require("./utils/db-connection");
const User = require("./models/userModel");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);

db.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log("server is running");
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
