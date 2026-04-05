from rest_framework import serializers
from tuKioskoApp.models import *
from django.db import transaction


class ProductosSerializer(serializers.ModelSerializer):
    cantidad = serializers.ReadOnlyField()
    categoria = serializers.ReadOnlyField(source='categoria.nombre')
    class Meta:
        model = Producto
        fields = [
            'id', 'negocio_pertenece', 'nombre', 'activo', 
            'precio_compra', 'precio_venta', 'categoria', 
            'creado', 'cantidad'
        ]
        
        
class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = '__all__'
        
        
        
class AlmacenamientoSerializer(serializers.ModelSerializer):
    area = serializers.ReadOnlyField(source='area.nombre')
    class Meta:
        model = Almacenamiento
        fields = ['area', 'cantidad',]
        


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['nombre']        
        

        
        

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['username', 'email', 'genero', 'rol', 'codigo_referir', 'salario']
        


class VendedorSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    
    nombre = serializers.ReadOnlyField(source='username')

    class Meta:
        model = Usuario
        fields = ['id', 'nombre', 'genero', 'salario', 'username', 'password']

    # def create(self, validated_data):
    #     with transaction.atomic():
    #         # 1. Extraer los datos del usuario del diccionario validado
    #         username = validated_data.pop('username')
    #         password = validated_data.pop('password')
    #         try:
    #             salario = validated_data.pop('salario')
    #             genero = validated_data.pop('genero')
    #         except:
    #             salario = 0
    #             genero = "femenino"

    #         usuario = Usuario.objects.create_user(
    #             username=username,
    #             password=password,
    #             first_name=username,
    #             rol=Usuario.Rol.VENDEDOR
    #         )

    #         return vendedor
        
        
        
class VentaSerializer(serializers.ModelSerializer):
    vendedor_nombre = serializers.ReadOnlyField(source='vendedor.username')
    vendedor_genero = serializers.ReadOnlyField(source='vendedor.genero')
    class Meta:
        model = Venta
        fields = '__all__'
        

class ProductoVendidoSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.ReadOnlyField(source='producto.nombre')
    vendedor_nombre = serializers.ReadOnlyField(source='venta_producto.vendedor.nombre.first_name')
    class Meta:
        model = ProductoVendido
        fields = '__all__'



class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = Usuario
        fields = ['username', 'email', 'password']
        
    def create(self, validated_data):
        user = Usuario(
            username = validated_data['username'],
            email = validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    

class AvisosSerializer(serializers.ModelSerializer):
    creado_por = serializers.ReadOnlyField(source='creado_por.username')
    visto_por = serializers.SlugRelatedField(many=True, read_only=True, slug_field='username')
    leido = serializers.SerializerMethodField()
    class Meta:
        model = Aviso
        fields = ['id', 'descripcion', 'prioridad', 'creado_por', 'visto_por', 'creacion', 'leido']
    def get_leido(self, obj):
        request = self.context.get('request')
        if request and request.user:
            return obj.visto_por.filter(id=request.user.id).exists()
        return False
    
class AvisosVendedorSerializer(serializers.ModelSerializer):
    creado_por = serializers.ReadOnlyField(source='creado_por.username')
    leido = serializers.SerializerMethodField()
    class Meta:
        model = Aviso
        fields = ['id', 'descripcion', 'prioridad', 'creado_por', 'creacion', 'leido']
    def get_leido(self, obj):
        request = self.context.get('request')
        if request and request.user:
            return obj.visto_por.filter(id=request.user.id).exists()
        return False
    
    
    
