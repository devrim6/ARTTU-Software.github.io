from django.contrib import admin
from django.urls import path, include

# main project url routing
# routes /admin/ to the built-in django admin panel for crud operations
# routes /api/ to our rest framework endpoints for the react frontend
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
