from flask_cors import CORS
from flask import Flask, render_template # <--- Make sure render_template is imported

app = Flask(__name__)
CORS(app) # This line enables CORS for all routes in your app

@app.route('/')
def landing_page(): # Or whatever you named your function
    return render_template('index.html') # <--- This line is key!

if __name__ == '__main__':
    app.run(debug=True)