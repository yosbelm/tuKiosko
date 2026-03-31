from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

from tuKioskoApi.serializers import UserRegistrationSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data
            access_token = tokens["access"]
            refresh_token = tokens["refresh"]
            
            res = Response({"success": True}) # Pon los datos aquí
            
            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=False,   # <--- Obligatorio en False si no usas HTTPS (SSL)
                samesite='Lax', # <--- 'Lax' es más permisivo para desarrollo local
                path="/"
            ) 
            res.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=False,
                samesite="Lax",
                path="/"
            )   
            return res
        except Exception as e:
            print(f"ERROR EN LOGIN: {e}")
            return Response({"success": False, "error": str(e)}, status=400)  
        

class CustomRefreshTokenView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get("refresh_token")
            if not refresh_token:
                return Response({"error": "No refresh token"}, status=400)
            request.data['refresh'] = refresh_token
            response = super().post(request, *args, **kwargs)
            tokens = response.data
            access_token = tokens["access"]
            
            res = Response()
            res.data = {"refreshed": True}
            
            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=False,
                samesite="Lax",
                path="/"
            )   
            return res
        except:
            return Response({"refreshed": False})     
        


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)
    
        

@api_view(["GET"])
@permission_classes([AllowAny])
def is_authenticated(request):
    try:
        return Response({
            "autenticado": bool(request.user.is_authenticated),
            "username": request.user.username,
            "email": request.user.email,
            "rol": request.user.rol,
        })
    except:
        return Response({"autenticado": False})


@api_view(['POST'])
@permission_classes([AllowAny])
def logout(request):
    try: 
        res = Response()
        res.data = {"success": True}
        res.delete_cookie("access_token", path="/", samesite="None")
        res.delete_cookie("refresh_token", path="/", samesite="None")
        return res
    except: 
        return Response({"success": False})