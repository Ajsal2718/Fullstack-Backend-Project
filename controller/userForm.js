const bcrypt = require("bcrypt");
const userModel = require("../models/UserSchema");
const productModel = require("../models/productSchema");
const jwt = require("../middleware/jwt");
const { tryCatch } = require("../middleware/trycatchHandler");
const accountSid = process.env.TWILO_ACCOUNT;
const authToken = process.env.TWILO_AUTH_TOKEN;
const verifySid = process.env.TWILO_VERIFY_SID;
const client = require("twilio")(accountSid, authToken);
// console.log(authToken);

///////////// SignUp //////////////
const userSignUp = async (req, res) => {
  console.log("start");
  const user = req.body;
  const phone = req.body.phone;
  const findEmail = await userModel.findOne({ email: user.email });
  console.log(req.body);
  if (!findEmail) {
    client.verify.v2
      .services(verifySid)
      .verifications.create({ to:phone, channel: "sms" })
      .then((verification) => {
        console.log(verification.status);
        if (verification.status == "pending") {

          let otpToken = jwt( verification.code);
          res.cookie("otp",otpToken);
          res.status(200).send("Success");

        }
      })
      .catch((err) => {
        res.status(401).send("Failed");
        console.log(err);
      });
  } else {
    res.status(500).send("This Email is already registered");
  }
};

/////////////// OTP Verification //////////
const verifyOtp = async (req, res) => {
  const user = req.body;
  const phone = req.body.phone;
  const otp = req.body.otp;

  client.verify.v2
    .services(verifySid)
    .verificationChecks.create({ to: phone, code: otp })
    .then(async (verification_check) => {
      if (verification_check.status === "approved") {
        let newUser = await userModel.create(user);
        console.log(newUser);
        let token = jwt(newUser.email);
        res.cookie("UserToken",token);
        res
          .status(200)
          .json({ status: "Success", userDetials: newUser, token: token });
      } else {
        res.status(401).json({ message: "Invalid OTP" });
      }
    });
};

/////////////// Login /////////////////
const userLogin = tryCatch(async (req, res) => {
  const { email, password } = req.body;
  const userDetials = await userModel.findOne({ email: email });
  if (userDetials) {
    const auth = await bcrypt.compare(password, userDetials.password);
    if (auth) {
      const token = jwt(userDetials._id, userDetials.username);
      res.cookie("UserToken", token);
      res.status(200).json({
        user: userDetials,
        status: "success",
        token: token,
      });
    } else {
      res.status(401).send("Incorrect Password or Email");
    }
  }
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
const  getUserID = tryCatch(async (req, res) =>{ 
   let id = req.params.id ;
   let userData = await userModel.findById(id);
   return res.status(200).json(userData);
});

module.exports = {
  userSignUp,
  verifyOtp,
  userLogin,
  logoutUser,
  getUserID
};
