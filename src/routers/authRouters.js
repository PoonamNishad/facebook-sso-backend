const express = require("express");
const { facebookLogin, register, login } = require("../controllers/authController");
const router = express.Router();
router.post("/facebook", facebookLogin);
router.post("/register", register);
router.post("/login", login);
module.exports = router;