from django.contrib import admin

from tuKioskoApp.models import *

# Register your models here.
admin.site.register(Usuario)
admin.site.register(Area)
admin.site.register(Producto)
admin.site.register(Venta)
admin.site.register(ProductoVendido)