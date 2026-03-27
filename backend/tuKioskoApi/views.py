from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime, date
from django.utils.timezone import now
from django.db.models import Sum, F



from tuKioskoApi.serializers import *
from tuKioskoApp.models import *


# Create your views here.
class ObtenerProductosVista(viewsets.ModelViewSet):
    serializer_class = ProductosSerializer
    queryset = Producto.objects.filter(activo=True).order_by('-creado')
    
    
    
class ObtenerAreaVista(viewsets.ModelViewSet):
    serializer_class = AreaSerializer
    queryset = Area.objects.all()
    


class ObtenerOrdenVista(viewsets.ModelViewSet):
    serializer_class = OrdenSerializer
    queryset = Orden.objects.all()
    
    
    
class UsuarioVista(viewsets.ModelViewSet):
    serializer_class = UsuarioSerializer
    queryset = Usuario.objects.all() 
    
    
    
class VendedorVista(viewsets.ModelViewSet):
    serializer_class = VendedorSerializer
    queryset = Vendedor.objects.all() 
    
    

class VentaVista(viewsets.ModelViewSet):
    serializer_class = VentaSerializer
    queryset = Venta.objects.all()    
    
    
    
class ProductoVendidoVista(viewsets.ModelViewSet):
    serializer_class = ProductoVendidoSerializer
    queryset = ProductoVendido.objects.all() 




class DatosVentasAPIView(APIView):
    def get(self, request):
        hoy = date.today()
        vendedores = Vendedor.objects.all().count()
        productos_vendidos = ProductoVendido.objects.filter(creado__gte=hoy).values(
            nombre=F('producto__nombre'),
            precio=F('precio_producto_vendido')
        ).annotate(
            cantidad_total=Sum('cantidad'),
            total_recaudado=Sum(F('cantidad') * F('precio_producto_vendido'))
        )

        
        ventas_diarias = Venta.objects.filter(creado__gte=hoy)
        productos_vendidos_dia = ProductoVendido.objects.filter(creado__gte=hoy).aggregate(
                cantidad_total=Sum('cantidad'),
            )['cantidad_total'] or 0
        productos_vendidos_semana = ProductoVendido.objects.filter(creado__year=hoy.year, creado__week=hoy.isocalendar()[1]).aggregate(
                cantidad_total=Sum('cantidad'),
            )['cantidad_total'] or 0
        productos_vendidos_mes = ProductoVendido.objects.filter(creado__year=hoy.year, creado__month=hoy.month).aggregate(
                cantidad_total=Sum('cantidad'),
            )['cantidad_total'] or 0
        print(f'--------------{productos_vendidos_dia}')

            
        # Ventas semana 
        ventas_semana = Venta.objects.filter(creado__year=hoy.year, creado__week=hoy.isocalendar()[1])
        # Ventas del mes
        ventas_mes = Venta.objects.filter(creado__year=hoy.year, creado__month=hoy.month)
        productos_mes = ProductoVendido.objects.filter(creado__year=hoy.year, creado__month=hoy.month)
        
        dinero_ventas_diarias, dinero_ventas_semanal, dinero_ventas_mensual = 0, 0, 0
        for venta in ventas_diarias:
            dinero_ventas_diarias+=venta.precio_total
        for venta in ventas_semana:
            dinero_ventas_semanal+=venta.precio_total
        for venta in ventas_mes:
            dinero_ventas_mensual+=venta.precio_total
            
            
        return Response({
            "ventas_diarias": VentaSerializer(ventas_diarias, many=True).data,
            "productos_vendidos": productos_vendidos,
            "ventas_diarias_conteo": ventas_diarias.count(),
            "ventas_semanal_conteo": ventas_semana.count(),
            "ventas_mensaual_conteo": ventas_mes.count(),
            "dinero_ventas_diarias": dinero_ventas_diarias,
            "dinero_ventas_semanal": dinero_ventas_semanal,
            "dinero_ventas_mensual": dinero_ventas_mensual,
            "productos_vendidos_dia": productos_vendidos_dia,
            "productos_vendidos_semana": productos_vendidos_semana,
            "productos_vendidos_mes": productos_vendidos_mes,
            "vendedores": vendedores,
        })
    