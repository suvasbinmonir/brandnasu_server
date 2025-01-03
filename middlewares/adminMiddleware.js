const User = require("../models/User");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log("Headers received:", req.headers);

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized access: No token or invalid format" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err.message);
      return res
        .status(401)
        .json({ message: "Unauthorized access: Invalid token" });
    }

    req.decoded = decoded;
    console.log("Decoded Token:", req.decoded);
    next();
  });
};

const verifyAdmin = async (req, res, next) => {
  try {
    const email = req.decoded?.email;
    if (!email) {
      return res.status(400).send({ message: "Invalid token payload" });
    }

    const user = await User.findOne({ email });
    if (!user || user.role !== "Admin") {
      return res.status(403).send({ message: "Forbidden access" });
    }

    next();
  } catch (error) {
    console.error("Error in admin verification:", error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = {
  verifyToken,
  verifyAdmin,
};
