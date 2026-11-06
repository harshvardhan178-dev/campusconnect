const mongoose = require('mongoose');

// Direct 3-node replica set connection string (bypasses DNS SRV lookup failures on cloud hosts)
const DIRECT_ATLAS_URI =
  'mongodb://harshvardhan:Harsh%40123@ac-hq3np4o-shard-00-00.1ummtqf.mongodb.net:27017,ac-hq3np4o-shard-00-01.1ummtqf.mongodb.net:27017,ac-hq3np4o-shard-00-02.1ummtqf.mongodb.net:27017/campusconnect?ssl=true&replicaSet=atlas-1ck0dq-shard-0&authSource=admin&retryWrites=true&w=majority';

/**
 * MongoDB Atlas Connection Utility
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI || DIRECT_ATLAS_URI;

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Primary MongoDB Connection failed: ${error.message}. Retrying with direct replica set...`);
    try {
      const fallbackConn = await mongoose.connect(DIRECT_ATLAS_URI, {
        autoIndex: true,
        serverSelectionTimeoutMS: 8000,
      });
      console.log(`✅ MongoDB Atlas Direct Connected: ${fallbackConn.connection.host}`);
      return fallbackConn;
    } catch (fallbackError) {
      console.error(`❌ Fatal MongoDB Connection Error: ${fallbackError.message}`);
      return null;
    }
  }
};

module.exports = connectDB;
