# 🚀 Quick Start Guide

Get your Cattle Disease Detection system running in 5 minutes!

---

## ⚡ Prerequisites

- Node.js 14+ installed
- MongoDB installed (or MongoDB Atlas account)
- Git installed

---

## 📥 Step 1: Clone Repository

```bash
git clone https://github.com/Ayisha114/cattle-disease-detection.git
cd cattle-disease-detection
```

---

## 📦 Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including Express, MongoDB, Passport, etc.

---

## ⚙️ Step 3: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` file with your settings:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cattle-detection
JWT_SECRET=my-super-secret-key-12345
SESSION_SECRET=my-session-secret-67890
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
ML_API_URL=http://localhost:8000/predict
```

**Quick Setup (Development):**
- Keep default `MONGODB_URI` if MongoDB is running locally
- Generate random secrets for JWT_SECRET and SESSION_SECRET
- Google OAuth is optional for development (use phone OTP instead)
- ML_API_URL can point to mock endpoint initially

---

## 🗄️ Step 4: Start MongoDB

### Option A: Local MongoDB
```bash
# Start MongoDB service
sudo systemctl start mongod

# Or on macOS
brew services start mongodb-community
```

### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

---

## 🚀 Step 5: Start Application

```bash
npm start
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
🌐 Environment: development
📡 API available at: http://localhost:5000/api
```

---

## 🌐 Step 6: Access Application

Open your browser and go to:
```
http://localhost:5000
```

You should see the login page!

---

## 👤 Step 7: Create First User

### Using Phone OTP (Easiest for Development)

1. Click "Send OTP"
2. Enter any 10-digit number (e.g., 9876543210)
3. Check console for OTP (displayed in terminal)
4. Enter your name and the OTP
5. Click "Verify OTP"

**Note:** In development mode, OTP is displayed in the console. In production, integrate Twilio for real SMS.

### Using Google OAuth

1. Set up Google OAuth credentials (see below)
2. Click "Continue with Google"
3. Authorize the application

---

## 🔐 Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Secret to `.env`

---

## 🤖 ML Model Integration (Optional)

The app works with mock predictions initially. To integrate your trained model:

### Quick Mock Setup (Already Working)
The application includes mock predictions for development. You can test all features without a real ML model.

### Real Model Integration
See [ML_INTEGRATION.md](ML_INTEGRATION.md) for detailed instructions.

**Quick Flask API:**

1. Create `ml-api/app.py` with your model
2. Run: `python app.py`
3. Update `.env`: `ML_API_URL=http://localhost:8000/predict`

---

## ✅ Verify Installation

### Test API Health
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Cattle Disease Detection API is running",
  "timestamp": "2026-01-07T..."
}
```

### Test Upload (After Login)
1. Login to the application
2. Go to "Upload Image" page
3. Upload a cattle image
4. See prediction results (mock data initially)

---

## 📱 Features to Test

1. **Authentication**
   - ✅ Phone OTP login
   - ✅ Google OAuth (if configured)

2. **Image Upload**
   - ✅ Upload cattle image
   - ✅ View AI prediction
   - ✅ See confidence score
   - ✅ Read precautions

3. **Reports**
   - ✅ View all past reports
   - ✅ Download PDF reports

4. **Profile**
   - ✅ View user details
   - ✅ Change language
   - ✅ Toggle voice output

5. **Admin Dashboard** (Create admin user)
   - ✅ View statistics
   - ✅ See charts
   - ✅ Monitor activity

---

## 👨‍💼 Create Admin User

To access admin dashboard, manually update a user in MongoDB:

```bash
# Connect to MongoDB
mongosh

# Use database
use cattle-detection

# Update user to admin
db.users.updateOne(
  { email_or_phone: "your-phone-or-email" },
  { $set: { role: "admin" } }
)
```

Now login with that user to see the Admin link in navigation.

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

### Port Already in Use
```bash
# Change PORT in .env to different number
PORT=3000
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Cannot Upload Images
```bash
# Create uploads directory
mkdir uploads
```

---

## 📚 Next Steps

1. **Deploy to Production**
   - See [DEPLOYMENT.md](DEPLOYMENT.md)

2. **Integrate Real ML Model**
   - See [ML_INTEGRATION.md](ML_INTEGRATION.md)

3. **Customize Application**
   - Modify disease categories
   - Add more languages
   - Customize UI colors

4. **Add Features**
   - Email notifications
   - WhatsApp integration
   - Mobile app

---

## 🆘 Need Help?

- **Documentation:** [README.md](README.md)
- **Deployment:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **ML Integration:** [ML_INTEGRATION.md](ML_INTEGRATION.md)
- **Issues:** [GitHub Issues](https://github.com/Ayisha114/cattle-disease-detection/issues)

---

## 🎉 Success!

If you can:
- ✅ Login with phone OTP
- ✅ Upload an image
- ✅ See prediction results
- ✅ Download PDF report

**Congratulations! Your system is working!** 🎊

---

## 📞 Support

Having issues? Create an issue on GitHub or check the documentation.

**Happy Coding! 🚀**