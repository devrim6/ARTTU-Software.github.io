from django.contrib import admin
from django.urls import path, include

# root url routes: /admin/ for django admin and /api/ for our endpoints
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
