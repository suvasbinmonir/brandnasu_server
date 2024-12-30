const { GridFsStorage } = require("multer-gridfs-storage");
const crypto = require("crypto");
const path = require("path");
const multer = require("multer");
const storage = new GridFsStorage({
  url: `mongodb+srv://brand-nasy-server:lSkEJjcYYmO5tMFL@cluster0.4ldhpeq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,

  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    console.log("File upload initiated:", file);
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          console.error("Error generating filename:", err);
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        console.log("Generated filename:", filename);
        const fileInfo = {
          filename: `${Date.now()}_${file.originalname}`,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

module.exports = upload;
