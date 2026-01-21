const Student = require('../models/Student');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

// Register new student
exports.register = async (req, res) => {
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
      confirmPassword,
      agreeTerms
    } = req.body;

    // Validation
    if (!fullName || !email || !course || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (!agreeTerms) {
      return res.status(400).json({ message: 'You must agree to the terms and conditions' });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new student
    const student = await Student.create({
      fullName,
      birthDate: birthDate || null,
      gender: gender || '',
      religion: religion || '',
      email,
      mobile: mobile || '',
      address: address || '',
      course,
      yearLevel: yearLevel || '',
      password,
      agreeTerms
    });

    // Generate token
    const token = generateToken(student._id);

    res.status(201).json({
      message: 'Registration successful',
      token,
      student: {
        id: student._id,
        studentNumber: student.studentNumber,
        fullName: student.fullName,
        email: student.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login student
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find student by email
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(student._id);

    res.json({
      message: 'Login successful',
      token,
      student: {
        id: student._id,
        studentNumber: student.studentNumber,
        fullName: student.fullName,
        email: student.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
