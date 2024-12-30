const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    role: { type: String, default: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
