const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth');

// GET /api/student/profile - Protected route
router.get('/profile', auth, studentController.getProfile);

module.exports = router;
