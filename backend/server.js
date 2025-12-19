const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log("server is running");
});
