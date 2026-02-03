const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // Ensure this path is correct
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find student
    const student = await Student.findOne({ studentNumber: decoded.studentNumber }).select('-password');
    
    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // Attach student to request
    req.student = student;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new student
 * @access  Public
 */
router.post('/register', async (req, res) => {
  console.log('\n=== Registration Request ===');
  console.log('Received body:', req.body);
  
  try {
    const { 
      fullName,
      birthDate,
      gender,
      religion,
      email,
      mobile,
      address,
      course,
      yearLevel,
      password,
      agreeTerms
    } = req.body;

    // Validation
    if (!fullName || !email || !password || !course) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields' 
      });
    }

    // Check if email exists
    console.log('Checking if email exists:', email);
    const existingStudent = await Student.findOne({ email: email.toLowerCase() });
    if (existingStudent) {
      console.log('❌ Email already registered');
      return res.status(400).json({ 
        success: false,
        message: 'Email already registered' 
      });
    }

    // Create new student
    console.log('Creating new student...');
    const student = new Student({
      fullName: fullName.trim(),
      birthDate: birthDate || null,
      gender: gender || '',
      religion: religion || '',
      email: email.toLowerCase(),
      mobile: mobile || '',
      address: address || '',
      course,
      yearLevel: yearLevel || '',
      password,
      agreeTerms: agreeTerms || false
    });

    console.log('Saving student to database...');
    const savedStudent = await student.save();
    console.log('✅ Student saved successfully:', {
      studentNumber: savedStudent.studentNumber,
      email: savedStudent.email,
      fullName: savedStudent.fullName
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        studentNumber: savedStudent.studentNumber,
        name: savedStudent.fullName,
        email: savedStudent.email
      }
    });

  } catch (error) {
    console.error('❌ Registration Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login a student
 * @access  Public
 */
router.post('/login', async (req, res) => {
  console.log('\n=== Login Request ===');
  console.log('Body:', { studentNumber: req.body.studentNumber, password: '***' });
  
  try {
    const { studentNumber, password } = req.body;

    // Validation
    if (!studentNumber || !password) {
      console.log('❌ Missing fields');
      return res.status(400).json({ 
        success: false,
        message: 'Please provide student number and password' 
      });
    }

    // Find student
    console.log('Searching for student:', studentNumber);
    const student = await Student.findOne({ studentNumber });
    
    if (!student) {
      console.log('❌ Student not found');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    console.log('✅ Student found:', student.fullName);

    // Verify password
    console.log('Verifying password...');
    const isMatch = await student.comparePassword(password);
    
    if (!isMatch) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    console.log('✅ Password verified');

    // Generate JWT token
    const token = jwt.sign(
      { studentNumber: student.studentNumber },
      JWT_SECRET,
      { expiresIn: '7d' } // Token valid for 7 days
    );

    console.log('✅ JWT token generated');
    console.log('=== Login Successful ===\n');

    res.json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        studentNumber: student.studentNumber,
        name: student.fullName,
        email: student.email
      }
    });

  } catch (error) {
    console.error('\n❌ Login Error:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('=========================\n');
    
    res.status(500).json({ 
      success: false,
      message: 'Server error during login. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/me
 * @desc    Get current logged-in student info
 * @access  Protected (requires valid JWT token)
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // Student data is already attached by authMiddleware
    res.json({
      success: true,
      data: {
        studentNumber: req.student.studentNumber,
        name: req.student.fullName,
        email: req.student.email,
        createdAt: req.student.createdAt
      }
    });
  } catch (error) {
    console.error('Error in /me route:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

/**
 * @route   GET /api/student/:studentNumber
 * @desc    Get student details
 * @access  Public (should be protected in production)
 */
router.get('/student/:studentNumber', async (req, res) => {
  try {
    const student = await Student.findOne({ 
      studentNumber: req.params.studentNumber 
    }).select('-password');

    if (!student) {
      return res.status(404).json({ 
        success: false,
        message: 'Student not found' 
      });
    }

    res.json({
      success: true,
      data: student
    });

  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

/**
 * @route   GET /api/logs/:studentNumber
 * @desc    Get student activity logs
 * @access  Public (should be protected in production)
 */
router.get('/logs/:studentNumber', async (req, res) => {
  try {
    const logs = await Log.find({ 
      studentNumber: req.params.studentNumber 
    }).sort({ timestamp: -1 }).limit(50);

    res.json({
      success: true,
      data: logs
    });

  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

module.exports = router;
