# backend/app.py
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello from the InternalAI Backend!"

@app.route('/api/data')
def get_data():
    # This is where your AI logic or data retrieval would go
    data = {"message": "This is some data from your AI backend!", "status": "success"}
    return jsonify(data)

if __name__ == '__main__':
    # This runs the development server
    app.run(debug=True, host='0.0.0.0', port=5000)