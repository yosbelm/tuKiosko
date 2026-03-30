#!/usr/bin/env bash
# Exit on error
set -o errexit

# Instalación de dependencias
pip install -r backend/requirements.txt

# Recolección de archivos estáticos (esto no necesita el disco duro)
python backend/manage.py collectstatic --no-input