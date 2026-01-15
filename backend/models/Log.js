const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  studentNumber: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  details: {
    type: String
  }
});

// Index for faster queries
logSchema.index({ studentNumber: 1, timestamp: -1 });

module.exports = mongoose.model('Log', logSchema);
