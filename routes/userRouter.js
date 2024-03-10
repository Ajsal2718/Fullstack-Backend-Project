const express = require("express");
const router = express.Router();
const controller = require('../controller/userForm');

////////////  //////////////////
// router.route('/signu').post(controller.userSignUp);
// router.route('/otpverify').post(controller.registerUser);
router.route("/login").post(controller.UserLogin);
router.route('/logout').get(controller.logoutUser);
router.route('/getuser/:id').get(controller.getUserID);

module.exports = router;