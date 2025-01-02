const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const File = require("../models/fileModel");
const fs = require("fs/promises");
require("dotenv").config();

// Initialize S3 client
const s3Client = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  region: "auto",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Upload files to R2
exports.uploadFiles = async (req, res) => {
  const files = req.files; // Use `req.files` for multiple files

  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  if (files.length > 5) {
    return res
      .status(400)
      .json({ message: "You can upload a maximum of 5 files." });
  }

  const bucketName = process.env.R2_BUCKET_NAME;
  const uploadedFiles = [];

  try {
    const uploadPromises = files.map(async (file) => {
      const fileStream = await fs.readFile(file.path);
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: file.originalname,
        Body: fileStream,
        ContentType: file.mimetype,
      });

      await s3Client.send(command);

      const fileUrl = `${process.env.R2_ENDPOINT_DEV}/${file.originalname}`;
      const savedFile = await File.create({
        filename: file.originalname,
        url: fileUrl,
      });

      await fs.unlink(file.path); // Delete the file from local uploads

      return savedFile;
    });

    const results = await Promise.all(uploadPromises);
    res.status(201).json({
      message: "Files uploaded successfully",
      files: results,
    });
  } catch (err) {
    console.error("Error uploading files:", err);
    res.status(500).json({ message: "File upload failed", error: err.message });
  }
};
