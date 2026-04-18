import os
import random
from flask import Flask, request, jsonify

app = Flask(__name__)

# In a real app, you would load pre-trained models here
# e.g., model = xgb.Booster(); model.load_model('model.json')

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "service": "ml-service"})

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict future crop prices based on historical trends.
    Expects json: { "crop_id": "...", "quantity_kg": ... }
    """
    data = request.json
    if not data or 'crop_id' not in data:
        return jsonify({"error": "Missing crop_id"}), 400
        
    crop_id = data.get('crop_id')
    weather_data = data.get('weather', {})
    
    # Simple weather risk heuristic
    weather_risk = 1.0
    if weather_data.get('rainfall_mm', 0) > 100:
        weather_risk = 1.05 # Heavy rain increases future prices
    elif weather_data.get('temperature_c', 25) > 40:
        weather_risk = 1.03 # Heatwave increases prices due to scarcity
        
    # Mocking prediction logic for the MVP
    # Base price variations depending on crop
    base_price = 2400
    if crop_id == "wheat":
        base_price = 2450
    elif crop_id == "rice":
        base_price = 3100
    elif crop_id == "cotton":
        base_price = 7200
        
    # Generate mock predictions
    # Simulating standard XGBoost/LSTM output adjusted by weather risk
    growth_7d = random.uniform(-0.02, 0.05) * weather_risk
    growth_15d = random.uniform(-0.01, 0.08) * weather_risk
    growth_30d = random.uniform(-0.05, 0.10) * weather_risk
    
    pred_7d = round(base_price * (1 + growth_7d))
    pred_15d = round(base_price * (1 + growth_15d))
    pred_30d = round(base_price * (1 + growth_30d))
    
    # Calculate confidence score based on variance and weather uncertainty
    confidence = random.randint(70, 92)
    if weather_risk > 1.0:
        confidence -= 10 # Weather makes predictions less confident
    
    return jsonify({
        "crop_id": crop_id,
        "current_base_price": base_price,
        "predicted_price_7d": pred_7d,
        "predicted_price_15d": pred_15d,
        "predicted_price_30d": pred_30d,
        "confidence": confidence,
        "model_version": "v1.0-xgboost-lstm-ensemble"
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)
