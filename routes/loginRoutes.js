const express = require("express");
const loginControlller = require("../controllers/loginController");
const router = express.Router();

router.post("/register", loginControlller.registerUser);
router.post("/login", loginControlller.adminLogin);
router.post("/verifyOTP", loginControlller.verifyOtp);
router.post("/requestOTP", loginControlller.requestOtp);

module.exports = router;
