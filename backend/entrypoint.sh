#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset


echo "==> Recolectando archivos estáticos..."
python manage.py collectstatic --no-input

echo "==> Aplicando migraciones de la base de datos..."
python manage.py migrate --noinput

echo "==> Verificando creación del superusuario..."
python manage.py shell -c "
import os
from django.contrib.auth import get_user_model

User = get_user_model()
username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', '')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

if username and password:
    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username=username, email=email, password=password)
        print(f'Superusuario \"{username}\" creado exitosamente.')
    else:
        print(f'El superusuario \"{username}\" ya existe. Omitiendo creación.')
else:
    print('Variables de superusuario no definidas. Omitiendo creación.')
"

echo "==> Ejecutando comando principal..."
exec "$@"