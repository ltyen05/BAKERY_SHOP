import os
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from flask_cors import CORS
from dotenv import load_dotenv
from flask_mail import Mail

load_dotenv()
db = SQLAlchemy()
jwt = JWTManager()
mail = Mail()

def create_app():
    app = Flask(__name__)
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "http://localhost:3000",  # Frontend User
                "http://localhost:3001"  # Frontend Admin
            ],
            "methods": ["GET", "POST", "PUT", "DELETE"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DB_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['JWT_SECRET_KEY']=os.getenv('JWT_SECRET_KEY')
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')

    db.init_app(app)
    jwt.init_app(app)

    from .routers.auth import auth_bp
    from .routers.order_process import order_bp
    from .routers.feedback import feedback_bp
    app.register_blueprint(feedback_bp, url_prefix='/api/feedback')
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(order_bp, url_prefix='/api')

    @app.route("/test_db")
    def test_db():
        try:
            db.session.execute(text('SELECT 1'))
            return "Kết nối cơ sở dữ liệu **thành công**!"
        except Exception as e:
            return f"Kết nối thất bại. Lỗi: {e}"

    with app.app_context():
        from .models.categories import Category
        from .models.products import Product
        from .models.branch import Branch
        from .models.branch_product import BranchProduct
        from .models.cart_item import CartItem
        from .models.coupon import Coupon
        from .models.coupon_custom import CouponCustomer
        from .models.customer import Customer
        from .models.employee import Employee
        from .models.feedback import Feedback
        from .models.order import Order
        from .models.order_item import OrderItem
        from .models.order_status import OrderStatus
        from .models.product_review import ProductReview
        from .models.shipper import Shipper
        from .models.shipper_review import ShipperReview
        db.create_all()

    return app