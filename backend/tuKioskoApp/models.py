from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class Usuario(AbstractUser):
    class Rol(models.TextChoices):
        SUPERUSUARIO = 'superusuario', 'Superusuario'
        ADMINISTRADOR = 'administrador', 'Administrador'
        VENDEDOR = 'vendedor', 'Vendedor'
    rol = models.CharField(max_length=20, choices=Rol.choices, default=Rol.ADMINISTRADOR)
    status = models.BooleanField(default=False)  # Paid/Unpaid status
    foto_perfil = models.ImageField(upload_to='fotos_perfil/', null=True, blank=True)
    last_login = models.DateTimeField(null=True, blank=True)
    telefono = models.CharField(max_length=15, null=True, blank=True)
    email = models.CharField(max_length=35, null=True, blank=True)
    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='usuario_set',
        blank=True,
        help_text='Los grupos a los que este usuario pertenece.'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='usuario_permission_set',
        blank=True,
        help_text='Los permisos específicos para este usuario.'
    )
    
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


class Area(models.Model):
    nombre = models.CharField(max_length=100)
    
    def __str__(self) -> str:
        return f"Area {self.nombre}"
 

class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    activo = models.BooleanField(default=True)
    precio_compra = models.DecimalField(max_digits=10, decimal_places=2)
    precio_venta = models.DecimalField(max_digits=10, decimal_places=2)
    cantidad = models.PositiveIntegerField(default=0)
    ubicacion = models.ForeignKey(Area, on_delete=models.CASCADE, related_name="ubicacion_del_producto") 
    creado = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    
    def __str__(self):
        return f"{self.nombre} - comprado:{self.precio_compra}, vendido:{self.precio_venta}"
    


class Vendedor(models.Model):
    class Genero(models.TextChoices):
        FEMENINO = 'femenino', 'Femenino'
        MASCULINO = 'masculino', 'Masculino'
    nombre = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name="perfil_vendedor")
    genero = models.CharField(max_length=20, choices=Genero.choices, default=Genero.FEMENINO)
    salario = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return f"Vendedor {self.nombre.first_name}"
    
    
    
class Orden(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name="producto_ordenado")
    vendedor = models.ForeignKey(Vendedor, on_delete=models.CASCADE, related_name="vendedor_producto_ordenado", null=True)
    producto_original = models.CharField(max_length=100, editable=False)
    precio_venta = models.DecimalField(max_digits=10, decimal_places=2)
    cantidad = models.PositiveIntegerField(default=0)
    
    def save(self, *args, **kwargs):
        self.producto_original = self.producto.nombre
        super().save(*args, **kwargs)
    
    def __str__(self):
        if self.producto.nombre:
            return f"Orden {self.producto.nombre}"
        else: 
            return f"Orden {self.producto_original}"
    

    
class Venta(models.Model):
    vendedor = models.ForeignKey(Vendedor, on_delete=models.PROTECT, related_name="vendedor_venta")
    precio_total = models.DecimalField(max_digits=10, decimal_places=2)
    creado = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Vendido por {self.vendedor.nombre} en {self.creado}"
    


class ProductoVendido(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE, name="venta_producto")
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name="producto_producto_vendido")
    precio_producto_vendido = models.DecimalField(max_digits=10, decimal_places=2)
    cantidad = models.PositiveIntegerField(default=0)    
    creado = models.DateTimeField(auto_now_add=True)    


    