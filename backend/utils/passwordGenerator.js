const crypto = require('crypto');

/**
 * Generate a secure random temporary password
 * @returns {string} Random password
 */
const generateTemporaryPassword = () => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset[randomIndex];
  }
  
  return password;
};

/**
 * Generate unique student number
 * Format: YYYY + 5-digit sequence (e.g., 20260000001)
 * @param {Model} Student - Mongoose Student model
 * @returns {Promise<string>} Student number
 */
const generateStudentNumber = async (Student) => {
  const currentYear = new Date().getFullYear();
  const prefix = currentYear.toString();
  
  // Find the last student number for this year
  const lastStudent = await Student.findOne({
    studentNumber: new RegExp(`^${prefix}`)
  }).sort({ studentNumber: -1 });
  
  let sequence = 1;
  if (lastStudent) {
    const lastSequence = parseInt(lastStudent.studentNumber.slice(-5));
    sequence = lastSequence + 1;
  }
  
  // Format: YYYY + 5-digit sequence
  const studentNumber = `${prefix}${sequence.toString().padStart(5, '0')}`;
  return studentNumber;
};

module.exports = { 
  generateTemporaryPassword, 
  generateStudentNumber 
};
