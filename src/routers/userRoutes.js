const express = require("express");
const { getProfile, getUserPages ,getPageInsights} = require("../controllers/userController");
const router = express.Router();
router.get("/profile", getProfile);
router.get("/pages", getUserPages);
router.get("/pagesInsights", getPageInsights);

module.exports = router;