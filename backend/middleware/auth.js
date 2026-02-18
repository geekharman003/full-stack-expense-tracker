const json = require("jsonwebtoken");
const { User } = require("../models");

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    const decoded = json.verify(token, process.env.JWT_SECRET_KEY);
    
    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const user = await User.findByPk(decoded.id,{raw:true});
    
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

module.exports = { authenticateUser };
