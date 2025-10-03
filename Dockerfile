# Dockerfile for InternalAI Flask + React Application
FROM python:3.11-slim

# Install system dependencies for pyodbc and MSSQL
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    gpg \
    unixodbc \
    unixodbc-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Microsoft ODBC Driver 18 for SQL Server
RUN curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg \
    && echo "deb [arch=amd64,arm64,armhf signed-by=/usr/share/keyrings/microsoft-prod.gpg] https://packages.microsoft.com/debian/11/prod bullseye main" > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql18 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Set Flask app environment variable for migrations
ENV FLASK_APP=run:app

# Copy Python requirements and install dependencies
COPY backend/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application files
COPY backend/ backend/
COPY run.py .

# Copy frontend build files (built by GitHub Actions)
COPY templates/ templates/
COPY static/ static/

# Create non-root user for security
RUN adduser --disabled-password --gecos '' appuser \
    && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Start application with gunicorn
# Run migrations before starting the app
CMD ["sh", "-c", "echo '🔄 Running database migrations...' && flask db upgrade || echo '❌ Migration failed with exit code:' $? && echo '✅ Starting application server...' && gunicorn --bind 0.0.0.0:8000 --workers 2 --timeout 120 run:app"]