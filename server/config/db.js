const mongoose = require('mongoose');
const dns = require('dns');

// Configure reliable DNS servers on Windows home routers to ensure Atlas SRV resolution
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (e) {
    // Graceful fallback
  }
}

/**
 * MongoDB Atlas Connection Utility
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('❌ MONGO_URI is missing from environment variables!');
    console.error('👉 Please add MONGO_URI in your Render Dashboard > Environment.');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    return null;
  }
};

module.exports = connectDB;
