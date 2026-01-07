# 🐄 CattleAI - Model Integration Guide

## 📋 Overview

This guide explains how to integrate your trained Vision Transformer model with the CattleAI web application.

## 📁 Your Model Files

You have three important files:
- `cattle_disease_vit_model.pth` (3.35 MB) - Your trained model
- `class_names.json` - Disease class names
- `model_config.json` - Model configuration

## 🚀 Deployment Options

### Option 1: Deploy ML API on Railway (Recommended)

1. **Upload your model files to the `ml_api` folder:**
   ```
   ml_api/
   ├── app.py
   ├── requirements.txt
   ├── cattle_disease_vit_model.pth  ← Upload this
   ├── class_names.json              ← Upload this
   └── model_config.json             ← Upload this
   ```

2. **Create a new Railway service for ML API:**
   - Go to Railway dashboard
   - Click "+ New" → "Empty Service"
   - Connect to your GitHub repo
   - Set root directory to `ml_api`
   - Railway will auto-detect Python and deploy

3. **Get the ML API URL:**
   - After deployment, generate domain for ML service
   - Copy the URL (e.g., `https://ml-api-production.up.railway.app`)

4. **Update the main app environment variable:**
   - Go to your main web service
   - Add variable: `ML_API_URL=https://your-ml-api-url.up.railway.app`
   - Redeploy

### Option 2: Deploy ML API on Hugging Face Spaces

1. **Create a new Space:**
   - Go to https://huggingface.co/spaces
   - Click "Create new Space"
   - Choose "Gradio" or "Streamlit"
   - Upload your files

2. **Use the Space API URL in your app**

### Option 3: Local Testing

1. **Install dependencies:**
   ```bash
   cd ml_api
   pip install -r requirements.txt
   ```

2. **Place your model files in `ml_api` folder**

3. **Run the API:**
   ```bash
   python app.py
   ```

4. **Test the API:**
   ```bash
   curl http://localhost:8000/health
   ```

5. **Update your main app:**
   - Set `ML_API_URL=http://localhost:8000` in `.env`

## 🔧 Model Integration Code

The Flask API (`ml_api/app.py`) already includes:
- ✅ Model loading from `.pth` file
- ✅ Image preprocessing
- ✅ Prediction endpoint
- ✅ Disease information database
- ✅ Confidence scoring
- ✅ Stage detection

## 📊 Expected Response Format

```json
{
  "success": true,
  "prediction": {
    "disease_name": "Lumpy Skin Disease",
    "confidence": 95.67,
    "stage": "Moderate",
    "severity": "High",
    "status": "Diseased",
    "precautions": [
      "Isolate infected cattle immediately",
      "Vaccinate all healthy cattle",
      "..."
    ]
  }
}
```

## 🎨 New UI Features

The updated UI includes:
- ✨ Modern dark theme with animated background
- 🎯 Professional gradient design
- 📊 Real-time statistics display
- 🖼️ Beautiful image preview with overlay controls
- ⚡ Smooth animations and transitions
- 📱 Fully responsive mobile design
- 🎨 Glassmorphism effects
- 💫 Loading animations with dual spinners

## 🔄 Update Upload Route

Update `routes/upload-no-auth.js` to call your ML API:

```javascript
// Replace mock prediction with real API call
const response = await fetch(process.env.ML_API_URL + '/predict', {
  method: 'POST',
  body: formData
});

const mlResult = await response.json();
```

## 🧪 Testing

1. **Test ML API health:**
   ```bash
   curl https://your-ml-api-url/health
   ```

2. **Test prediction:**
   ```bash
   curl -X POST -F "image=@test_cattle.jpg" https://your-ml-api-url/predict
   ```

3. **Test full integration:**
   - Upload image through web UI
   - Check browser console for API calls
   - Verify results display correctly

## 📝 Notes

- The ML API uses CPU by default (Railway free tier)
- For GPU inference, upgrade to Railway Pro
- Model file must be < 50MB for Railway
- Consider model quantization if file is too large

## 🆘 Troubleshooting

**Model not loading:**
- Check file paths are correct
- Verify model file is in `ml_api` folder
- Check Railway logs for errors

**Slow predictions:**
- CPU inference takes 2-5 seconds
- Consider model optimization
- Use GPU for faster inference

**Out of memory:**
- Reduce batch size
- Use model quantization
- Upgrade Railway plan

## 🎯 Next Steps

1. Upload your 3 model files to `ml_api` folder
2. Deploy ML API to Railway
3. Update `ML_API_URL` environment variable
4. Test the integration
5. Enjoy your AI-powered cattle disease detection! 🎉