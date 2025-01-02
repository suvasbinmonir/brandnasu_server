const express = require("express");
const multer = require("multer");
const { uploadFile } = require("../controllers/fileController");

const router = express.Router();

// Configure multer for local uploads
const upload = multer({ dest: "uploads/" });

// File upload route
router.post("/upload", upload.single("file"), uploadFile);

module.exports = router;
