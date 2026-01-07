# ML Model Integration Guide

## 🤖 Integrating Your Trained Vision Transformer Model

This guide helps you connect your trained ViT model to the application.

---

## 📋 Prerequisites

- Trained Vision Transformer (ViT) model
- Python 3.8+
- Basic understanding of REST APIs

---

## 🔧 Option 1: Flask API (Recommended)

### Step 1: Create Flask Application

Create a new directory for your ML API:

```bash
mkdir cattle-ml-api
cd cattle-ml-api
```

### Step 2: Install Dependencies

Create `requirements.txt`:

```txt
flask==2.3.0
flask-cors==4.0.0
transformers==4.30.0
torch==2.0.0
pillow==9.5.0
numpy==1.24.0
```

Install:
```bash
pip install -r requirements.txt
```

### Step 3: Create API Server

Create `app.py`:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import ViTForImageClassification, ViTImageProcessor
from PIL import Image
import torch
import io

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load your trained model
MODEL_PATH = './your-trained-model'  # Update this path
model = ViTForImageClassification.from_pretrained(MODEL_PATH)
processor = ViTImageProcessor.from_pretrained(MODEL_PATH)

# Disease mapping (customize based on your model)
DISEASE_MAP = {
    0: "Healthy",
    1: "Lumpy Skin Disease",
    2: "Foot and Mouth Disease",
    3: "Mastitis",
    4: "Bovine Tuberculosis",
    5: "Blackleg",
    6: "Anthrax"
}

# Precautions mapping
PRECAUTIONS_MAP = {
    "Healthy": [
        "Maintain regular health checkups",
        "Ensure proper nutrition and clean water",
        "Keep the environment clean and hygienic",
        "Follow vaccination schedule"
    ],
    "Lumpy Skin Disease": [
        "Isolate affected cattle immediately",
        "Consult veterinarian urgently",
        "Vaccinate healthy cattle in the herd",
        "Control insect vectors (flies, mosquitoes)",
        "Disinfect premises thoroughly"
    ],
    "Foot and Mouth Disease": [
        "Quarantine infected animals immediately",
        "Report to local veterinary authorities",
        "Disinfect all equipment and premises",
        "Avoid animal movement",
        "Vaccinate susceptible animals"
    ],
    "Mastitis": [
        "Isolate affected cattle",
        "Consult veterinarian for antibiotic treatment",
        "Improve milking hygiene",
        "Disinfect milking equipment",
        "Monitor udder health regularly"
    ],
    "Bovine Tuberculosis": [
        "Isolate suspected animals immediately",
        "Conduct tuberculin testing",
        "Consult veterinarian for treatment plan",
        "Improve ventilation in housing",
        "Follow biosecurity measures"
    ],
    "Blackleg": [
        "Isolate affected cattle",
        "Administer antibiotics immediately",
        "Vaccinate all susceptible cattle",
        "Dispose of carcasses properly",
        "Disinfect contaminated areas"
    ],
    "Anthrax": [
        "DO NOT open carcass - highly contagious",
        "Report to authorities immediately",
        "Quarantine entire herd",
        "Vaccinate all animals",
        "Burn or bury carcasses deeply"
    ]
}

def determine_stage(confidence):
    """Determine disease stage based on confidence score"""
    if confidence >= 90:
        return "Severe"
    elif confidence >= 75:
        return "Moderate"
    else:
        return "Early"

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'OK',
        'message': 'Cattle Disease Detection ML API is running',
        'model_loaded': model is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Check if image is in request
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        # Get image file
        image_file = request.files['image']
        
        # Open and process image
        image = Image.open(io.BytesIO(image_file.read()))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Preprocess image
        inputs = processor(images=image, return_tensors="pt")
        
        # Make prediction
        with torch.no_grad():
            outputs = model(**inputs)
            predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
        
        # Get predicted class and confidence
        predicted_class = predictions.argmax().item()
        confidence = predictions.max().item() * 100
        
        # Map to disease name
        disease_name = DISEASE_MAP.get(predicted_class, "Unknown")
        
        # Determine status
        status = "Healthy" if predicted_class == 0 else "Diseased"
        
        # Determine stage
        stage = "N/A" if status == "Healthy" else determine_stage(confidence)
        
        # Get precautions
        precautions = PRECAUTIONS_MAP.get(disease_name, ["Consult a veterinarian"])
        
        # Return prediction
        return jsonify({
            'status': status,
            'disease_name': disease_name,
            'stage': stage,
            'confidence': round(confidence, 2),
            'precautions': precautions
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=False)
```

### Step 4: Run the API

```bash
python app.py
```

Your ML API will be available at `http://localhost:8000`

### Step 5: Test the API

```bash
curl -X POST -F "image=@test_cattle.jpg" http://localhost:8000/predict
```

### Step 6: Update Main Application

In your main application's `.env` file:

```env
ML_API_URL=http://localhost:8000/predict
```

For production, deploy your ML API and update the URL accordingly.

---

## 🚀 Option 2: FastAPI (Modern Alternative)

### Create `main.py`:

```python
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
from PIL import Image
import io

app = FastAPI(title="Cattle Disease Detection API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
classifier = pipeline("image-classification", model="./your-model-path")

@app.get("/health")
def health_check():
    return {"status": "OK", "message": "API is running"}

@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    try:
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

Run:
```bash
pip install fastapi uvicorn python-multipart
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## ☁️ Option 3: Deploy ML API to Cloud

### Railway Deployment

1. Create `Procfile`:
```
web: python app.py
```

2. Deploy:
```bash
railway init
railway up
```

3. Get URL and update `.env`:
```env
ML_API_URL=https://your-ml-api.railway.app/predict
```

### Heroku Deployment

1. Create `Procfile`:
```
web: gunicorn app:app
```

2. Deploy:
```bash
heroku create cattle-ml-api
git push heroku main
```

### AWS Lambda + API Gateway

Use AWS SAM or Serverless Framework for serverless deployment.

---

## 🧪 Testing Your Integration

### Test Script

Create `test_ml_api.py`:

```python
import requests

# Test health endpoint
response = requests.get('http://localhost:8000/health')
print("Health Check:", response.json())

# Test prediction
with open('test_cattle.jpg', 'rb') as f:
    files = {'image': f}
    response = requests.post('http://localhost:8000/predict', files=files)
    print("Prediction:", response.json())
```

Run:
```bash
python test_ml_api.py
```

---

## 📊 Model Performance Optimization

### 1. Model Quantization

```python
import torch

# Quantize model for faster inference
model = torch.quantization.quantize_dynamic(
    model, {torch.nn.Linear}, dtype=torch.qint8
)
```

### 2. Batch Processing

```python
# Process multiple images at once
inputs = processor(images=[image1, image2, image3], return_tensors="pt")
```

### 3. GPU Acceleration

```python
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)
```

---

## 🔒 Security Best Practices

1. **API Key Authentication**

```python
from functools import wraps
from flask import request

def require_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')
        if api_key != 'your-secret-api-key':
            return jsonify({'error': 'Invalid API key'}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/predict', methods=['POST'])
@require_api_key
def predict():
    # ... prediction code
```

2. **Rate Limiting**

```python
from flask_limiter import Limiter

limiter = Limiter(app, key_func=lambda: request.remote_addr)

@app.route('/predict', methods=['POST'])
@limiter.limit("10 per minute")
def predict():
    # ... prediction code
```

---

## 📈 Monitoring & Logging

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    logger.info(f"Prediction request from {request.remote_addr}")
    # ... prediction code
    logger.info(f"Prediction result: {disease_name} ({confidence}%)")
```

---

## 🆘 Troubleshooting

### Common Issues

1. **Model Loading Error**
   - Check model path
   - Ensure all model files are present
   - Verify transformers version compatibility

2. **Memory Issues**
   - Use model quantization
   - Reduce batch size
   - Use CPU instead of GPU for small models

3. **Slow Predictions**
   - Enable GPU if available
   - Use model quantization
   - Implement caching

---

## 📞 Support

For ML integration issues:
- Check model compatibility
- Verify API endpoint connectivity
- Review logs for errors
- GitHub Issues: [Create Issue](https://github.com/Ayisha114/cattle-disease-detection/issues)

---

**Happy Integrating! 🤖**