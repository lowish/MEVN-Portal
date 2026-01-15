const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Remove deprecated options
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hau_portal');

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
    
    // Listen for connection errors
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('Make sure MongoDB is running on your system');
    process.exit(1);
  }
};

module.exports = connectDB;
