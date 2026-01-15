const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  studentNumber: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['REGISTRATION', 'LOGIN_SUCCESS', 'LOGIN_FAILED', 'PASSWORD_CHANGE', 'PROFILE_UPDATE']
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  details: {
    type: String
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
});

// Indexes for faster queries
logSchema.index({ studentNumber: 1, timestamp: -1 });
logSchema.index({ action: 1 });
logSchema.index({ timestamp: -1 });

// TTL Index - Auto delete logs older than 90 days (optional)
logSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

module.exports = mongoose.model('Log', logSchema);
