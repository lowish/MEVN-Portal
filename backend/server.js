require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/studentRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const MONGO_URI = process.env.MONGO_URI_ATLAS || 'mongodb+srv://lowishxx_db_user:L7oC1P4RNEbJ4PyO@cluster0.kxiuyrc.mongodb.net/?appName=Cluster0';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected to lowishxx_db_user'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Student Portal API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ 
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5003; // Change from 5002 to 5003
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
});
