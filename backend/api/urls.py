from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarViewSet, SponsorViewSet, RecruitmentApplicationViewSet

# ==============================================================================
# url routing (part of the controller dispatch)
# default router automatically registers all standard restful routes:
#   GET  /api/cars/
#   GET  /api/cars/<id>/
#   GET  /api/sponsors/
#   POST /api/recruitment/
#   GET  /api/recruitment/
# ==============================================================================

router = DefaultRouter()
router.register(r'cars', CarViewSet, basename='car')
router.register(r'sponsors', SponsorViewSet, basename='sponsor')
router.register(r'recruitment', RecruitmentApplicationViewSet, basename='recruitment')

urlpatterns = [
    # api root endpoints
    path('', include(router.urls)),
]
