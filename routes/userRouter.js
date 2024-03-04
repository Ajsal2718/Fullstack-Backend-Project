const express = require("express");
const router = express.Router();
const controller = require('../controller/userForm');

////////////  //////////////////
router.route('/signup').post(controller.userSignUp);
router.route('/otpverify').post(controller.verifyOtp);
router.route("/login").post(controller.userLogin);
router.route('/logout').get(controller.logoutUser);
router.route('/getuser/:id').get(controller.getUserID);

module.exports = router;