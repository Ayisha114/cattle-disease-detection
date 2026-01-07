const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');
const Report = require('../models/Report');
const User = require('../models/User');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cattle-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, and PNG images are allowed'));
    }
  }
});

// Upload and predict endpoint
router.post('/predict', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }
    
    const imagePath = req.file.path;
    const imageUrl = `${req.protocol}://${req.get('host')}/${imagePath}`;
    
    // Call ML API for prediction
    const ML_API_URL = process.env.ML_API_URL || 'http://your-ml-api-endpoint.com/predict';
    
    let predictionResult;
    
    try {
      // In production, send image to your ML API
      // const FormData = require('form-data');
      // const formData = new FormData();
      // formData.append('image', fs.createReadStream(imagePath));
      // const mlResponse = await axios.post(ML_API_URL, formData, {
      //   headers: formData.getHeaders()
      // });
      // predictionResult = mlResponse.data;
      
      // Mock response for development
      const diseases = ['Lumpy Skin Disease', 'Foot and Mouth Disease', 'Mastitis', 'Bovine Tuberculosis'];
      const stages = ['Early', 'Moderate', 'Severe'];
      const isDiseased = Math.random() > 0.3;
      
      predictionResult = {
        status: isDiseased ? 'Diseased' : 'Healthy',
        disease_name: isDiseased ? diseases[Math.floor(Math.random() * diseases.length)] : 'None',
        stage: isDiseased ? stages[Math.floor(Math.random() * stages.length)] : 'N/A',
        confidence: Math.floor(Math.random() * 30) + 70,
        precautions: isDiseased ? [
          'Isolate the affected cattle immediately',
          'Consult a veterinarian as soon as possible',
          'Ensure proper hygiene and sanitation',
          'Provide nutritious feed and clean water',
          'Monitor other cattle for symptoms'
        ] : ['Maintain regular health checkups', 'Ensure proper nutrition', 'Keep the environment clean']
      };
    } catch (mlError) {
      console.error('ML API Error:', mlError.message);
      // Fallback to mock data if ML API fails
      predictionResult = {
        status: 'Healthy',
        disease_name: 'None',
        stage: 'N/A',
        confidence: 85,
        precautions: ['Maintain regular health checkups', 'Ensure proper nutrition']
      };
    }
    
    // Get user details
    const user = await User.findOne({ user_id: req.user.user_id });
    
    // Save report to database
    const report = await Report.create({
      user_id: req.user.user_id,
      user_name: user.name,
      image_url: imageUrl,
      status: predictionResult.status,
      disease_name: predictionResult.disease_name,
      stage: predictionResult.stage,
      confidence: predictionResult.confidence,
      precautions: predictionResult.precautions
    });
    
    res.json({
      success: true,
      report: {
        report_id: report.report_id,
        status: report.status,
        disease_name: report.disease_name,
        stage: report.stage,
        confidence: report.confidence,
        precautions: report.precautions,
        image_url: imageUrl,
        timestamp: report.timestamp
      }
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;