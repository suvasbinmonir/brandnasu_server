const express = require("express");
const {
  createPaymentIntent,
  storePayment,
  getAllPayments,
  deletePayment,
} = require("../controllers/paymentController");
const { verifyToken, verifyAdmin } = require("../middlewares/adminMiddleware");
const router = express.Router();

/**
 * POST /payments/create-payment-intent
 * Route to create a payment intent
 */
router.post("/create-payment-intent", createPaymentIntent);

/**
 * POST /payments
 * Route to store payment information
 */
router.post("/payments", storePayment);

/**
 * GET /payments
 * Route to get all payment records
 */
router.get("/payments", verifyToken, verifyAdmin, getAllPayments);

/**
 * DELETE /payments/:transactionId
 * Route to delete a payment by transactionId
 */
router.delete(
  "/payments/:transactionId",
  verifyToken,
  verifyAdmin,
  deletePayment
);

module.exports = router;
