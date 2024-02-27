const express = require("express");
const router = express.Router();
const controller = require('../controller/userForm');

////////////  //////////////////
router.route('/signup').post(controller.userSignUp);
router.route("/login").post(controller.userLogin);


module.exports = router;