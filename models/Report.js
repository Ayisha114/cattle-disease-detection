const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const reportSchema = new mongoose.Schema({
  report_id: {
    type: String,
    default: () => uuidv4(),
    unique: true,
    required: true
  },
  user_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  user_name: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Healthy', 'Diseased'],
    required: true
  },
  disease_name: {
    type: String,
    default: 'None'
  },
  stage: {
    type: String,
    default: 'N/A'
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  precautions: {
    type: [String],
    default: []
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

reportSchema.index({ user_id: 1, timestamp: -1 });

module.exports = mongoose.model('Report', reportSchema);