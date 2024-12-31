const multer = require("multer");
const path = require("path");
const fs = require("fs");
const File = require("../models/fileModel");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter }).single("file");

// Controller function for uploading a file
const uploadFile = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No file uploaded or invalid file format." });
    }

    const { filename, originalname, mimetype, size } = req.file;

    try {
      // Save file details to the database
      const newFile = new File({ filename, originalname, mimetype, size });
      await newFile.save();

      const fileUrl = `https://brandnasu-server.vercel.app/uploads/${filename}`;
      res.status(201).json({
        message: "File uploaded successfully!",
        file: {
          name: originalname,
          url: fileUrl,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error saving file details to the database." });
    }
  });
};

// Controller function to get uploaded files (optional)
const getFiles = async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: "Error fetching files from the database." });
  }
};

module.exports = { uploadFile, getFiles };

// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const File = require("../models/fileModel");

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, "../uploads");
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath);
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// // File filter for images only
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed!"), false);
//   }
// };

// // Set up multer
// const upload = multer({ storage, fileFilter }).single("file");

// // Controller function for uploading a file
// const uploadFile = (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       return res.status(400).json({ error: err.message });
//     }

//     if (!req.file) {
//       return res
//         .status(400)
//         .json({ error: "No file uploaded or invalid file format." });
//     }

//     const { filename } = req.file;

//     try {
//       // Construct the file URL
//       const imageUrl = `https://brandnasu-server.vercel.app/uploads/${filename}`;

//       // Save only the image URL to the database
//       const newFile = new File({ imageUrl });
//       await newFile.save();

//       res.status(201).json({
//         message: "File uploaded successfully!",
//         file: {
//           url: imageUrl,
//         },
//       });
//     } catch (error) {
//       res
//         .status(500)
//         .json({ error: "Error saving image URL to the database." });
//     }
//   });
// };

// // Controller function to get uploaded files
// const getFiles = async (req, res) => {
//   try {
//     const files = await File.find();
//     res.status(200).json(files);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching files from the database." });
//   }
// };

// module.exports = { uploadFile, getFiles };
