from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/hus_bakery'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'nguyenbaothach'

    db.init_app(app)

    from .routers.auth import auth_bp
    app.register_blueprint(auth_bp)

    @app.route("/test_db")
    def test_db():
        try:
            db.session.execute(text('SELECT 1'))
            return "Kết nối cơ sở dữ liệu **thành công**!"
        except Exception as e:
            return f"Kết nối thất bại. Lỗi: {e}"

    with app.app_context():
        db.create_all()

    return app