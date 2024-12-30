const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/connectDB");
const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes");
const jwtRoutes = require("./routes/tokenRoutes");
const fileRoutes = require("./routes/fileRoutes");

const port = process.env.PORT || 5000;

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to the database
connectDB();

// Handle preflight requests for all routes
app.options("*", cors(corsOptions));

// Routes
app.use("/api", paymentRoutes);
app.use("/", userRoutes);
app.use("/", jwtRoutes);
app.use("/", fileRoutes);

// Root Endpoint
app.get("/", (req, res) => {
  res.status(200).json("Server is running...");
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
