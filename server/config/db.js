const mongoose = require('mongoose');
const dns = require('dns');

// Configure reliable DNS servers to ensure Atlas SRV resolution on Windows
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Graceful fallback
}

/**
 * MongoDB Atlas Connection Utility
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // In dev mode without Atlas credentials configured yet, inform gracefully
    console.log(`ℹ️ To use a live database, set a valid MONGO_URI in server/.env`);
    return null;
  }
};

module.exports = connectDB;
