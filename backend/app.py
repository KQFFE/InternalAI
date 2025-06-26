from flask import Flask, render_template # <--- Make sure render_template is imported

app = Flask(__name__)

@app.route('/')
def landing_page(): # Or whatever you named your function
    return render_template('index.html') # <--- This line is key!

if __name__ == '__main__':
    app.run(debug=True)