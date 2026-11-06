from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Car, Sponsor, RecruitmentApplication
from .serializers import CarSerializer, SponsorSerializer, RecruitmentApplicationSerializer

# ==============================================================================
# controller layer (in django terms views/viewsets)
# in mvc architecture, this acts as the controller:
# 1. receives http request from client/browser (react)
# 2. fetches or updates data using the models (m)
# 3. formats data through serializers into json responses (v)
# ==============================================================================

class CarViewSet(viewsets.ReadOnlyModelViewSet):
    # read-only viewset for racecars
    # allows GET /api/cars/ (list) and GET /api/cars/<id>/ (detail)
    queryset = Car.objects.all()
    serializer_class = CarSerializer


class SponsorViewSet(viewsets.ReadOnlyModelViewSet):
    # viewset for sponsors, showing only active partners
    queryset = Sponsor.objects.filter(is_active=True)
    serializer_class = SponsorSerializer


class RecruitmentApplicationViewSet(viewsets.ModelViewSet):
    # full crud viewset for student recruitment
    # public visitors can submit applications via POST
    # the team leads / admin can view, filter, and change status to accepted/rejected
    queryset = RecruitmentApplication.objects.all()
    serializer_class = RecruitmentApplicationSerializer

    def create(self, request, *args, **kwargs):
        # handles new application submission from the website
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # return friendly response so the frontend knows it was saved
        return Response(
            {
                "message": "application submitted successfully! we will contact you soon.",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )
