const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const Student = require('../models/Student');
const Log = require('../models/Log');
const { sendRegistrationEmail } = require('../utils/emailService');
const { generateStudentNumber } = require('../utils/passwordGenerator');

/**
 * @route   POST /api/register
 * @desc    Register a new student
 * @access  Public
 */
router.post('/register', async (req, res) => {
  console.log('\n=== Registration Request ===');
  console.log('Body:', { name: req.body.name, email: req.body.email, password: '***' });
  
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
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
    const newStudent = new Student({
      studentNumber,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    console.log('Saving to database...');
    await newStudent.save();
    console.log('✅ Student saved to database');

    // Log registration
    try {
      await Log.create({
        studentNumber,
        action: 'REGISTRATION',
        details: `New student registered: ${name}`
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
        email: newStudent.email,
        name: newStudent.name,
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
        name: newStudent.name,
        email: newStudent.email
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
  try {
    const { studentNumber, password } = req.body;

    // Validation
    if (!studentNumber || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide student number and password' 
      });
    }

    // Find student
    const student = await Student.findOne({ studentNumber });
    if (!student) {
      // Log failed attempt
      await Log.create({
        studentNumber,
        action: 'LOGIN_FAILED',
        details: 'Invalid student number'
      });
      
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      // Log failed attempt
      await Log.create({
        studentNumber,
        action: 'LOGIN_FAILED',
        details: 'Invalid password'
      });
      
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Log successful login
    await Log.create({
      studentNumber,
      action: 'LOGIN_SUCCESS',
      details: 'Student logged in successfully'
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        studentNumber: student.studentNumber,
        name: student.name,
        email: student.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login. Please try again later.' 
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
