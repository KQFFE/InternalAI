#!/bin/bash
# startup.sh
# Azure App Service startup script for InternalAI Flask application

echo "🚀 Starting InternalAI Flask application..."
echo "📅 Start time: $(date)"

# Environment variables
export FLASK_APP=backend/app.py
export FLASK_ENV=production
export PYTHONPATH="/home/site/wwwroot:$PYTHONPATH"

# Log system information
echo "📋 System Information:"
echo "   Python version: $(python --version)"
echo "   Current directory: $(pwd)"
echo "   Available memory: $(free -h | grep Mem | awk '{print $2}')"
echo "   Disk usage: $(df -h / | tail -1 | awk '{print $3 "/" $2}')"

# Log directory contents
echo "📁 Directory contents:"
ls -la

# Check if required files exist
echo "✅ Checking required files..."
if [ -f "app.py" ]; then
    echo "   ✅ app.py found"
else
    echo "   ❌ app.py NOT found"
    exit 1
fi

if [ -f "requirements.txt" ]; then
    echo "   ✅ requirements.txt found"
else
    echo "   ❌ requirements.txt NOT found"
    exit 1
fi

if [ -d "templates" ]; then
    echo "   ✅ templates directory found"
    echo "   📄 Templates: $(ls -la templates/)"
else
    echo "   ⚠️  templates directory not found"
fi

if [ -d "static" ]; then
    echo "   ✅ static directory found"
    echo "   📄 Static files: $(ls -la static/ | wc -l) files"
else
    echo "   ⚠️  static directory not found"
fi

# Install/update dependencies
echo "📦 Installing Python dependencies..."
python -m pip install --upgrade pip
pip install -r requirements.txt

# Check if gunicorn is installed
if command -v gunicorn &> /dev/null; then
    echo "   ✅ Gunicorn installed: $(gunicorn --version)"
else
    echo "   ❌ Gunicorn not found, installing..."
    pip install gunicorn
fi

# Test Flask app import
echo "🧪 Testing Flask app import..."
python -c "
try:
    import app
    print('   ✅ Flask app imports successfully')
except Exception as e:
    print(f'   ❌ Flask app import failed: {e}')
    exit(1)
"

# Configure gunicorn
echo "⚙️  Configuring Gunicorn..."
WORKERS=${WORKERS:-4}
TIMEOUT=${TIMEOUT:-600}
BIND_ADDRESS=${BIND_ADDRESS:-"0.0.0.0:8000"}

echo "   Workers: $WORKERS"
echo "   Timeout: $TIMEOUT seconds"
echo "   Bind address: $BIND_ADDRESS"

# Start the application
echo "🌟 Starting Gunicorn server..."
echo "🌐 Application will be available on: http://$BIND_ADDRESS"

exec gunicorn \
    --bind "$BIND_ADDRESS" \
    --workers "$WORKERS" \
    --timeout "$TIMEOUT" \
    --keep-alive 2 \
    --max-requests 1000 \
    --max-requests-jitter 50 \
    --access-logfile '-' \
    --error-logfile '-' \
    --log-level info \
    --capture-output \
    app:app