from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response

        
class CookiesJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('access_token')
        if not access_token:
            print('no acces token')
            return None

        validated_token = self.get_validated_token(access_token)
        try:
            user = self.get_user(validated_token)
        except:
            return Response({"user": "no hya user"})
        
        return (user, validated_token)
