from django.urls import path
from .views import *

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', index, name='home'),
    path('old', index_old, name='home_old'),
    path('alex', index_alex, name='home_alex'),
    path('gpt', index_gpt, name='home_gpt'),
    path("api/analyze/", AnalyzeTextAPIView.as_view(), name="api-analyze"),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
