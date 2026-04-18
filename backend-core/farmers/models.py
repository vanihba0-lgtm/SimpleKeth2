from django.db import models
from django.contrib.auth.models import User


class Crop(models.Model):
    """Master list of supported crops."""
    name = models.CharField(max_length=100)
    name_hi = models.CharField(max_length=100, blank=True, help_text="Hindi name")
    icon = models.CharField(max_length=10, blank=True, help_text="Emoji icon")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.icon} {self.name}"


class Mandi(models.Model):
    """Market (mandi) where crops are traded."""
    name = models.CharField(max_length=200)
    district = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    latitude = models.DecimalField(max_digits=10, decimal_places=6)
    longitude = models.DecimalField(max_digits=10, decimal_places=6)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["state", "name"]
        verbose_name_plural = "Mandis"

    def __str__(self):
        return f"{self.name}, {self.district}"


class MandiPrice(models.Model):
    """Time-series price data for a crop at a mandi (TimescaleDB hypertable candidate)."""
    mandi = models.ForeignKey(Mandi, on_delete=models.CASCADE, related_name="prices")
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name="prices")
    price_per_quintal = models.DecimalField(max_digits=10, decimal_places=2)
    min_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    max_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    recorded_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-recorded_at"]
        indexes = [
            models.Index(fields=["mandi", "crop", "-recorded_at"]),
        ]

    def __str__(self):
        return f"{self.crop.name} at {self.mandi.name}: ₹{self.price_per_quintal}"


class WeatherData(models.Model):
    """Weather data for a specific mandi location (historical/forecast)."""
    mandi = models.ForeignKey(Mandi, on_delete=models.CASCADE, related_name="weather_data")
    date = models.DateField()
    temperature_c = models.DecimalField(max_digits=5, decimal_places=2)
    rainfall_mm = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    humidity_percent = models.DecimalField(max_digits=5, decimal_places=2)
    is_forecast = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date"]
        indexes = [
            models.Index(fields=["mandi", "date"]),
        ]

    def __str__(self):
        return f"{self.mandi.name} Weather on {self.date}"


class FarmerProfile(models.Model):
    """Farmer profile linked to Django User."""
    LANGUAGES = [
        ("en", "English"),
        ("hi", "Hindi (हिंदी)"),
        ("te", "Telugu (తెలుగు)"),
        ("ta", "Tamil (தமிழ்)"),
        ("kn", "Kannada (ಕನ್ನಡ)"),
        ("mr", "Marathi (मराठी)"),
        ("bn", "Bengali (বাংলা)"),
        ("gu", "Gujarati (ગુજરાતી)"),
        ("pa", "Punjabi (ਪੰਜਾਬੀ)"),
        ("or", "Odia (ଓଡ଼ିଆ)"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="farmer_profile")
    phone = models.CharField(max_length=15)
    village = models.CharField(max_length=200)
    district = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    total_land_acres = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    preferred_language = models.CharField(
        max_length=5, choices=LANGUAGES, default="en"
    )
    sms_enabled = models.BooleanField(default=True)
    voice_enabled = models.BooleanField(default=False)
    push_enabled = models.BooleanField(default=True)
    crops = models.ManyToManyField(Crop, blank=True, related_name="farmers")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name()} — {self.village}, {self.district}"


class Transaction(models.Model):
    """Record of a sell action or recommendation acted upon."""
    STATUS_CHOICES = [
        ("recommended", "Recommended"),
        ("sold", "Sold"),
        ("held", "Held"),
    ]
    farmer = models.ForeignKey(FarmerProfile, on_delete=models.CASCADE, related_name="transactions")
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE)
    mandi = models.ForeignKey(Mandi, on_delete=models.CASCADE)
    quantity_kg = models.DecimalField(max_digits=10, decimal_places=2)
    price_per_quintal = models.DecimalField(max_digits=10, decimal_places=2)
    transport_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    storage_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    net_profit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="recommended")
    decision = models.CharField(max_length=10, choices=[("sell", "Sell"), ("hold", "Hold")])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.farmer} — {self.crop.name} — {self.status}"
