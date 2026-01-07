from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import json
import io
import os

app = Flask(__name__)
CORS(app)

# Load class names and config
with open('class_names.json', 'r') as f:
    class_names = json.load(f)

with open('model_config.json', 'r') as f:
    config = json.load(f)

# Load the trained model
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = torch.load('cattle_disease_vit_model.pth', map_location=device)
model.eval()

# Image preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Disease information database
DISEASE_INFO = {
    'Lumpy Skin Disease': {
        'precautions': [
            'Isolate infected cattle immediately to prevent spread',
            'Vaccinate all healthy cattle in the herd',
            'Control insect vectors (flies, mosquitoes, ticks)',
            'Consult veterinarian for antiviral treatment',
            'Maintain strict biosecurity measures',
            'Disinfect equipment and facilities regularly',
            'Monitor body temperature daily'
        ],
        'severity': 'High'
    },
    'Foot and Mouth Disease': {
        'precautions': [
            'Quarantine affected animals immediately',
            'Report to veterinary authorities',
            'Vaccinate entire herd',
            'Disinfect all equipment and facilities',
            'Restrict animal movement',
            'Provide soft feed and clean water',
            'Apply antiseptic to lesions'
        ],
        'severity': 'Very High'
    },
    'Mastitis': {
        'precautions': [
            'Maintain strict milking hygiene',
            'Administer prescribed antibiotics',
            'Apply warm compresses to udder',
            'Milk affected quarters frequently',
            'Discard milk from infected quarters',
            'Keep bedding clean and dry',
            'Monitor udder temperature regularly'
        ],
        'severity': 'Moderate'
    },
    'Healthy': {
        'precautions': [
            'Continue regular health monitoring',
            'Maintain balanced nutrition and diet',
            'Ensure clean water supply',
            'Keep vaccination schedule updated',
            'Provide adequate shelter and space',
            'Regular deworming as per schedule',
            'Monitor for any behavioral changes'
        ],
        'severity': 'None'
    }
}

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'OK',
        'message': 'ML API is running',
        'device': str(device),
        'model_loaded': True,
        'classes': len(class_names)
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        file = request.files['image']
        
        # Read and preprocess image
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        image_tensor = transform(image).unsqueeze(0).to(device)
        
        # Make prediction
        with torch.no_grad():
            outputs = model(image_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            confidence, predicted = torch.max(probabilities, 1)
            
            predicted_class = class_names[predicted.item()]
            confidence_score = float(confidence.item() * 100)
        
        # Get disease information
        disease_info = DISEASE_INFO.get(predicted_class, DISEASE_INFO['Healthy'])
        
        # Determine stage based on confidence
        if confidence_score >= 90:
            stage = 'Severe' if predicted_class != 'Healthy' else 'N/A'
        elif confidence_score >= 75:
            stage = 'Moderate' if predicted_class != 'Healthy' else 'N/A'
        else:
            stage = 'Early' if predicted_class != 'Healthy' else 'N/A'
        
        result = {
            'success': True,
            'prediction': {
                'disease_name': predicted_class,
                'confidence': round(confidence_score, 2),
                'stage': stage,
                'severity': disease_info['severity'],
                'status': 'Healthy' if predicted_class == 'Healthy' else 'Diseased',
                'precautions': disease_info['precautions']
            }
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=False)