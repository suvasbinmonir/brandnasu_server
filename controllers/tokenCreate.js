const jwt = require("jsonwebtoken");

// Controller: Generate JWT
const generateJWT = (req, res) => {
  try {
    const user = req.body;
    console.log("User->", user);

    if (!user || !user.email) {
      return res.status(400).send({ message: "Invalid user data" });
    }

    // Create a token with the user's email and role
    const token = jwt.sign(
      { email: user.email, role: user.role || "User" },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    console.log("Token successfully create->", token);

    res.status(200).send({ token: token });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).send({ message: "Failed to generate token" });
  }
};

module.exports = {
  generateJWT,
};
