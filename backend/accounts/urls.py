from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.utils import extend_schema
from .views import RegisterView, ProfileView, LogoutView
from .google_auth import google_auth, google_client_id
from .views import (
    RegisterView,
    ProfileView,
    LogoutView,
    ChangePasswordView,
    AvatarUploadView,   # 👈 ADD THIS
)

# Wrap JWT views with schema tags
class CustomTokenObtainPairView(TokenObtainPairView):
    @extend_schema(tags=['Accounts'])
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class CustomTokenRefreshView(TokenRefreshView):
    @extend_schema(tags=['Accounts'])
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


urlpatterns = [
    # Auth
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),

    # Profile
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/avatar/', AvatarUploadView.as_view(), name='profile-avatar'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),


    # ✅ GOOGLE OAUTH ROUTES — ADD THESE
    path('google/auth/', google_auth, name='google_auth'),
    path('google/client-id/', google_client_id, name='google_client_id'),
]