// const mongoose = require("mongoose");

// console.log(process.env.MONGODB_URI);

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       dbName: "BrandNasu",
//     });

//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const { GridFSBucket } = require("mongodb");

let gfs;
let gridfsBucket;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "BrandNasu",
    });

    console.log(`MongoDB Connected: ${process.env.MONGODB_URI}`);

    gridfsBucket = new GridFSBucket(conn.connection.db, {
      bucketName: "uploads",
    });
    gfs = Grid(conn.connection.db, mongoose.mongo);
    gfs.collection("uploads");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB, gfs, gridfsBucket };
