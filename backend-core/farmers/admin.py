from django.contrib import admin
from .models import Crop, Mandi, MandiPrice, FarmerProfile, Transaction


@admin.register(Crop)
class CropAdmin(admin.ModelAdmin):
    list_display = ["name", "name_hi", "icon", "is_active"]
    list_filter = ["is_active"]


@admin.register(Mandi)
class MandiAdmin(admin.ModelAdmin):
    list_display = ["name", "district", "state", "is_active"]
    list_filter = ["state", "is_active"]
    search_fields = ["name", "district"]


@admin.register(MandiPrice)
class MandiPriceAdmin(admin.ModelAdmin):
    list_display = ["mandi", "crop", "price_per_quintal", "recorded_at"]
    list_filter = ["crop", "mandi__state"]
    date_hierarchy = "recorded_at"


@admin.register(FarmerProfile)
class FarmerProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "phone", "village", "district", "state"]
    list_filter = ["state", "preferred_language"]
    search_fields = ["user__username", "phone", "village"]


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ["farmer", "crop", "mandi", "quantity_kg", "net_profit", "status", "decision"]
    list_filter = ["status", "decision"]
