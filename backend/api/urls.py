from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarViewSet, SponsorViewSet, RecruitmentApplicationViewSet

# register api routes automatically (/api/cars/, /api/sponsors/, /api/recruitment/)
router = DefaultRouter()
router.register(r'cars', CarViewSet, basename='car')
router.register(r'sponsors', SponsorViewSet, basename='sponsor')
router.register(r'recruitment', RecruitmentApplicationViewSet, basename='recruitment')

urlpatterns = [
    path('', include(router.urls)),
]
