// routes/otpRoutes.js
const express = require('express');
const otpController = require('../controller/otpController');
const router = express.Router();
router.route('/send-otp').post(otpController.sendOTP);
module.exports = router;