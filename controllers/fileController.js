const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const File = require("../models/fileModel");
const fs = require("fs");
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

// Upload file to R2
exports.uploadFile = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const bucketName = process.env.R2_BUCKET_NAME;
  const key = file.filename; // Use the uploaded filename

  try {
    // Upload to R2
    const fileStream = fs.createReadStream(file.path);
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: file.originalname,
      Body: fileStream,
      ContentType: file.mimetype,
    });

    await s3Client.send(command);

    const fileUrl = `${process.env.R2_ENDPOINT_DEV}/${file.originalname}`;

    console.log(fileUrl, "getting image url");

    // Save to MongoDB
    const savedFile = await File.create({ filename: key, url: fileUrl });

    // Remove local file
    fs.unlinkSync(file.path);

    res
      .status(201)
      .json({ message: "File uploaded successfully", file: savedFile });
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).json({ message: "File upload failed", error: err.message });
  }
};
