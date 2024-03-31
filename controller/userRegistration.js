const bcrypt = require("bcrypt");
const {userModel} = require("../models/UserSchema");
// const otpGenerate = require("../utils/otpGenerator");
// const productModel = require("../models/productSchema");
const { signToken } = require("../middleware/jwt");
const { tryCatch } = require("../middleware/trycatchHandler");
const nodemailer = require("nodemailer");
const configJs = require("../config/config");

/////////////// Send OTP to customer email /////////////////
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "muhammedajsal532@gmail.com",
    pass: "zlwz vibs eprj xqyj",
  },
});

const generatedOtp = Math.floor(1000 + Math.random() * 9000);

const userSignUp = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const findEmail = await userModel.findOne({ email: email });

    if (findEmail) {
      return res.status(400).send("User already exists");
    }

    const verificationCode = generatedOtp;
    const mailOptions = {
      from: configJs.email.user,
      to: email,
      subject: "otp",
      text: verificationCode.toString(), // Convert to string
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Failed to send verification code");
      }
    });

    const newUser = await userModel.create(req.body);
    if (newUser) {
      res.cookie("otp", generatedOtp, { httpOnly: true, secure: true });
      console.log(generatedOtp);
      return res.status(200).json({
        message: "Successful registration",
        success: true,
      });
    }
  } catch (error) {
    console.log("Error creating user:", error);
    return res.status(500).json({
      alert: error.message,
      message: "Internal server error. Please try again later",
    });
  }
};

/////////////////// Verify the OTP from the user //////////////
const registerUser = tryCatch(async (req, res) => {
  const { otp } = req.body;
  const otpCookie = req.cookies.otp;
  console.log(otpCookie);

  const otpValid = otpCookie === otp;
  // console.log(otpCookie);
  if (!otpValid) {
    res.status(400).json({
      messaage: "Invalid OTP",
      success: false,
    });
    return;
  }
  res.clearCookie("otp");
  res.status(200).json({
    // data: Users._id,
    message: "Register Successfully! Please Login.",
    success: true,
  });
});

/////////////////// Users Login /////////////////
const UserLogin = tryCatch(async (req, res) => {
  const { email, password } = req.body;

  const checkUser = await userModel.findOne({ email: email });
  console.log(checkUser);
  if (!checkUser) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  // console.log(checkUser.password);

  const passwordMatch = await bcrypt.compare(password, checkUser.password);

  if (!passwordMatch) {
    return res.status(400).json({
      success: false,
      message: "Incorrect Password",
    });
    // return;
  }
  const accessToken = await signToken({
    email: checkUser.email,
    username: checkUser.username,
    userId: checkUser._id,
  });
  console.log(accessToken);
  console.log("Login Succesfull");

  res.cookie("token", accessToken);

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    accessToken,
    userId: checkUser.id,
  });
});

///////////////////  Logout ///////////////////
const logoutUser = tryCatch(async (req, res) => {
  res.clearCookie("UserToken");
  res.status(200).json({
    data: "Logged out Successfully!",
    message: "Success",
  });
});



/////////////////Get UserId /////////////
// const getUserID = tryCatch(async (req, res) => {
//   let id = req.params.id;
//   let userData = await userModel.findById(id);
//   return res.status(200).json(userData);
// });

module.exports = {
  userSignUp,
  registerUser,
  UserLogin,
  logoutUser,
};
