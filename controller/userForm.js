const userModel = require("../models/UserSchema");
const productModel = require("../models/productSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { tryCatch } = require("../middleware/trycatchHandler");

///////////// SignUp //////////////
const userSignUp = async (req, res) => {
  try {
    const findEmail = await userModel.findOne({ email: req.body.email });
    if (findEmail) {
      return res.status(401).json({
        alert: "401 error",
        message: "Email  is already exist",
      });
    } else {
      const user = await userModel.create(req.body);
      return res.status(201).json({
        user,
        message: "User created successfully",
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

/////////////// Login /////////////////
const userLogin = tryCatch(async (req, res) => {
  const { email, password } = req.body;
  const userDetials = await userModel.aggregate([{ $match: { email: email } }]);
  let hasPassword = userDetials[0].password;

  if (!userDetials) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
  const validPassword = await bcrypt.compare(password, hasPassword);
  if (!validPassword) {
    res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
    return;
  }

  const token = jwt.sign({ email: email, id: password }, "somesupersecretkey", {
    expiresIn: "365d",
  });
  console.log(token);
  console.log("Login Successful");

  res.status(202).cookie("token", token).json({
    success: true,
    message: "Successful login",
  });
});

module.exports = {
  userSignUp,
  userLogin,
};
