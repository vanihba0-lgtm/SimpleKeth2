from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"crops", views.CropViewSet)
router.register(r"mandis", views.MandiViewSet)
router.register(r"prices", views.MandiPriceViewSet)
router.register(r"farmers", views.FarmerProfileViewSet)
router.register(r"transactions", views.TransactionViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("recommend/", views.get_recommendation, name="get-recommendation"),
    path("compare/", views.get_mandi_comparison, name="get-mandi-comparison"),
    path("health/", views.health_check, name="health-check"),
]
