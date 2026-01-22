const mongoose = require('mongoose');

// Use student_portal connection
const studentPortalConnection = mongoose.createConnection(process.env.MONGO_URI_STUDENT_PORTAL);

const adminSchema = new mongoose.Schema({
    // ...existing code...
});

module.exports = studentPortalConnection.model('Admin', adminSchema);