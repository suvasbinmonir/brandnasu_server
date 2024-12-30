const express = require("express");
const { saveUser, checkAdminStatus } = require("../controllers/userController");
const { verifyToken } = require("../middlewares/adminMiddleware");
const router = express.Router();

/**
 * POST /user
 * Route to save a user info
 */
router.post("/user", saveUser);

// Route to check if the user is an admin
router.get("/users/admin/:email", verifyToken, checkAdminStatus);

module.exports = router;
