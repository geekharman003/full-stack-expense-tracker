const User = require("../models/userModel");
const brevoService = require("../services/brevoService");

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "email is required",
        success: "false",
      });
    }

    const user = await User.findOne({
      where: {
        email,
      },
      raw: true,
    });

    if (!user) {
      return res.status(404).json({
        message: "user not exist",
        success: "false",
      });
    }

    await brevoService.sendEmail(user.email);

    res.status(200).json({
      message: "password reset email sent successfully",
      success: "true",
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { resetPassword };
