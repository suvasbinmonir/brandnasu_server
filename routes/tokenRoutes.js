const express = require("express");
const { generateJWT } = require("../controllers/tokenCreate");
const router = express.Router();

/**
 * POST /api/payments/user
 * Route to create a payment intent
 */
router.post("/jwt", generateJWT);

module.exports = router;
