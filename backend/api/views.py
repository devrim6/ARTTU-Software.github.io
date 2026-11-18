from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Car, Sponsor, RecruitmentApplication
from .serializers import CarSerializer, SponsorSerializer, RecruitmentApplicationSerializer

# controller layer (drf calls them viewsets)
# handles requests from react, queries models, returns json


class CarViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer


class SponsorViewSet(viewsets.ReadOnlyModelViewSet):
    # only show active sponsors
    queryset = Sponsor.objects.filter(is_active=True)
    serializer_class = SponsorSerializer


class RecruitmentApplicationViewSet(viewsets.ModelViewSet):
    queryset = RecruitmentApplication.objects.all()
    serializer_class = RecruitmentApplicationSerializer

    def create(self, request, *args, **kwargs):
        # validate and save new application from the form
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(
            {
                "message": "application submitted",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )
