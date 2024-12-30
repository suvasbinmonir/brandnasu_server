const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  card: { type: String, default: null },
  linkedInUrl: { type: String, default: null },
  amount: { type: Number, required: true },
  country: { type: String, default: "N/A" },
  transactionId: { type: String, required: true, unique: true },
  date: { type: String, default: () => new Date().toISOString() },
});

module.exports = mongoose.model("Payment", PaymentSchema);
