const json = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const user = json.verify(token, "secretkey");
    req.user = user;
    next();
  } catch (error) {
    console.log(error.message)
    if (error.message === "jwt malformed") {
      return res.status(401).json({
        message: error.message,
        status: false,
      });
    }

    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = { authenticateUser };
