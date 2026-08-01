from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from datetime import datetime, date
from django.utils.timezone import now
from django.utils import timezone
from django.db.models import Sum, F
from django.core.cache import cache



from tuKioskoApi.serializers import *
from tuKioskoApp.models import *
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated


# Create your views here.
@permission_classes([IsAuthenticated])
class ObtenerProductosVista(viewsets.ViewSet):
    @action(detail=False, methods=['post'])
    def subir_producto(self, request):
        datos = request.data
        try:
            with transaction.atomic():
                print("entra en valido" )
                print(request.user)
                area = Area.objects.filter(nombre=datos['ubicacion'], negocio_pertenece=request.user).first()
                categoria = Categoria.objects.filter(nombre=datos['categoria'], negocio_pertenece=request.user).first()
                payload = {"nombre":datos['nombre'],
                    "activo":datos['activo'],
                    "cantidad":datos['cantidad'],
                    "precio_compra":datos['precio_compra'],
                    "precio_venta":datos['precio_venta'],
                    "categoria": categoria,
                    "ubicacion":area}
                print(payload)
                producto = Producto.objects.create(
                    negocio_pertenece=request.user,
                    nombre=datos['nombre'],
                    activo=datos['activo'],
                    # cantidad=datos['cantidad'],
                    precio_compra=datos['precio_compra'],
                    precio_venta=datos['precio_venta'],
                    categoria_id=categoria.id,
                    # ubicacion_id=area.id,
                )
                almacenamiento_producto = Almacenamiento.objects.create(
                    producto=producto,
                    area=area,
                    cantidad=datos['cantidad'],
                )
                print(f'esta es el producto {producto}')
                print(f'esta es el almacenamiento_producto {almacenamiento_producto}')             
                return Response({'status': 'Venta completada'}, status=201)
        except Exception as e:
            print("entra en not" )
            return Response({'error': str(e)}, status=400)
    @action(detail=False, methods=['get'])
    def get_productos(self, request):
        usuario = request.user
        if usuario.rol == 'vendedor':
            negocio = Usuario.objects.filter(id=usuario.referido_por_id).first()
        if usuario.rol == 'administrador':
            negocio = Usuario.objects.filter(id=usuario.id).first()  
        print(f'pertence a {usuario}')
        productos = Producto.objects.filter(activo=True, negocio_pertenece=negocio).order_by('-creado')
        print(f'estos son los productos {productos}')
        return Response(ProductosSerializer(productos, many=True).data)
    @action(detail=True, methods=['patch'])
    def actualizar_cantidad_producto(self, request, pk=None):
        print(f'este es el pk {pk}')
        datos = request.data
        usuario = request.user
        print(f'datos: {datos}')
        if usuario.rol == 'administrador':
            negocio = Usuario.objects.filter(id=usuario.id).first()  
        print(f'pertence a {usuario}')
        try:
            producto = Producto.objects.filter(id=pk, negocio_pertenece=negocio).first()
            # producto.cantidad = producto.cantidad + datos['cantidad']
            area_seleccionada = Area.objects.filter(nombre=datos['area'], negocio_pertenece=negocio).first()
            almacenamiento = Almacenamiento.objects.filter(producto=producto, area=area_seleccionada).first()
            almacenamiento.cantidad = almacenamiento.cantidad+datos['cantidad']
            print(f'esta es el area seleccionada desde el front {area_seleccionada}')
            print(f"esta es la cantidad {datos['cantidad']}")
            almacenamiento.save()
        except Producto.DoesNotExist:
            return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)
            
        print(f'este es el producto {producto}')
        return Response(ProductosSerializer(producto).data)
        
        

@permission_classes([IsAuthenticated])
class ObtenerTodosProductosVista(viewsets.ViewSet):
    @action(detail=False, methods=['get'])
    def obtener_productos(self, request):
        try:
            negocio = Usuario.objects.filter(id=request.user.id).first()
            total_productos = cache.get('total_productos')
            if not total_productos:
                total_productos = list(Producto.objects.filter(negocio_pertenece=negocio))
                cache.set('total_productos', total_productos, 3600)
            return Response(ProductosSerializer(total_productos, many=True).data)
        except Exception as e:
            print("entra en not" )
            return Response({'error': str(e)}, status=400)
    @action(detail=True, methods=['patch'])
    def editar_producto(self, request, pk=None):
        try:
            producto = Producto.objects.get(id=pk, negocio_pertenece__id=request.user.id)
            serializer = ProductosSerializer(producto, data=request.data, partial=True)
            
            if serializer.is_valid():
                print('es valido')
                serializer.save()
                
                ubicaciones_data = request.data.get('ubicaciones', [])
                categoria_data = request.data.get('categoria')
                print(f'esta es la categoria data {categoria_data}')
                categoria = Categoria.objects.filter(negocio_pertenece=request.user, nombre=categoria_data).first()
                if categoria_data:
                    producto.categoria = categoria
                    producto.save()
                print(f'estos son los ubicaiones data {ubicaciones_data}')
                for ubc in ubicaciones_data:
                    area = Area.objects.filter(negocio_pertenece=request.user, nombre=ubc.get('area')).first()
                    print(f'entra al bucle {ubc.get('cantidad')}')
                    Almacenamiento.objects.update_or_create(
                        producto=producto, 
                        area=area,
                        defaults={
                            'cantidad': ubc.get('cantidad', 0)
                        }
                    )
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                print('no es valido')
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        except Producto.DoesNotExist:
            return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    
    
@permission_classes([IsAuthenticated])    
class DeleteProductoAPIView(APIView):
    @action(detail=False, methods=['delete'])
    def delete(self, request, producto_id):
        negocio = request.user
        producto = get_object_or_404(Producto, id=producto_id, negocio_pertenece=negocio)
        producto.delete()
        
        return Response({'status': 'Producto eliminado'}, status=201)

    
@permission_classes([IsAuthenticated])    
class ObtenerAreaVista(viewsets.ViewSet):
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
    
    @action(detail=True, methods=['patch'])
    def definir_area_principal(self, request,  pk=None):
        print(f'este es el id {pk}'),
        try:
            negocio = Usuario.objects.filter(id=request.user.id).first()
            area_activa = Area.objects.filter(negocio_pertenece=negocio, por_defecto=True).first()
            area_activa.por_defecto = False
            area_activa.save()
            area_seleccionada = Area.objects.filter(negocio_pertenece=negocio, id=pk).first()
            area_seleccionada.por_defecto = True
            area_seleccionada.save()
            return Response({'status': 'Area por defecto actualizada'}, status=201)
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
            


@permission_classes([IsAuthenticated])    
class ObtenerCategoriaVista(viewsets.ViewSet):
    @action(detail=False, methods=['post'])
    def subir_categoria(self, request):
        datos = request.data
        try:
            with transaction.atomic():
                negocio = Usuario.objects.filter(id=request.user.id).first()
                categorias = Categoria.objects.filter(negocio_pertenece=negocio).count()
                print("entra en valido" )
                if categorias <= 5:
                    categoria = Categoria.objects.create(
                        negocio_pertenece=request.user,
                        nombre=datos['nombre'],
                    )
                    print(f'esta es la Categoria {categoria}')             
                    return Response({'status': 'Categoria creada'}, status=201)
                else:
                    return Response({'status': 'Limite de Categorias'}, status=400)
        except Exception as e:
            print("entra en not" )
            return Response({'error': str(e)}, status=400)
        
    @action(detail=False, methods=['get'])
    def obtener_categoria(self, request):
        try:
            negocio = Usuario.objects.filter(id=request.user.id).first()
            categorias = Categoria.objects.filter(negocio_pertenece=negocio)
            return Response(CategoriaSerializer(categorias, many=True).data)
        except Exception as e:
            print("entra en not" )
            return Response({'error': str(e)}, status=400)


    
    
@permission_classes([IsAuthenticated])    
class UsuarioVista(viewsets.ViewSet):
    @action(detail=False, methods=['get'])
    def get_usuario(self, request):
        usuario = request.user
        link_referido, referido_por = None, None
        print(f'este es el user {usuario}')
        usuario = Usuario.objects.filter(id=usuario.id).first()
        if usuario.rol == "vendedor":
            referido_por = Usuario.objects.filter(id=usuario.referido_por.id).first().username
        if usuario.rol == "administrador":
            link_referido = f"https://tukiosko.onrender.com/registro?referido={usuario.codigo_referir}"
            print(f'este es el link {link_referido}')
        return Response({
            "usuario_datos":UsuarioSerializer(usuario).data,
            "usuario_link": link_referido,
            "referido_por": referido_por,
            })
     
    
    
@permission_classes([IsAuthenticated])    
class VendedorVista(viewsets.ViewSet):
    @action(detail=False, methods=['get'])
    def get_vendedor(self, request):
        usuario = request.user
        hoy = timezone.now()
        
        if usuario.rol == 'administrador':
            print(f'este es el user {usuario}')
            vendedores = Usuario.objects.filter(referido_por=usuario.id, rol="vendedor")
            dict = {}
            for vendedor in vendedores:
                ventas_diarias = Venta.objects.filter(vendedor=vendedor, creado__date=hoy).aggregate(precio_total=Sum('precio_total'))
                print(f"-----------{ventas_diarias['precio_total']}")
                print(f'este es el vendor {vendedor.username}')
                dict[vendedor.username] = ventas_diarias['precio_total']
                pass
            print(f'aaqui esta el diccionario {dict}')
        return Response({
            'vendedores': VendedorSerializer(vendedores, many=True).data,
            'stats': dict
        })
    
    
@permission_classes([IsAuthenticated])
class VentaVista(viewsets.ViewSet):    
    @action(detail=False, methods=['post'])
    def finalizar_venta(self, request):
        datos = request.data
        try:
            with transaction.atomic():
                """
                arreglar la logica para si el area del producto no coincidde que se pueda vender el producto
                """
                print("entra en valido" )
                vendedor = Usuario.objects.filter(id=request.user.id, rol="vendedor").first()
                negocio = Usuario.objects.filter(id=vendedor.referido_por_id).first()
                print(vendedor)
                venta = Venta.objects.create(
                    vendedor_id=vendedor.id,
                    precio_total=datos['precio_total']
                )
                print(f'esta es venta {venta}')
                for item in datos['productos']:
                    prod = Producto.objects.select_for_update().get(id=item['producto']) 
                    area_defecto = Area.objects.filter(negocio_pertenece=negocio, por_defecto=True).first() 
                    almacenamiento = Almacenamiento.objects.filter(producto=prod, area=area_defecto).first()                  

                    if almacenamiento.cantidad < item['cantidad']:
                        almacenamiento.cantidad = 0
                        # raise ValueError(f"Stock insuficiente para {prod.nombre}")
                    else:
                        almacenamiento.cantidad -= item['cantidad']
                    almacenamiento.save()

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

 



@permission_classes([IsAuthenticated])
class DetallesProductoAPIView(APIView):
    @action(detail=False, methods=['get'])
    def get(self, request, producto_id):
        usuario = request.user
        producto = get_object_or_404(Producto, id=producto_id, negocio_pertenece=usuario)
        almacenamiento = Almacenamiento.objects.filter(producto=producto)
        
        return Response({
            "producto": ProductosSerializer(producto).data,
            "almacenamientos": AlmacenamientoSerializer(almacenamiento, many=True).data,
        })
        
    
@permission_classes([IsAuthenticated])    
class DetallesVentaAPIView(APIView):
    @action(detail=False, methods=['get'])
    def get(self, request, venta_id):
        usuario = request.user
        if usuario.rol == 'vendedor':
            negocio = Usuario.objects.filter(id=usuario.referido_por_id).first()
        if usuario.rol == 'administrador':
            negocio = Usuario.objects.filter(id=usuario.id).first()
        venta = get_object_or_404(Venta, ticket_venta=venta_id)
        productos_vendidos = ProductoVendido.objects.filter(venta_producto_id=venta.id, 
                            producto__negocio_pertenece=negocio)
        
        return Response({
            "venta": VentaSerializer(venta).data,
            "productos_vendidos": ProductoVendidoSerializer(productos_vendidos, many=True).data,
        })


@permission_classes([IsAuthenticated])
class DatosVentasAPIView(APIView):
    @action(detail=False, methods=['get'])
    def get(self, request):
        hoy = timezone.now()
        usuario = request.user
         
        productos_vendidos_dia, productos_vendidos_semana, productos_vendidos_mes = None, None, None
        vendedores, total_productos = 0, 0
        dinero_ventas_diarias = None
        ventas_semana, dinero_ventas_semanal, total_dinero_vendido = 0, 0, 0
        productos_vendidos_count = 0
        
        if usuario.rol=="administrador":
            vendedores = Usuario.objects.filter(referido_por=usuario).count()
            total_productos = Producto.objects.filter(negocio_pertenece=usuario).count()
        
            productos_vendidos = cache.get('productos_vendidos')
            if not productos_vendidos:
                productos_vendidos = list(ProductoVendido.objects.filter(creado__date=hoy, 
                    producto__negocio_pertenece=usuario).values(
                    nombre=F('producto__nombre'),
                    precio=F('precio_producto_vendido')
                ).annotate(
                    cantidad_total=Sum('cantidad'),
                    total_recaudado=Sum(F('cantidad') * F('precio_producto_vendido'))
                ).order_by('producto__nombre'))
                cache.set('productos_vendidos', productos_vendidos, 3600)
            
            productos_vendidos_dia = ProductoVendido.objects.filter(creado__date=hoy, producto__negocio_pertenece=usuario).aggregate(
                cantidad_total=Sum('cantidad')
            )['cantidad_total'] or 0
            
            productos_vendidos_semana = ProductoVendido.objects.filter(creado__year=hoy.year, 
                producto__negocio_pertenece=usuario,
                creado__week=hoy.isocalendar()[1]).aggregate(
                cantidad_total=Sum('cantidad')
            )['cantidad_total'] or 0
            
            productos_vendidos_mes = cache.get('productos_vendidos_mes')
            if not productos_vendidos_mes:
                productos_vendidos_mes = ProductoVendido.objects.filter(creado__year=hoy.year,
                    producto__negocio_pertenece=usuario,
                    creado__month=hoy.month).aggregate(
                    cantidad_total=Sum('cantidad')
                )['cantidad_total'] or 0
                cache.set('productos_vendidos_mes', productos_vendidos_mes, 3600)
            
            ventas_diarias = cache.get('ventas_diarias')
            if not ventas_diarias:
                ventas_diarias = Venta.objects.filter(creado__date=hoy, vendedor__referido_por=usuario).order_by('-creado')
                cache.set('ventas_diarias', ventas_diarias, 3600)
            dinero_ventas_diarias = ventas_diarias.aggregate(total=Sum('precio_total'))['total'] or 0
            ventas_semana = Venta.objects.filter(creado__year=hoy.year, vendedor__referido_por=usuario, creado__week=hoy.isocalendar()[1])
            dinero_ventas_semanal = ventas_semana.aggregate(total=Sum('precio_total'))['total'] or 0
        
        if usuario.rol == "vendedor":
            productos_vendidos = ProductoVendido.objects.filter(creado__date=hoy, 
                venta_producto__vendedor=usuario).values(
                nombre=F('producto__nombre'),
                precio=F('precio_producto_vendido')
            ).annotate(
                cantidad_total=Sum('cantidad'),
                total_recaudado=Sum(F('cantidad') * F('precio_producto_vendido'))
            ).order_by('producto__nombre')
            productos_vendidos_count = ProductoVendido.objects.filter(creado__date=hoy, 
                venta_producto__vendedor=usuario).aggregate(total_productos=Sum('cantidad'))
            
            print(f'------------------{productos_vendidos_count}')

            ventas_diarias = Venta.objects.filter(creado__date=hoy, vendedor=usuario).order_by('-creado')
            total_dinero_vendido = ventas_diarias.aggregate(total_dinero_ventas=Sum('precio_total'))
            
        return Response({
            "ventas_diarias": VentaSerializer(ventas_diarias, many=True).data,
            "productos_vendidos": productos_vendidos,
            "productos_vendidos_count": productos_vendidos_count,
            "ventas_diarias_conteo": ventas_diarias.count(),
            "total_productos_conteo": total_productos,
            "dinero_ventas_diarias": dinero_ventas_diarias,
            "dinero_ventas_semanal": dinero_ventas_semanal,
            "productos_vendidos_dia": productos_vendidos_dia,
            "productos_vendidos_semana": productos_vendidos_semana,
            "productos_vendidos_mes": productos_vendidos_mes,
            "vendedores": vendedores,
            "total_dinero_vendido": total_dinero_vendido,
        })
    
    
@permission_classes([IsAuthenticated])
class DatosVentasAdminAPIView(APIView):
    @action(detail=False, methods=['get'])
    def get(self, request):
        usuario = request.user
        ventas_diarias = None
        total_vendido= None
        hoy = timezone.now()
        if usuario.rol == 'administrador':
            ventas_diarias = cache.get('ventas_diarias')
            if not ventas_diarias:
                ventas_diarias = Venta.objects.filter(vendedor__referido_por=usuario,
                                                    creado__date=hoy).order_by('-creado')
                cache.set('ventas_diarias', ventas_diarias, 3600)
                total_vendido = 0
                for venta in ventas_diarias:
                    total_vendido += venta.precio_total
                print(f"esta es la venta {total_vendido}")
                print(f'ventas diarias {[venta.precio_total for venta in ventas_diarias]}')
                
        return Response({
            "ventas_diarias": VentaSerializer(ventas_diarias, many=True).data,
            "total": total_vendido,
        })
        
        

@permission_classes([IsAuthenticated])    
class AvisosVista(viewsets.ViewSet):
    @action(detail=False, methods=['get'])
    def get_avisos(self, request):
        hoy = timezone.now()
        usuario = request.user
        if usuario.rol == 'vendedor':
            negocio = Usuario.objects.filter(id=usuario.referido_por_id).first()
            avisos = Aviso.objects.filter(creado_por=negocio, creacion__date=hoy)
            serializer = AvisosVendedorSerializer(avisos, many=True, context={'request': request})
            print(serializer.data)
        if usuario.rol == 'administrador':
            negocio = Usuario.objects.filter(id=usuario.id).first()
            avisos = Aviso.objects.filter(creado_por=negocio, creacion__date=hoy)
            serializer = AvisosSerializer(avisos, many=True)        
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def get_avisos_no_leidos_vendedor(self, request):
        hoy = timezone.now()
        vendedor = Usuario.objects.filter(id=request.user.id, rol="vendedor").first()
        if not vendedor:
            return Response({"error": "Usuario no es vendedor"}, status=403)
        negocio = Usuario.objects.filter(id=vendedor.referido_por_id).first()        
        avisos = Aviso.objects.filter(creado_por=negocio, creacion__date=hoy).exclude(visto_por=request.user)
        serializer = AvisosVendedorSerializer(avisos, many=True, context={'request': request})        
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def marcar_leido(self, request, pk=None):
        try:
            aviso = Aviso.objects.get(pk=pk)
            usuario = request.user
            aviso.visto_por.add(usuario)
            return Response({
                'status': 'Aviso marcado como leído',
                'id': aviso.id
            }, status=status.HTTP_200_OK)
        except Aviso.DoesNotExist:
            return Response({'error': 'Aviso no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=False, methods=['patch'])
    def marcar_todos_leido(self, request):
        usuario = request.user
        hoy = timezone.now()
        try:
            if usuario.rol == 'vendedor':
                negocio = Usuario.objects.filter(id=usuario.referido_por_id).first()
                avisos = Aviso.objects.filter(creado_por=negocio, creacion__date=hoy).exclude(visto_por=usuario)
                for aviso in avisos:
                    aviso.visto_por.add(usuario)
                return Response({
                    'status': 'Avisos marcados como leído',}, status=status.HTTP_200_OK)
        except Aviso.DoesNotExist:
            return Response({'error': 'No se marcaron como leido'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def publicar_aviso(self, request):
        usuario = request.user
        if usuario.rol != 'administrador':
            return Response(
                {"error": "No tienes permisos para publicar avisos"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        descripcion = request.data.get('descripcion')
        prioridad = request.data.get('prioridad', 'baja')
        # titulo = request.data.get('titulo', 'Nuevo Aviso')
        if not descripcion:
            return Response(
                {"error": "La descripción es obligatoria"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            nuevo_aviso = Aviso.objects.create(
                # titulo=titulo,
                descripcion=descripcion,
                prioridad=prioridad,
                creado_por=usuario
            )
            serializer = AvisosSerializer(nuevo_aviso)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {"error": f"Error al crear el aviso: {str(e)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    @action(detail=True, methods=['delete'])
    def delete_aviso(self, request, pk=None):
        negocio = request.user
        print('este es el negocio')
        try:
            aviso = get_object_or_404(Aviso, id=pk, creado_por=negocio)
            aviso.delete()
            return Response({'status': 'Aviso eliminado'}, status=201)
        except Exception as e:
            return Response({"error": f"Error al eliminar el aviso {e}"})

