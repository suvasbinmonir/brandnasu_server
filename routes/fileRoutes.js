const express = require("express");
const router = express.Router();
const { uploadFile, getFiles } = require("../controllers/fileController");

// File upload route
router.post("/upload", uploadFile);

// (Optional) Route to fetch all uploaded files
router.get("/files", getFiles);

module.exports = router;
