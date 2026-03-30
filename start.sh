#!/usr/bin/env bash
# Exit on error
set -o errexit

# 1. Aplicar migraciones (aquí el disco /data ya existe)
python backend/manage.py migrate

# 2. Crear superusuario si no existe
python backend/manage.py shell -c "
from django.contrib.auth import get_user_model;
User = get_user_model();
if not User.objects.filter(username='yosbel').exists():
    User.objects.create_superuser('yosbel', 'yosbel@example.com', '1234.2902Amayah')
"

# 3. Iniciar el servidor (Gunicorn)
# Asegúrate de que la ruta al wsgi sea la correcta según tu estructura
gunicorn --bind 0.0.0.0:$PORT tuKiosko.wsgi