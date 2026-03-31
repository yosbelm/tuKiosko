from rest_framework import routers
from django.urls import path, include

from tuKioskoApi.auth_views import CustomRefreshTokenView, CustomTokenObtainPairView, is_authenticated, logout, register
from .views import *


router = routers.DefaultRouter()
router.register(r'productos', ObtenerProductosVista)
router.register(r'todos-productos', ObtenerTodosProductosVista, basename='productos-todos' )
router.register(r'areas', ObtenerAreaVista)
router.register(r'ordenes', ObtenerOrdenVista)
router.register(r'usuarios', UsuarioVista)
router.register(r'vendedores', VendedorVista)
router.register(r'ventas', VentaVista)
router.register(r'productos-vendidos', ProductoVendidoVista)


urlpatterns = [
    path("", include(router.urls)),
    path('datos-ventas/', DatosVentasAPIView.as_view(), name='datos-ventas'),
    path('producto-detalles/<int:producto_id>/', DetallesProductoAPIView.as_view(), name='producto-detalles'),
    path('eliminar-producto/<int:producto_id>/', DeleteProductoAPIView.as_view(), name='eliminar-producto'),
    path('detalles-venta/<int:venta_id>/', DetallesVentaAPIView.as_view(), name='detalles-venta'),
    
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomRefreshTokenView.as_view(), name='token_refresh'),
    path('logout/', logout, name='logout'),
    path('authenticated/', is_authenticated, name='is_authenticated'),
    path('register/', register, name='register'),
]
