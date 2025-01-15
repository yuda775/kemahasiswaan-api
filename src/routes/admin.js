const express = require("express");
const router = express.Router();

const adminService = require("../service/admin");

router.post("/login", adminService.login);
router.post("/register", adminService.createAdmin);

module.exports = router;
