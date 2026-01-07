# 🐄 Cattle Disease Detection & Health Monitoring System

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![MongoDB](https://img.shields.io/badge/mongodb-%3E%3D4.0-green.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)

**Production-Ready AI-Powered Cattle Disease Detection System**

[Quick Start](QUICKSTART.md) • [Documentation](#-features) • [Deployment](DEPLOYMENT.md) • [ML Integration](ML_INTEGRATION.md) • [Contributing](CONTRIBUTING.md)

</div>

---

## 📖 Overview

A comprehensive web application for detecting cattle diseases using Vision Transformer (ViT) AI models, with complete authentication, reporting, and admin dashboard capabilities. Built to help farmers detect diseases early and take preventive action.

### 🎯 Key Highlights

- 🤖 **AI-Powered Detection** - Vision Transformer model integration
- 🔐 **Secure Authentication** - Google OAuth & Mobile OTP
- 📊 **Admin Dashboard** - Analytics with beautiful charts
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 📄 **PDF Reports** - Professional downloadable reports
- 🌍 **Multi-language** - English, Hindi, Telugu, Tamil
- 🔊 **Voice Output** - Accessibility features
- 🚀 **Production Ready** - Enterprise-grade architecture

---

## ✨ Features

### 🔐 Authentication System
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

---

## 🛠️ Tech Stack

<div align="center">

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

### Frontend
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

### ML Integration
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)
![Transformers](https://img.shields.io/badge/🤗_Transformers-FFD21E?style=for-the-badge)

</div>

---

## 📦 Quick Installation

### Prerequisites
- Node.js >= 14.0.0
- MongoDB >= 4.0
- npm or yarn

### Setup in 3 Steps

```bash
# 1. Clone the repository
git clone https://github.com/Ayisha114/cattle-disease-detection.git
cd cattle-disease-detection

# 2. Install dependencies & configure
npm install
cp .env.example .env
# Edit .env with your settings

# 3. Start the application
npm start
```

**That's it!** Open http://localhost:5000 🎉

For detailed setup instructions, see [QUICKSTART.md](QUICKSTART.md)

---

## 🔧 Configuration

Create a `.env` file:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/cattle-detection

# JWT Secrets (Change these!)
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-session-secret

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ML API (Your trained model)
ML_API_URL=http://your-ml-api-endpoint.com/predict
```

---

## 🤖 ML Model Integration

### Quick Start with Mock Data

The application works out-of-the-box with mock predictions for testing. No ML model required initially!

### Integrate Your Trained ViT Model

**Step 1:** Deploy your model as a REST API

```python
from flask import Flask, request, jsonify
from transformers import ViTForImageClassification
from PIL import Image

app = Flask(__name__)
model = ViTForImageClassification.from_pretrained('./your-model')

@app.route('/predict', methods=['POST'])
def predict():
    image = Image.open(request.files['image'])
    # Your prediction logic
    return jsonify({
        'status': 'Diseased',
        'disease_name': 'Lumpy Skin Disease',
        'stage': 'Moderate',
        'confidence': 87.5,
        'precautions': ['Isolate cattle', 'Call vet']
    })

app.run(port=8000)
```

**Step 2:** Update `.env`

```env
ML_API_URL=http://localhost:8000/predict
```

For complete ML integration guide, see [ML_INTEGRATION.md](ML_INTEGRATION.md)

---

## 📱 API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth
- `POST /api/auth/phone/send-otp` - Send OTP
- `POST /api/auth/phone/verify-otp` - Verify OTP
- `GET /api/auth/me` - Get current user

### Upload & Prediction
- `POST /api/upload/predict` - Upload image and get prediction

### Reports
- `GET /api/reports` - Get user reports
- `GET /api/reports/:id` - Get specific report
- `GET /api/reports/:id/download` - Download PDF

### Admin (Admin only)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get dashboard statistics

---

## 🗄️ Database Schema

### User Model
```javascript
{
  user_id: String (UUID),
  name: String,
  email_or_phone: String,
  auth_provider: 'google' | 'phone',
  role: 'user' | 'admin',
  created_at: Date
}
```

### Report Model
```javascript
{
  report_id: String (UUID),
  user_id: String,
  status: 'Healthy' | 'Diseased',
  disease_name: String,
  stage: String,
  confidence: Number,
  precautions: [String],
  timestamp: Date
}
```

---

## 🚀 Deployment

### Railway (Recommended - Easiest)

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Heroku

```bash
heroku create cattle-detection-app
heroku addons:create mongolab
git push heroku main
```

### AWS EC2

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide.

---

## 📸 Screenshots

<div align="center">

### Login Page
![Login](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Login+Page)

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/10b981/ffffff?text=User+Dashboard)

### Image Upload
![Upload](https://via.placeholder.com/800x400/f59e0b/ffffff?text=Image+Upload)

### Admin Dashboard
![Admin](https://via.placeholder.com/800x400/8b5cf6/ffffff?text=Admin+Dashboard)

</div>

---

## 🔒 Security Features

- ✅ JWT authentication with secure tokens
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ File upload validation and sanitization
- ✅ CORS protection
- ✅ Session management
- ✅ Input validation
- ✅ XSS protection

---

## 📖 Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Get started in 5 minutes
- **[Deployment Guide](DEPLOYMENT.md)** - Deploy to production
- **[ML Integration](ML_INTEGRATION.md)** - Connect your model
- **[Architecture](ARCHITECTURE.md)** - System design
- **[Contributing](CONTRIBUTING.md)** - Contribution guidelines
- **[Project Summary](PROJECT_SUMMARY.md)** - Complete overview

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

- **Documentation**: Check the docs folder
- **Issues**: [Create an issue](https://github.com/Ayisha114/cattle-disease-detection/issues)
- **Discussions**: [Join discussion](https://github.com/Ayisha114/cattle-disease-detection/discussions)

---

## 🎯 Roadmap

- [ ] Mobile app (React Native/Flutter)
- [ ] Real-time notifications
- [ ] Veterinarian consultation
- [ ] Cattle health tracking
- [ ] Vaccination reminders
- [ ] Multi-farm management
- [ ] WhatsApp bot integration
- [ ] Offline mode support
- [ ] Blockchain for records

---

## 👥 Authors

- **Ayisha D** - [GitHub](https://github.com/Ayisha114)

---

## 🙏 Acknowledgments

- Vision Transformer (ViT) model architecture
- Open-source community
- Farmers and veterinarians for feedback
- All contributors

---

## ⭐ Star History

If you find this project useful, please consider giving it a star! ⭐

---

<div align="center">

**Built with ❤️ for farmers and cattle health monitoring**

🐄 Making cattle healthcare accessible through AI technology

[⬆ Back to Top](#-cattle-disease-detection--health-monitoring-system)

</div>