const User = require("../models/User");

// POST a new user
const saveUser = async (req, res) => {
  try {
    const user = req.body;

    if (!user?.email) {
      return res.status(400).json({ error: "User email is required" });
    }

    const existingUser = await User.findOne({ email: user.email });

    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    const newUser = new User(user);
    const result = await newUser.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkAdminStatus = async (req, res) => {
  const { email } = req.params;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has an "Admin" role
    if (user.role === "Admin") {
      return res.status(200).json({ isAdmin: true });
    }

    // If the user is not an admin
    return res.status(200).json({ isAdmin: false });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  saveUser,
  checkAdminStatus,
};
