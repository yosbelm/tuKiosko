#!/usr/bin/env bash
# Exit on error
set -o errexit

# 1. Aplicar migraciones (aquí el disco /data ya existe)
python backend/manage.py migrate

# 2. Crear superusuario si no existe
python backend/manage.py shell -c "
from django.contrib.auth import get_user_model;
User = get_user_model();

username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

if not User.objects.filter(username='yosbel').exists():
    User.objects.create_superuser(username, email, password)
    print('Superusuario creado exitosamente.')
else:
    print('Faltan variables de entorno para el superusuario.')
"

# 3. Iniciar el servidor (Gunicorn) indicando el directorio correcto
gunicorn tuKiosko.wsgi:application --bind 0.0.0.0:$PORT --chdir backend