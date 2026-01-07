# 🐄 Cattle Disease Detection & Health Monitoring System

## Production-Ready Full-Stack AI Application

A comprehensive web application for detecting cattle diseases using Vision Transformer (ViT) AI models, with complete authentication, reporting, and admin dashboard capabilities.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![MongoDB](https://img.shields.io/badge/mongodb-%3E%3D4.0-green.svg)

## ✨ Features

### 🔐 Authentication
- **Google OAuth 2.0** - Seamless login with Google accounts
- **Mobile OTP Authentication** - SMS-based verification for farmers
- **Unique User ID** - Auto-generated UUID for each user
- **JWT Session Management** - Secure token-based authentication
- **Role-Based Access Control** - User and Admin roles

### 🤖 AI Disease Detection
- **Vision Transformer (ViT) Integration** - Connect your trained ML model
- **Real-time Predictions** - Instant disease detection results
- **Confidence Scoring** - AI confidence percentage for each prediction
- **Disease Classification** - Identify disease name and severity stage
- **Smart Recommendations** - AI-generated precautions and treatment advice

### 📊 User Features
- **Personal Dashboard** - Overview of health monitoring activities
- **Image Upload** - Easy cattle image submission with drag-and-drop
- **Report History** - View all past disease detection reports
- **PDF Generation** - Professional downloadable health reports
- **Multi-language Support** - English, Hindi, Telugu, Tamil
- **Voice Output** - Text-to-speech for accessibility
- **Profile Management** - Update preferences and settings

### 👨‍💼 Admin Dashboard
- **User Management** - View and manage all registered users
- **Analytics & Statistics** - Comprehensive health data insights
- **Visual Charts** - Bar charts and pie charts for data visualization
- **Health Status Distribution** - Healthy vs Diseased cattle tracking
- **Disease Category Breakdown** - Track disease prevalence
- **Recent Activity Monitor** - Real-time activity feed
- **Export Capabilities** - Download reports and statistics

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens for session management
- **Multer** - File upload handling
- **PDFKit** - PDF report generation
- **Axios** - HTTP client for ML API calls
- **Bcrypt** - Password hashing

### Frontend
- **Vanilla JavaScript** - No framework dependencies
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Beautiful data visualizations
- **Font Awesome** - Icon library
- **Web Speech API** - Voice output functionality

### ML Integration
- **Vision Transformer (ViT)** - Your trained model
- **REST API** - External ML inference endpoint
- **Image Processing** - JPEG, JPG, PNG support

## 📦 Installation

### Prerequisites
- Node.js >= 14.0.0
- MongoDB >= 4.0
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Ayisha114/cattle-disease-detection.git
cd cattle-disease-detection

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your environment variables
nano .env

# Start MongoDB (if running locally)
mongod

# Run the application
npm start

# For development with auto-reload
npm run dev
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/cattle-detection

# JWT Secrets (Change these!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SESSION_SECRET=your-session-secret-key-change-this-too

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Twilio (Optional - for production OTP)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# ML API Endpoint (Your trained ViT model)
ML_API_URL=http://your-ml-api-endpoint.com/predict
```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

### Twilio Setup (Optional)

1. Sign up at [Twilio](https://www.twilio.com/)
2. Get your Account SID and Auth Token
3. Purchase a phone number
4. Add credentials to `.env`

## 🤖 ML Model Integration

### Your Trained ViT Model

Deploy your Vision Transformer model as a REST API endpoint.

#### API Contract

**Endpoint:** `POST /predict`

**Request:**
```http
POST /predict HTTP/1.1
Content-Type: multipart/form-data

image: <binary file data>
```

**Expected Response:**
```json
{
  "status": "Healthy" | "Diseased",
  "disease_name": "Lumpy Skin Disease",
  "stage": "Early" | "Moderate" | "Severe",
  "confidence": 87.5,
  "precautions": [
    "Isolate the affected cattle immediately",
    "Consult a veterinarian as soon as possible",
    "Ensure proper hygiene and sanitation"
  ]
}
```

### Deployment Options

#### Option 1: Flask API

```python
from flask import Flask, request, jsonify
from transformers import ViTForImageClassification, ViTImageProcessor
from PIL import Image
import torch

app = Flask(__name__)

# Load your trained model
model = ViTForImageClassification.from_pretrained('./your-model-path')
processor = ViTImageProcessor.from_pretrained('./your-model-path')

@app.route('/predict', methods=['POST'])
def predict():
    image_file = request.files['image']
    image = Image.open(image_file)
    
    # Preprocess
    inputs = processor(images=image, return_tensors="pt")
    
    # Predict
    with torch.no_grad():
        outputs = model(**inputs)
        predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
    
    # Get results
    disease_idx = predictions.argmax().item()
    confidence = predictions.max().item() * 100
    
    # Map to disease names (customize based on your model)
    disease_map = {
        0: "Healthy",
        1: "Lumpy Skin Disease",
        2: "Foot and Mouth Disease",
        3: "Mastitis"
    }
    
    disease_name = disease_map.get(disease_idx, "Unknown")
    status = "Healthy" if disease_idx == 0 else "Diseased"
    
    # Determine stage based on confidence
    if confidence > 90:
        stage = "Severe"
    elif confidence > 75:
        stage = "Moderate"
    else:
        stage = "Early"
    
    # Precautions based on disease
    precautions = get_precautions(disease_name)
    
    return jsonify({
        'status': status,
        'disease_name': disease_name,
        'stage': stage if status == "Diseased" else "N/A",
        'confidence': round(confidence, 2),
        'precautions': precautions
    })

def get_precautions(disease_name):
    precautions_map = {
        "Lumpy Skin Disease": [
            "Isolate affected cattle immediately",
            "Consult veterinarian urgently",
            "Vaccinate healthy cattle",
            "Control insect vectors"
        ],
        "Foot and Mouth Disease": [
            "Quarantine infected animals",
            "Disinfect premises thoroughly",
            "Report to authorities",
            "Avoid animal movement"
        ],
        "Healthy": [
            "Maintain regular health checkups",
            "Ensure proper nutrition",
            "Keep environment clean"
        ]
    }
    return precautions_map.get(disease_name, ["Consult veterinarian"])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
```

#### Option 2: FastAPI

```python
from fastapi import FastAPI, File, UploadFile
from transformers import pipeline
from PIL import Image
import io

app = FastAPI()

# Load model
classifier = pipeline("image-classification", model="./your-model-path")

@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    contents = await image.read()
    image_pil = Image.open(io.BytesIO(contents))
    
    results = classifier(image_pil)
    
    return {
        "status": "Diseased" if results[0]['label'] != "Healthy" else "Healthy",
        "disease_name": results[0]['label'],
        "stage": "Moderate",
        "confidence": round(results[0]['score'] * 100, 2),
        "precautions": ["Consult veterinarian", "Isolate cattle"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

#### Option 3: Cloud Deployment
- **AWS SageMaker** - Managed ML inference
- **Google Cloud AI Platform** - Scalable predictions
- **Azure ML** - Enterprise ML deployment
- **Hugging Face Inference API** - Hosted model endpoint

## 📱 API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth flow
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/phone/send-otp` - Send OTP to phone number
- `POST /api/auth/phone/verify-otp` - Verify OTP and login
- `GET /api/auth/me` - Get current user details
- `POST /api/auth/logout` - Logout user

### Upload & Prediction
- `POST /api/upload/predict` - Upload image and get disease prediction

### Reports
- `GET /api/reports` - Get all reports for logged-in user
- `GET /api/reports/:report_id` - Get specific report details
- `GET /api/reports/:report_id/download` - Download PDF report

### Admin (Admin only)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/reports` - Get all reports
- `GET /api/admin/stats` - Get dashboard statistics

## 🗄️ Database Schema

### User Model
```javascript
{
  user_id: String (UUID),
  name: String,
  email: String,
  phone: String,
  email_or_phone: String,
  auth_provider: 'google' | 'phone',
  google_id: String,
  profile_picture: String,
  role: 'user' | 'admin',
  language: String,
  voice_enabled: Boolean,
  created_at: Date
}
```

### Report Model
```javascript
{
  report_id: String (UUID),
  user_id: String,
  user_name: String,
  image_url: String,
  status: 'Healthy' | 'Diseased',
  disease_name: String,
  stage: String,
  confidence: Number,
  precautions: [String],
  timestamp: Date
}
```

## 🚀 Deployment

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add MongoDB plugin
railway add

# Deploy
railway up
```

### Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create cattle-detection-app

# Add MongoDB
heroku addons:create mongolab

# Deploy
git push heroku main
```

### AWS EC2

```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
# ... (MongoDB installation steps)

# Clone and setup
git clone https://github.com/Ayisha114/cattle-disease-detection.git
cd cattle-disease-detection
npm install

# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name cattle-api
pm2 startup
pm2 save
```

## 🔒 Security Features

- ✅ JWT authentication with secure tokens
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ File upload validation and sanitization
- ✅ CORS protection
- ✅ Session management
- ✅ Input validation and sanitization
- ✅ SQL injection prevention (NoSQL)
- ✅ XSS protection

## 📖 Usage Guide

### For Farmers (Users)

1. **Sign Up/Login**
   - Click "Continue with Google" or use mobile number
   - Enter OTP if using phone authentication
   - Complete profile setup

2. **Upload Cattle Image**
   - Navigate to "Upload Image" page
   - Click upload area or drag-and-drop image
   - Supported formats: JPEG, JPG, PNG (max 10MB)
   - Click "Analyze Image"

3. **View Results**
   - See disease detection status (Healthy/Diseased)
   - View disease name and severity stage
   - Check confidence score
   - Read recommended precautions

4. **Download Report**
   - Click "Download PDF" button
   - Save professional health report
   - Share with veterinarian if needed

5. **View History**
   - Go to "My Reports" page
   - Browse all past diagnoses
   - Download any previous report

### For Administrators

1. **Access Dashboard**
   - Login with admin account
   - Click "Admin" in navigation

2. **Monitor Statistics**
   - View total users and reports
   - Check healthy vs diseased distribution
   - Analyze disease category trends

3. **Manage Users**
   - View all registered users
   - Monitor user activity
   - Track report generation

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues, questions, or contributions:
- **GitHub Issues**: [Create an issue](https://github.com/Ayisha114/cattle-disease-detection/issues)
- **Email**: support@example.com
- **Documentation**: [Wiki](https://github.com/Ayisha114/cattle-disease-detection/wiki)

## 🎯 Roadmap

- [ ] Mobile app (React Native/Flutter)
- [ ] Real-time push notifications
- [ ] Veterinarian consultation booking
- [ ] Cattle health tracking timeline
- [ ] Vaccination reminder system
- [ ] Multi-farm management
- [ ] Blockchain for medical records
- [ ] WhatsApp bot integration
- [ ] Offline mode support
- [ ] Advanced analytics dashboard

## 👥 Authors

- **Ayisha D** - [GitHub](https://github.com/Ayisha114)

## 🙏 Acknowledgments

- Vision Transformer (ViT) model architecture
- Open-source community
- Farmers and veterinarians for feedback
- Contributors and testers

---

**Built with ❤️ for farmers and cattle health monitoring**

🐄 Making cattle healthcare accessible through AI technology