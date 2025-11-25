from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/hus_bakery'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
@app.route("/test_db")
def test_db():
    try:
        db.session.execute(text('SELECT 1'))
        return "Kết nối cơ sở dữ liệu **thành công**!"

    except Exception as e:
        return f"Kết nối cơ sở dữ liệu **thất bại**. Lỗi: {e}"


if __name__ == '__main__':
    app.run(debug=True)