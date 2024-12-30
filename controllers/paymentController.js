const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/Payment");

/**
 * Controller function to create a payment intent
 */
const createPaymentIntent = async (req, res) => {
  try {
    const { price } = req.body;

    if (!price || typeof price !== "number" || price <= 0) {
      return res.status(400).json({ error: "Invalid price provided." });
    }

    const amount = Math.round(price * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


/**
 * Controller function to store payment information
 */
const storePayment = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      linkedInUrl,
      card,
      amount,
      country,
      transactionId,
      date,
    } = req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !amount ||
      !transactionId ||
      typeof amount !== "number" ||
      amount <= 0
    ) {
      return res.status(400).json({ error: "Missing or invalid payment details." });
    }

    // Save the payment in the database
    const payment = new Payment({
      firstName,
      lastName,
      email,
      linkedInUrl,
      card,
      amount,
      country,
      transactionId,
      date: date || new Date().toISOString(),
    });

    await payment.save(); // Save to the database

    res.status(201).json({ message: "Payment recorded successfully.", payment });
  } catch (error) {
    console.error("Error storing payment:", error.message);

    if (error.code === 11000) {
      // Handle duplicate transactionId
      return res.status(400).json({ error: "Duplicate transaction ID." });
    }

    res.status(500).json({ error: "Failed to store payment details." });
  }
};

/**
 * Controller function to get all payment records
 */
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find(); // Retrieve all payments from the database

    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: "No payments found" });
    }

    res.status(200).json({ payments });
  } catch (error) {
    console.error("Error fetching payments:", error.message);
    res.status(500).json({ error: "Failed to fetch payment records" });
  }
};

/**
 * Controller function to delete a payment by transaction ID
 */
const deletePayment = async (req, res) => {
  try {
    const { transactionId } = req.params;

    // Ensure transactionId is provided
    if (!transactionId) {
      return res.status(400).json({ error: "Transaction ID is required." });
    }

    // Delete payment from the database
    const deletedPayment = await Payment.findOneAndDelete({ transactionId });

    // Check if the payment was found and deleted
    if (!deletedPayment) {
      return res.status(404).json({ error: "Payment not found." });
    }

    res.status(200).json({ message: "Payment deleted successfully", deletedPayment });
  } catch (error) {
    console.error("Error deleting payment:", error.message);
    res.status(500).json({ error: "Failed to delete payment." });
  }
};

module.exports = { createPaymentIntent, storePayment, getAllPayments, deletePayment };
