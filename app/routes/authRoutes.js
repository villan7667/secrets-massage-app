const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

// Home
router.get("/", auth.getHome);

// Register
router.get("/register", auth.getRegister);
router.post("/register", auth.postRegister);

// Login
router.get("/login", auth.getLogin);
router.post("/login", auth.postLogin);

// Logout
router.get("/logout", auth.logout);

module.exports = router;
