from flask import render_template
from hus_bakery_app import app

@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    from hus_bakery_app import admin
    app.run(debug=True)