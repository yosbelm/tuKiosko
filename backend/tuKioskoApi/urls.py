from rest_framework import routers
from django.urls import path, include

from tuKioskoApi.auth_views import CustomRefreshTokenView, CustomTokenObtainPairView, is_authenticated, logout, register
from .views import *


router = routers.DefaultRouter()
router.register(r'productos', ObtenerProductosVista, basename='productos-cantidad-diferente-cero')
router.register(r'todos-productos', ObtenerTodosProductosVista, basename='productos-todos' )
router.register(r'areas', ObtenerAreaVista, basename="areas_negocio")
router.register(r'categorias', ObtenerCategoriaVista, basename="categorias_negocio")
router.register(r'usuarios', UsuarioVista, basename="usuarios-vista")
router.register(r'vendedores', VendedorVista, basename="vendedores")
router.register(r'ventas', VentaVista, basename="ventas-vistas")
router.register(r'avisos', AvisosVista, basename="avisos")


urlpatterns = [
    path("", include(router.urls)),
    path('datos-ventas/', DatosVentasAPIView.as_view(), name='datos-ventas'),
    path('datos-all-ventas/', DatosVentasAdminAPIView.as_view(), name='datos-all-ventas'),
    path('producto-detalles/<int:producto_id>/', DetallesProductoAPIView.as_view(), name='producto-detalles'),
    path('eliminar-producto/<int:producto_id>/', DeleteProductoAPIView.as_view(), name='eliminar-producto'),
    path('detalles-venta/<str:venta_id>/', DetallesVentaAPIView.as_view(), name='detalles-venta'),
    
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomRefreshTokenView.as_view(), name='token_refresh'),
    path('logout/', logout, name='logout'),
    path('authenticated/', is_authenticated, name='is_authenticated'),
    path('register/', register, name='register'),
]
