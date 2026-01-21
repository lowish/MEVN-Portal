const Student = require('../models/Student');

// Get current student profile
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id).select('-password');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      studentNumber: student.studentNumber,
      fullName: student.fullName,
      email: student.email,
      birthDate: student.birthDate,
      gender: student.gender,
      religion: student.religion,
      mobile: student.mobile,
      address: student.address,
      course: student.course,
      yearLevel: student.yearLevel,
      createdAt: student.createdAt
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};
