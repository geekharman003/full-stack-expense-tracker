const { randomUUID } = require("crypto");
const User = require("../models/userModel");
const ForgotPasswordRequests = require("../models/ForgotPasswordRequests");
const brevoService = require("../services/brevoService");
const sequelize = require("../utils/db-connection");
const path = require("path");
const bcrypt = require("bcrypt");

// generates the reset url and send to the user email
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

// validate the uuid
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
        message: "reset password url is expired",
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// reset the password
const resetPassword = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { password, uuid } = req.body;

    // if no password or uuid is present
    if (!password || !uuid) {
      return res.status(400).json({
        message: "password or uuid is missing",
        success: false,
      });
    }

    // find the forgot password request with this uuid
    const forgotPassRequest = await ForgotPasswordRequests.findByPk(uuid, {
      raw: true,
      transaction,
    });

    // if forgot password reqest is not found
    if (!forgotPassRequest) {
      return res.status(404).json({
        message: "no forgot password request found for this id",
        success: false,
      });
    }

    // if forgot password request is not active
    if (!forgotPassRequest.isActive) {
      return res.status(400).json({
        message: "password reset url is invalid",
        success: false,
      });
    }

    // hash the password using bcrypt
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return res.status(401).json({
          message: "error during password hashing",
          success: false,
        });
      }

      // change the password for user
      const user = await User.update(
        {
          password: hash,
        },
        {
          where: {
            id: forgotPassRequest.userId,
          },
          transaction,
        }
      );

      // make the uuid invalid
      await ForgotPasswordRequests.update(
        {
          isActive: false,
        },
        {
          where: {
            id: uuid,
          },
          transaction,
        }
      );

      //commit the transaction
      await transaction.commit();

      // send the valid response
      res.status(200).json({
        message: "password change successfully",
        success: true,
      });
    });
  } catch (error) {
    // rollback the error in case of error
    await transaction.rollback();
    console.error(error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = { generateResetUrl, validateResetUrl, resetPassword };
