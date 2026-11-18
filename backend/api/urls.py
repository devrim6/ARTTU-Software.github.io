from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecruitmentApplicationViewSet

# routes /api/recruitment/ to the viewset
router = DefaultRouter()
router.register(r'recruitment', RecruitmentApplicationViewSet, basename='recruitment')

urlpatterns = [
    path('', include(router.urls)),
]
