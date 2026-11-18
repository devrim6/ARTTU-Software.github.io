from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import RecruitmentApplication
from .serializers import RecruitmentApplicationSerializer

# controller layer (viewset handles list, create, delete)


class RecruitmentApplicationViewSet(viewsets.ModelViewSet):
    queryset = RecruitmentApplication.objects.all()
    serializer_class = RecruitmentApplicationSerializer

    def create(self, request, *args, **kwargs):
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
