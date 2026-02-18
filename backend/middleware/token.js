const jwt = require("jsonwebtoken");

const verifyToken = (req, res) => {
  try {
    let token = null;

    token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized!",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    res.status(200).json({
      success: true,
      decoded,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
    });
  }
};

module.exports = verifyToken;
