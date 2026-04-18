from rest_framework import serializers
from .models import Crop, Mandi, MandiPrice, FarmerProfile, Transaction


class CropSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crop
        fields = ["id", "name", "name_hi", "icon", "is_active"]


class MandiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mandi
        fields = ["id", "name", "district", "state", "latitude", "longitude"]


class MandiPriceSerializer(serializers.ModelSerializer):
    mandi_name = serializers.CharField(source="mandi.name", read_only=True)
    crop_name = serializers.CharField(source="crop.name", read_only=True)

    class Meta:
        model = MandiPrice
        fields = [
            "id", "mandi", "mandi_name", "crop", "crop_name",
            "price_per_quintal", "min_price", "max_price", "recorded_at",
        ]


class FarmerProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    full_name = serializers.CharField(source="user.get_full_name", read_only=True)
    crops = CropSerializer(many=True, read_only=True)
    crop_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Crop.objects.all(), source="crops", write_only=True, required=False
    )

    class Meta:
        model = FarmerProfile
        fields = [
            "id", "username", "full_name", "phone", "village", "district", "state",
            "total_land_acres", "preferred_language", "sms_enabled", "voice_enabled",
            "push_enabled", "crops", "crop_ids", "created_at", "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class TransactionSerializer(serializers.ModelSerializer):
    crop_name = serializers.CharField(source="crop.name", read_only=True)
    mandi_name = serializers.CharField(source="mandi.name", read_only=True)

    class Meta:
        model = Transaction
        fields = [
            "id", "farmer", "crop", "crop_name", "mandi", "mandi_name",
            "quantity_kg", "price_per_quintal", "transport_cost", "storage_cost",
            "net_profit", "status", "decision", "created_at",
        ]


# === Recommendation Request/Response (not tied to a model) ===

class RecommendationRequestSerializer(serializers.Serializer):
    crop_id = serializers.IntegerField()
    quantity_kg = serializers.FloatField(min_value=1)
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()


class MandiComparisonSerializer(serializers.Serializer):
    mandi_id = serializers.IntegerField()
    mandi_name = serializers.CharField()
    district = serializers.CharField()
    state = serializers.CharField()
    distance_km = serializers.FloatField()
    current_price = serializers.FloatField()
    predicted_price_7d = serializers.FloatField()
    transport_cost = serializers.FloatField()
    storage_cost = serializers.FloatField()
    losses = serializers.FloatField()
    net_profit = serializers.FloatField()
    profit_per_kg = serializers.FloatField()


class RecommendationResponseSerializer(serializers.Serializer):
    decision = serializers.ChoiceField(choices=["SELL_NOW", "HOLD"])
    confidence = serializers.IntegerField()
    current_price = serializers.FloatField()
    expected_profit = serializers.FloatField()
    best_mandi = MandiSerializer()
    reasoning = serializers.CharField()
    hold_days = serializers.IntegerField(required=False, allow_null=True)
