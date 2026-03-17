const mongoose = require('mongoose');

let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) {
    return cachedDb;
  }
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/loan_admin_db';
    const conn = await mongoose.connect(uri);
    cachedDb = conn;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
