from rest_framework import serializers
from tuKioskoApp.models import *
from django.db import transaction


class ProductosSerializer(serializers.ModelSerializer):
    ubicacion = serializers.SlugRelatedField(
        slug_field='nombre', 
        queryset=Area.objects.all()
    )
    class Meta:
        model = Producto
        fields = '__all__'
        
        
class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = '__all__'
        
        

        
        

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'
        


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
    
    
