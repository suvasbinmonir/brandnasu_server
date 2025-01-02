const express = require("express");
const multer = require("multer");
const { uploadFiles } = require("../controllers/fileController");

const router = express.Router();

// Configure multer for local uploads
const upload = multer({ dest: "uploads/" });

// File upload route (allow multiple files with field name `files`)
router.post("/upload", upload.array("files", 5), uploadFiles);

module.exports = router;
