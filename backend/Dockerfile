FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Dependencias necesarias para algunas librerías Python
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       gcc \
       libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias
COPY requirements.txt .

# Tiempo de espera y retry feature pra conexiones lentas como la mia
RUN pip install --default-timeout=1000 --retries=10 --no-cache-dir -r requirements.txt

# Copiar todo el backend
COPY . .

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Crear directorio para archivos estáticos
RUN mkdir -p /app/staticfiles


EXPOSE 8000

ENTRYPOINT ["/app/entrypoint.sh"]

CMD ["gunicorn", "tuKiosko.wsgi:application", "--bind", "0.0.0.0:8000"]