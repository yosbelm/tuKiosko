from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import Sum
from django.utils.crypto import get_random_string

# Create your models here.
class Usuario(AbstractUser):
    class Rol(models.TextChoices):
        SUPERUSUARIO = 'superusuario', 'Superusuario'
        ADMINISTRADOR = 'administrador', 'Administrador'
        VENDEDOR = 'vendedor', 'Vendedor'
    class Genero(models.TextChoices):
        FEMENINO = 'femenino', 'Femenino'
        MASCULINO = 'masculino', 'Masculino'
    rol = models.CharField(max_length=20, choices=Rol.choices, default=Rol.ADMINISTRADOR)
    status = models.BooleanField(default=False)  # Paid/Unpaid status
    foto_perfil = models.ImageField(upload_to='fotos_perfil/', null=True, blank=True)
    last_login = models.DateTimeField(null=True, blank=True)
    telefono = models.CharField(max_length=15, null=True, blank=True)
    email = models.EmailField(max_length=150, null=True, blank=True)
    codigo_referir = models.CharField(max_length=10, unique=True, blank=True, null=True)
    # Vendedor
    genero = models.CharField(max_length=20, choices=Genero.choices, default=Genero.FEMENINO)
    salario = models.PositiveIntegerField(default=0)
    referido_por = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='referido')
    
    @property
    def es_superusuario(self):
        return self.rol == self.Rol.SUPERUSUARIO
    
    @property
    def es_administrador(self):
        return self.rol == self.Rol.ADMINISTRADOR

    @property
    def es_vendedor(self):
        return self.rol == self.Rol.VENDEDOR

    def __str__(self):
        return f"{self.username}({self.rol})"
    
    def save(self, *args, **kwargs):
        if not self.codigo_referir:
            self.codigo_referir = get_random_string(10)
        super().save(*args, **kwargs)


class Area(models.Model):
    negocio_pertenece = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="area_negocio", null=True)
    nombre = models.CharField(max_length=100)
    por_defecto = models.BooleanField(default=False)
    
    def __str__(self) -> str:
        return f"Area {self.nombre} pertenece a {self.negocio_pertenece}"
    
    
class Categoria(models.Model):
    negocio_pertenece = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="categoria_negocio", null=True)
    nombre = models.CharField(max_length=100)
    
    def __str__(self) -> str:
        return f"Categoria {self.nombre} pertenece a {self.negocio_pertenece}"
    
        
class Producto(models.Model):
    negocio_pertenece = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="producto_negocio", null=True)
    nombre = models.CharField(max_length=100)
    activo = models.BooleanField(default=True)
    precio_compra = models.DecimalField(max_digits=10, decimal_places=2)
    precio_venta = models.DecimalField(max_digits=10, decimal_places=2)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name="categoria_del_producto", null=True) 
    creado = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    
    def __str__(self):
        return f"{self.nombre} - precio:{self.precio_venta} - pertence {self.negocio_pertenece}"
    
    @property
    def cantidad(self):
        total = self.almacenamiento_producto.aggregate(total=Sum('cantidad'))['total']
        return total or 0
    


class Almacenamiento(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name="almacenamiento_producto")
    area = models.ForeignKey(Area, on_delete=models.CASCADE, related_name="almacenamiento_en_area")
    cantidad = models.PositiveIntegerField(default=0)

    class Meta:
        # Esto evita que un producto se repita en la misma área
        unique_together = ('producto', 'area')

    def __str__(self):
        return f"{self.producto.nombre} en {self.area.nombre}: {self.cantidad}"
    
    



    
    
    

    
class Venta(models.Model):
    vendedor = models.ForeignKey(Usuario, on_delete=models.PROTECT, related_name="vendedor_venta")
    ticket_venta = models.CharField(max_length=15, unique=True, blank=True, null=True)
    precio_total = models.DecimalField(max_digits=10, decimal_places=2)
    creado = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Vendido por {self.vendedor} en {self.creado}"
    
    def save(self, *args, **kwargs):
        if not self.ticket_venta:
            self.ticket_venta = get_random_string(15)
        super().save(*args, **kwargs)
    


class ProductoVendido(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE, name="venta_producto")
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name="producto_producto_vendido")
    precio_producto_vendido = models.DecimalField(max_digits=10, decimal_places=2)
    cantidad = models.PositiveIntegerField(default=0)    
    creado = models.DateTimeField(auto_now_add=True)    


    