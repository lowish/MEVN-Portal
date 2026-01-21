const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Student = require('../models/Student');
const Log = require('../models/Log');
const { sendRegistrationEmail } = require('../utils/emailService');
const { generateStudentNumber } = require('../utils/passwordGenerator');

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
 * @route   POST /api/register
 * @desc    Register a new student
 * @access  Public
 */
router.post('/register', async (req, res) => {
  console.log('\n=== Registration Request ===');
  console.log('Body:', { name: req.body.name, email: req.body.email, password: '***' });
  
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
      password
    } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields (name, email, password)' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format');
      return res.status(400).json({ 
        success: false,
        message: 'Please provide a valid email address' 
      });
    }

    // Password validation
    if (password.length < 6) {
      console.log('❌ Password too short');
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Check if email already exists
    console.log('Checking if email exists...');
    const existingStudent = await Student.findOne({ email: email.toLowerCase() });
    if (existingStudent) {
      console.log('❌ Email already exists');
      return res.status(400).json({ 
        success: false,
        message: 'Email address is already registered' 
      });
    }

    // Generate unique student number
    console.log('Generating student number...');
    const studentNumber = await generateStudentNumber(Student);
    console.log('✅ Generated student number:', studentNumber);

    // Hash password
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('✅ Password hashed');

    // Create new student
    console.log('Creating student document...');
    const student = new Student({
      fullName,
      birthDate: birthDate || null,
      gender: gender || '',
      religion: religion || '',
      email,
      mobile: mobile || '',
      address: address || '',
      course,
      yearLevel: yearLevel || '',
      password: hashedPassword
    });

    console.log('Saving to database...');
    await student.save();
    console.log('✅ Student saved to database');

    // Log registration
    try {
      await Log.create({
        studentNumber,
        action: 'REGISTRATION',
        details: `New student registered: ${fullName}`
      });
      console.log('✅ Log created');
    } catch (logError) {
      console.error('⚠️ Failed to create log:', logError.message);
    }

    // Send email with credentials
    let emailSent = false;
    try {
      console.log('Attempting to send email...');
      emailSent = await sendRegistrationEmail({
        email: student.email,
        name: student.fullName,
        studentNumber
      });
      
      if (emailSent) {
        console.log(`✅ Registration email sent to: ${email}`);
      } else {
        console.log(`⚠️ Email not sent (email service not configured)`);
      }
    } catch (emailError) {
      console.error('⚠️ Email sending failed:', emailError.message);
    }

    console.log('=== Registration Successful ===\n');

    // Return success response
    res.status(201).json({
      success: true,
      message: emailSent 
        ? 'Registration successful! Check your email for confirmation.' 
        : 'Registration successful! You can now login.',
      data: {
        studentNumber,
        name: student.fullName,
        email: student.email
      }
    });

  } catch (error) {
    console.error('\n❌ Registration Error:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('=========================\n');
    
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/login
 * @desc    Login a student
 * @access  Public
 */
router.post('/login', async (req, res) => {
  console.log('\n=== Login Request ===');
  console.log('Body:', { studentNumber: req.body.studentNumber, password: '***' });
  
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log('❌ Missing fields');
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email and password' 
      });
    }

    // Find student
    console.log('Searching for student:', email);
    const student = await Student.findOne({ email });
    
    if (!student) {
      console.log('❌ Student not found in database');
      
      // Log failed attempt
      await Log.create({
        studentNumber: email,
        action: 'LOGIN_FAILED',
        details: 'Invalid email'
      });
      
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    console.log('✅ Student found:', student.fullName);
    console.log('Stored password hash:', student.password.substring(0, 20) + '...');

    // Verify password
    console.log('Verifying password...');
    const isMatch = await bcrypt.compare(password, student.password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password does not match');
      
      // Log failed attempt
      await Log.create({
        studentNumber: email,
        action: 'LOGIN_FAILED',
        details: 'Invalid password'
      });
      
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

    // Log successful login
    await Log.create({
      studentNumber: email,
      action: 'LOGIN_SUCCESS',
      details: 'Student logged in successfully'
    });

    console.log('=== Login Successful ===\n');

    res.json({
      success: true,
      message: 'Login successful',
      token, // Send token to frontend
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
      message: 'Server error during login. Please try again later.' 
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
