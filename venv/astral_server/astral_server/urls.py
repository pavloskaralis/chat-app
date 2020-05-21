from django.conf.urls import include
from django.urls import path
from django.contrib import admin

urlpatterns = [
    path('astral/', include('astral.urls')),
    path('admin/', admin.site.urls),
]