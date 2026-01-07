const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
    console.log('📎 File received:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    // Accept all image types
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      // Also check file extension as fallback
      const ext = path.extname(file.originalname).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'].includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'), false);
      }
    }
  }
});

// Upload and predict endpoint (NO AUTHENTICATION REQUIRED)
router.post('/predict', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }
    
    const imagePath = req.file.path;
    const imageUrl = `${req.protocol}://${req.get('host')}/${imagePath}`;
    
    console.log('✅ Image uploaded successfully:', imagePath);
    
    // TODO: Integrate with your trained model
    // For now, using mock predictions
    const diseases = [
      'Lumpy Skin Disease',
      'Foot and Mouth Disease', 
      'Mastitis',
      'Bovine Tuberculosis',
      'Blackleg',
      'Anthrax'
    ];
    
    const stages = ['Early', 'Moderate', 'Severe'];
    const isDiseased = Math.random() > 0.4;
    
    const predictionResult = {
      status: isDiseased ? 'Diseased' : 'Healthy',
      disease_name: isDiseased ? diseases[Math.floor(Math.random() * diseases.length)] : 'None',
      stage: isDiseased ? stages[Math.floor(Math.random() * stages.length)] : 'N/A',
      confidence: Math.floor(Math.random() * 25) + 75, // 75-100%
      precautions: isDiseased ? [
        'Isolate the affected cattle immediately to prevent spread',
        'Consult a licensed veterinarian as soon as possible',
        'Ensure proper hygiene and sanitation in the cattle shed',
        'Provide nutritious feed and clean drinking water',
        'Monitor other cattle in the herd for similar symptoms',
        'Maintain detailed health records for all animals',
        'Follow prescribed medication schedule strictly'
      ] : [
        'Continue regular health checkups and monitoring',
        'Maintain proper nutrition and balanced diet',
        'Ensure clean and hygienic living conditions',
        'Keep vaccination schedule up to date',
        'Provide adequate space and ventilation'
      ]
    };
    
    console.log('🔬 Prediction result:', predictionResult);
    
    res.json({
      success: true,
      report: {
        report_id: 'RPT-' + Date.now(),
        status: predictionResult.status,
        disease_name: predictionResult.disease_name,
        stage: predictionResult.stage,
        confidence: predictionResult.confidence,
        precautions: predictionResult.precautions,
        image_url: imageUrl,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Upload Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;