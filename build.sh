#!/usr/bin/env bash
# Exit on error
set -o errexit

# Modify this line as needed for your package manager (pip, poetry, etc.)
pip install -r backend/requirements.txt

# Convert static asset files
python backend/manage.py collectstatic --no-input

# Apply any outstanding database migrations
python backend/manage.py migrate



python backend/manage.py shell -c "
from django.contrib.auth import get_user_model;
User = get_user_model();
if not User.objects.filter(username='yosbel').exists():
    User.objects.create_superuser('yosbel', 'yosbel@example.com', '1234.2902Amayah')
"
