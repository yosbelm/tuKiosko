from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from datetime import datetime, date
from django.utils.timezone import now
from django.utils import timezone
from django.db.models import Sum, F



from tuKioskoApi.serializers import *
from tuKioskoApp.models import *
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated


# Create your views here.
@permission_classes([IsAuthenticated])
class ObtenerProductosVista(viewsets.ModelViewSet):
    serializer_class = ProductosSerializer
    queryset = Producto.objects.filter(activo=True, cantidad__gt=0).order_by('-creado')
    @action(detail=False, methods=['post'])
    def subir_producto(self, request):
        datos = request.data
        try:
            with transaction.atomic():
                print("entra en valido" )
                print(request.user)
                area = Area.objects.filter(nombre=datos['ubicacion'], negocio_pertenece=request.user).first()
                payload = {"nombre":datos['nombre'],
                    "activo":datos['activo'],
                    "cantidad":datos['cantidad'],
                    "precio_compra":datos['precio_compra'],
                    "precio_venta":datos['precio_venta'],
                    "ubicacion":area}
                print(payload)
                producto = Producto.objects.create(
                    negocio_pertenece=request.user,
                    nombre=datos['nombre'],
                    activo=datos['activo'],
                    cantidad=datos['cantidad'],
                    precio_compra=datos['precio_compra'],
                    precio_venta=datos['precio_venta'],
                    ubicacion_id=area.id,
                )
                print(f'esta es el producto {producto}')             
                return Response({'status': 'Venta completada'}, status=201)
        except Exception as e:
            print("entra en not" )
            return Response({'error': str(e)}, status=400)

    

class ObtenerTodosProductosVista(viewsets.ModelViewSet):
    serializer_class = ProductosSerializer
    queryset = Producto.objects.all()
    
    
    
class DeleteProductoAPIView(APIView):
    @action(detail=False, methods=['delete'])
    def delete(self, request, producto_id):
        producto = get_object_or_404(Producto, id=producto_id)
        producto.delete()
        
        return Response({'status': 'Producto eliminado'}, status=201)

    
    
class ObtenerAreaVista(viewsets.ModelViewSet):
    serializer_class = AreaSerializer
    queryset = Area.objects.all()
    @action(detail=False, methods=['post'])
    def subir_area(self, request):
        datos = request.data
        try:
            with transaction.atomic():
                negocio = Usuario.objects.filter(id=request.user.id).first()
                total_areas = Area.objects.filter(negocio_pertenece=negocio).count()
                print("entra en valido" )
                # print(request.user)
                # payload = {"nombre":datos['nombre'],
                #     }
                # print(payload)
                if total_areas < 3:
                    area = Area.objects.create(
                        negocio_pertenece=request.user,
                        nombre=datos['nombre'],
                    )
                    print(f'esta es la area {area}')             
                    return Response({'status': 'Area creada'}, status=201)
                else:
                    return Response({'status': 'Limite de Areas'}, status=400)
        except Exception as e:
            print("entra en not" )
            return Response({'error': str(e)}, status=400)
    
    @action(detail=False, methods=['get'])
    def obtener_area(self, request):
        try:
            negocio = Usuario.objects.filter(id=request.user.id).first()
            total_areas = Area.objects.filter(negocio_pertenece=negocio)
            return Response(AreaSerializer(total_areas, many=True).data)
        except Exception as e:
            print("entra en not" )
            return Response({'error': str(e)}, status=400)
            


    
    
    
class UsuarioVista(viewsets.ModelViewSet):
    serializer_class = UsuarioSerializer
    queryset = Usuario.objects.all()
    

# class UsuarioVista(viewsets.ModelViewSet):
#     serializer_class = UsuarioSerializer
#     queryset = Usuario.objects.all() 
    
    
    
class VendedorVista(viewsets.ModelViewSet):
    serializer_class = VendedorSerializer
    queryset = Usuario.objects.all() 
    
    @action(detail=False, methods=['get'])
    def get_vendedor(self, request):
        negocio = request.user
        print(f'este es el user {negocio}')
        vendedores = Usuario.objects.filter(nombre=negocio)
        return Response(VendedorSerializer(vendedores, many=True).data)
    
    
@permission_classes([IsAuthenticated])
class VentaVista(viewsets.ModelViewSet):
    queryset = Venta.objects.all()    
    
    @action(detail=False, methods=['post'])
    def finalizar_venta(self, request):
        datos = request.data
        try:
            with transaction.atomic():
                print("entra en valido" )
                vendedor = Usuario.objects.get(id=request.user.id)
                print(vendedor)
                venta = Venta.objects.create(
                    vendedor_id=vendedor.id,
                    precio_total=datos['precio_total']
                )
                print(f'esta es venta {venta}')
                for item in datos['productos']:
                    prod = Producto.objects.select_for_update().get(id=item['producto'])                    

                    if prod.cantidad < item['cantidad']:
                        raise ValueError(f"Stock insuficiente para {prod.nombre}")
                    prod.cantidad -= item['cantidad']
                    prod.save()

                    ProductoVendido.objects.create(
                        venta_producto=venta,
                        producto=prod,
                        precio_producto_vendido=item['precio_unitario'],
                        cantidad=item['cantidad']
                    )                
                return Response({'status': 'Venta completada'}, status=201)
        except Exception as e:
            print("entra en not" )
            return Response({'error': str(e)}, status=400)

    
    
class ProductoVendidoVista(viewsets.ModelViewSet):
    serializer_class = ProductoVendidoSerializer
    queryset = ProductoVendido.objects.all() 




class DetallesProductoAPIView(APIView):
    def get(self, request, producto_id):
        producto = get_object_or_404(Producto, id=producto_id)
        
        return Response({
            "producto": ProductosSerializer(producto).data,
        })
        
    
    
class DetallesVentaAPIView(APIView):
    def get(self, request, venta_id):
        venta = get_object_or_404(Venta, id=venta_id)
        productos_vendidos = ProductoVendido.objects.filter(venta_producto_id=venta.id)
        
        return Response({
            "venta": VentaSerializer(venta).data,
            "productos_vendidos": ProductoVendidoSerializer(productos_vendidos, many=True).data,
        })



class DatosVentasAPIView(APIView):
    def get(self, request):
        hoy = timezone.now()
        vendedores = Usuario.objects.count()
        total_productos = Producto.objects.count() 
        
        productos_vendidos = ProductoVendido.objects.filter(creado__date=hoy).values(
            nombre=F('producto__nombre'),
            ubicacion=F('producto__ubicacion__nombre'),
            precio=F('precio_producto_vendido')
        ).annotate(
            cantidad_total=Sum('cantidad'),
            total_recaudado=Sum(F('cantidad') * F('precio_producto_vendido'))
        ).order_by('-creado')

        productos_vendidos_dia = ProductoVendido.objects.filter(creado__date=hoy).aggregate(
            cantidad_total=Sum('cantidad')
        )['cantidad_total'] or 0
        
        productos_vendidos_semana = ProductoVendido.objects.filter(creado__year=hoy.year, creado__week=hoy.isocalendar()[1]).aggregate(
            cantidad_total=Sum('cantidad')
        )['cantidad_total'] or 0
        
        productos_vendidos_mes = ProductoVendido.objects.filter(creado__year=hoy.year, creado__month=hoy.month).aggregate(
            cantidad_total=Sum('cantidad')
        )['cantidad_total'] or 0

        ventas_diarias = Venta.objects.filter(creado__date=hoy).order_by('-creado')
        ventas_semana = Venta.objects.filter(creado__year=hoy.year, creado__week=hoy.isocalendar()[1])
        ventas_mes = Venta.objects.filter(creado__year=hoy.year, creado__month=hoy.month)
        
        dinero_ventas_diarias = ventas_diarias.aggregate(total=Sum('precio_total'))['total'] or 0
        dinero_ventas_semanal = ventas_semana.aggregate(total=Sum('precio_total'))['total'] or 0
        dinero_ventas_mensual = ventas_mes.aggregate(total=Sum('precio_total'))['total'] or 0
            
        return Response({
            "ventas_diarias": VentaSerializer(ventas_diarias, many=True).data,
            "productos_vendidos": productos_vendidos,
            "ventas_diarias_conteo": ventas_diarias.count(),
            "ventas_semanal_conteo": ventas_semana.count(),
            "ventas_mensaual_conteo": ventas_mes.count(),
            "total_productos_conteo": total_productos,
            "dinero_ventas_diarias": dinero_ventas_diarias,
            "dinero_ventas_semanal": dinero_ventas_semanal,
            "dinero_ventas_mensual": dinero_ventas_mensual,
            "productos_vendidos_dia": productos_vendidos_dia,
            "productos_vendidos_semana": productos_vendidos_semana,
            "productos_vendidos_mes": productos_vendidos_mes,
            "vendedores": vendedores,
        })
    