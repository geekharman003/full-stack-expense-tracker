const { randomUUID } = require("crypto");
const User = require("../models/userModel");
const ForgotPasswordRequests = require("../models/ForgotPasswordRequests");
const brevoService = require("../services/brevoService");
const sequelize = require("../utils/db-connection");
const path = require("path");
const bcrypt = require("bcrypt");

const generateResetUrl = async (req, res) => {
  const transaction = await sequelize.transaction();
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
      transaction,
    });

    if (!user) {
      return res.status(404).json({
        message: "user not exist",
        success: "false",
      });
    }

    const uuid = randomUUID();
    const resetUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    await brevoService.sendEmail(user.email, uuid, resetUrl);

    await ForgotPasswordRequests.create(
      {
        id: uuid,
        userId: user.id,
        isActive: true,
      },
      {
        transaction,
      }
    );

    await transaction.commit();

    res.status(200).json({
      message: "password reset email sent successfully",
      success: "true",
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).send(error);
  }
};

const validateResetUrl = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { uuid } = req.params;

    const forgotPassRequest = await ForgotPasswordRequests.findByPk(uuid, {
      raw: true,
      transaction,
    });

    if (!forgotPassRequest) {
      return res.status(404).json({
        message: "no forgot password request found for this uuid",
        success: "false",
      });
    }

    const isActive = forgotPassRequest.isActive;
    if (isActive) {
      return res.sendFile(
        path.join(__dirname, "..", "public", "html", "resetForm.html")
      );
    } else {
      return res.status(400).json({
        message: "reset password link is not active",
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const resetPassword = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required",
        success: false,
      });
    }

    // change the password in database for this email
    // hash the password using bcrypt
    bcrypt.hash(password, 10, async (err, hash) => {
      // Store hash in your password DB.
      const user = await User.update(
        {
          password: hash,
        },
        {
          where: {
            email,
          },
        }
      );

      if (!user) {
        throw new Error("error occur during password update");
      }

      await ForgotPasswordRequests.update({
        isActive:false
      },{
        where:{
          userId:user.id
        }
      })

      res.status(201).send("User Created Successfully");
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "internal server error",
      success: false,
    });
  }
};

module.exports = { generateResetUrl, validateResetUrl, resetPassword };
