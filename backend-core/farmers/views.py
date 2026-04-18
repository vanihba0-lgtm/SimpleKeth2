import requests
from django.conf import settings
from django.core.cache import cache
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Crop, Mandi, MandiPrice, FarmerProfile, Transaction
from .serializers import (
    CropSerializer,
    MandiSerializer,
    MandiPriceSerializer,
    FarmerProfileSerializer,
    TransactionSerializer,
    RecommendationRequestSerializer,
)


class CropViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve available crops."""
    queryset = Crop.objects.filter(is_active=True)
    serializer_class = CropSerializer


class MandiViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve mandis."""
    queryset = Mandi.objects.filter(is_active=True)
    serializer_class = MandiSerializer


class MandiPriceViewSet(viewsets.ReadOnlyModelViewSet):
    """List mandi prices with optional filtering."""
    queryset = MandiPrice.objects.select_related("mandi", "crop").all()
    serializer_class = MandiPriceSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        crop_id = self.request.query_params.get("crop_id")
        mandi_id = self.request.query_params.get("mandi_id")
        if crop_id:
            qs = qs.filter(crop_id=crop_id)
        if mandi_id:
            qs = qs.filter(mandi_id=mandi_id)
        return qs


class FarmerProfileViewSet(viewsets.ModelViewSet):
    """CRUD operations for farmer profiles."""
    queryset = FarmerProfile.objects.select_related("user").prefetch_related("crops").all()
    serializer_class = FarmerProfileSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    """CRUD operations for transactions."""
    queryset = Transaction.objects.select_related("crop", "mandi", "farmer").all()
    serializer_class = TransactionSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        farmer_id = self.request.query_params.get("farmer_id")
        if farmer_id:
            qs = qs.filter(farmer_id=farmer_id)
        return qs


@api_view(["POST"])
def get_recommendation(request):
    """
    Get sell/hold recommendation by orchestrating ML and Engine services.
    Falls back to mock data if services are unavailable.
    Results are cached in Redis.
    """
    serializer = RecommendationRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    # Check cache first (TTL: 2 hours)
    cache_key = f"recommendation_{data['crop_id']}_{data['quantity_kg']}_{round(data['latitude'], 2)}_{round(data['longitude'], 2)}"
    cached_result = cache.get(cache_key)
    if cached_result:
        return Response(cached_result, status=status.HTTP_200_OK)

    # Fetch real weather data from OpenWeatherMap
    weather_payload = {}
    try:
        weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={data['latitude']}&lon={data['longitude']}&appid=ba4c040e679a36d3383e4cda8e711a68&units=metric"
        weather_res = requests.get(weather_url, timeout=3).json()
        
        rainfall = 0
        if "rain" in weather_res:
            rainfall = weather_res["rain"].get("1h", 0) or weather_res["rain"].get("3h", 0)
            
        weather_payload = {
            "temperature_c": weather_res.get("main", {}).get("temp", 25),
            "rainfall_mm": rainfall
        }
    except Exception as e:
        print(f"Weather fetch failed: {e}")

    # Try calling the ML prediction service
    try:
        ml_response = requests.post(
            f"{settings.ML_SERVICE_URL}/predict",
            json={
                "crop_id": data["crop_id"],
                "quantity_kg": data["quantity_kg"],
                "weather": weather_payload,
            },
            timeout=5,
        )
        predictions = ml_response.json()
    except Exception:
        # Mock fallback
        predictions = {
            "predicted_price_7d": 2580,
            "predicted_price_15d": 2690,
            "predicted_price_30d": 2520,
            "confidence": 78,
        }

    # Try calling the Engine service for profit calculation
    try:
        engine_response = requests.post(
            f"{settings.ENGINE_SERVICE_URL}/api/calculate-recommendation",
            json={
                "crop_id": data["crop_id"],
                "quantity_kg": data["quantity_kg"],
                "latitude": data["latitude"],
                "longitude": data["longitude"],
                "predictions": predictions,
            },
            timeout=5,
        )
        recommendation = engine_response.json()
    except Exception:
        # Mock fallback
        recommendation = {
            "decision": "SELL_NOW",
            "confidence": predictions.get("confidence", 78),
            "current_price": 2450,
            "expected_profit": 10875,
            "best_mandi": {
                "id": 1,
                "name": "Azadpur Mandi",
                "district": "Delhi",
                "state": "Delhi",
                "latitude": 28.7041,
                "longitude": 77.1025,
            },
            "reasoning": (
                "Current prices are strong. Selling now avoids storage costs "
                "and potential losses. Net profit is within 5% of the best predicted outcome."
            ),
            "hold_days": None,
        }

    # Store in cache
    cache.set(cache_key, recommendation, timeout=7200) # 2 hours TTL

    return Response(recommendation, status=status.HTTP_200_OK)


@api_view(["POST"])
def get_mandi_comparison(request):
    """
    Compare mandis for a given crop and quantity.
    Falls back to mock data if Engine service is unavailable.
    """
    crop_id = request.data.get("crop_id")
    quantity_kg = request.data.get("quantity_kg", 500)

    # Cache check (TTL: 30 minutes)
    cache_key = f"mandi_comparison_{crop_id}_{quantity_kg}"
    cached_result = cache.get(cache_key)
    if cached_result:
        return Response(cached_result, status=status.HTTP_200_OK)

    try:
        engine_response = requests.post(
            f"{settings.ENGINE_SERVICE_URL}/api/compare-mandis",
            json={"crop_id": crop_id, "quantity_kg": quantity_kg},
            timeout=5,
        )
        return Response(engine_response.json(), status=status.HTTP_200_OK)
    except Exception:
        # Mock fallback
        mock_mandis = [
            {
                "mandi_id": 1, "mandi_name": "Azadpur Mandi",
                "district": "Delhi", "state": "Delhi", "distance_km": 45,
                "current_price": 2450, "predicted_price_7d": 2580,
                "transport_cost": 1750, "storage_cost": 0, "losses": 1225,
                "net_profit": 9275, "profit_per_kg": 18.55,
            },
            {
                "mandi_id": 3, "mandi_name": "Yeshwanthpur",
                "district": "Bangalore", "state": "Karnataka", "distance_km": 200,
                "current_price": 2520, "predicted_price_7d": 2640,
                "transport_cost": 3400, "storage_cost": 0, "losses": 1260,
                "net_profit": 7940, "profit_per_kg": 15.88,
            },
        ]
        
        cache.set(cache_key, mock_mandis, timeout=1800) # 30 mins TTL
        return Response(mock_mandis, status=status.HTTP_200_OK)


@api_view(["GET"])
def health_check(request):
    """Health check endpoint."""
    return Response({"status": "ok", "service": "backend-core"}, status=status.HTTP_200_OK)
