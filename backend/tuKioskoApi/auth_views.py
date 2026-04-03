import os
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

from tuKioskoApp.models import Area, Usuario
from tuKioskoApi.serializers import UserRegistrationSerializer


IS_PRODUCTION = os.environ.get('IS_PRODUCTION', 'False').strip().lower() == 'true'

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data
            access_token = tokens["access"]
            refresh_token = tokens["refresh"]
            
            res = Response({"success": True}) # Pon los datos aquí
            
            cookie_params = {
                "httponly": True,
                "secure": IS_PRODUCTION, 
                "samesite": 'None' if IS_PRODUCTION else 'Lax', # 'None' para cross-site
                "path": "/"
            }

            res.set_cookie(key="access_token", value=tokens["access"], **cookie_params)
            res.set_cookie(key="refresh_token", value=tokens["refresh"], **cookie_params)  
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
                secure=IS_PRODUCTION, 
                samesite='None' if IS_PRODUCTION else 'Lax',
                path="/"
            )   
            return res
        except:
            return Response({"refreshed": False})     
        


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    codigo_referido = request.query_params.get('referido', '')
    promotor = Usuario.objects.filter(codigo_referir=codigo_referido, rol="administrador").first()
    print(f'Este es el código de referido: {codigo_referido}') 
    print(f'est es el promotor {Usuario.objects.filter(codigo_referir=codigo_referido, rol="administrador").exists()}')   
    if serializer.is_valid():
        user = serializer.save()
        area, _ = Area.objects.get_or_create(nombre="Kiosko", negocio_pertenece=user)
        if codigo_referido and promotor:
            try:
                user.referido_por = promotor
                user.rol = 'vendedor'
                user.save() 
                return Response(serializer.data, status=200)               
            except Usuario.DoesNotExist:
                return Response({"status": "Ha occurrido un error"}, status=400)
                
        return Response(serializer.data, status=200)
    return Response(serializer.errors, status=400)
    
        

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