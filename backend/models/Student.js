const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the student schema
const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  birthDate: { type: Date },
  gender: { type: String },
  religion: { type: String },
  email: { type: String, required: true, unique: true },
  mobile: { type: String },
  address: { type: String },
  course: { type: String, required: true },
  yearLevel: { type: String },
  password: { type: String, required: true },
  studentNumber: { type: String, unique: true }
}, { 
  collection: 'registration',
  timestamps: true 
});

// Generate student number before saving
studentSchema.pre('save', async function() {
  if (this.isNew && !this.studentNumber) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments();
    const sequence = String(count + 1).padStart(5, '0');
    this.studentNumber = `${year}-${sequence}`;
  }
  
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// Compare password method
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;