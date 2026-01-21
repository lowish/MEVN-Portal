const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  // Auto-generated
  studentNumber: {
    type: String,
    unique: true
  },
  
  // Personal Information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  birthDate: {
    type: Date,
    default: null
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say', ''],
    default: ''
  },
  religion: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Contact Information
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  mobile: {
    type: String,
    trim: true,
    default: ''
  },
  address: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Academic Information
  course: {
    type: String,
    required: [true, 'Course is required'],
    trim: true
  },
  yearLevel: {
    type: String,
    default: ''
  },
  
  // Security
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  agreeTerms: {
    type: Boolean,
    required: [true, 'You must agree to the terms'],
    default: false
  }
}, {
  timestamps: true
});

// Generate student number before saving
studentSchema.pre('save', async function(next) {
  // Generate student number only for new documents
  if (this.isNew) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Student').countDocuments();
    const sequence = String(count + 1).padStart(5, '0');
    this.studentNumber = `${year}-${sequence}`;
  }
  
  // Hash password if modified
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  next();
});

// Compare password method
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);