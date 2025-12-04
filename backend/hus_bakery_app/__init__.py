import os
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
db = SQLAlchemy()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DB_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['JWT_SECRET_KEY']=os.getenv('JWT_SECRET_KEY')

    db.init_app(app)
    jwt.init_app(app)

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