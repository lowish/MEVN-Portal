require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');

const app = express();

// Connect to MongoDB first
console.log('Connecting to MongoDB...');
connectDB();

// CORS configuration - MUST be before routes
app.use(cors({
  origin: '*', // Allow all for testing
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Body parser middleware - MUST be before routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] ${req.method} ${req.path}`);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Body:', req.body);
  console.log('Body empty?', Object.keys(req.body || {}).length === 0);
  next();
});

// Test endpoint BEFORE auth routes
app.post('/api/test', (req, res) => {
  console.log('\n=== TEST ENDPOINT HIT ===');
  console.log('Body received:', req.body);
  res.json({
    success: true,
    message: 'Test working!',
    receivedData: req.body
  });
});

// Routes - Use auth routes
app.use('/api', authRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'HAU Portal API is running',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'HAU Portal Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      test: 'POST /api/test',
      register: 'POST /api/register',
      login: 'POST /api/login'
    }
  });
});

// 404 handler
app.use((req, res) => {
  console.log('❌ 404 - Route not found:', req.path);
  res.status(404).json({ 
    success: false,
    message: `Route not found: ${req.method} ${req.path}` 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('\n❌ Express Error Handler:');
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  
  res.status(500).json({ 
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n=================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`🔍 Test: POST http://localhost:${PORT}/api/test`);
  console.log('=================================\n');
});

module.exports = app;
