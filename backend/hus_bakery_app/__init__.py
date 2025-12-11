import os
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from flask_cors import CORS
from dotenv import load_dotenv

# Khởi tạo các đối tượng mở rộng (Extensions)
load_dotenv()
db = SQLAlchemy()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    CORS(app)

    # 1. Cấu hình ứng dụng
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DB_URI') 
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['JWT_SECRET_KEY']=os.getenv('JWT_SECRET_KEY')

    # 2. Khởi tạo Extensions
    db.init_app(app)
    jwt.init_app(app)
    
    # ❗ BƯỚC KHẮC PHỤC LỖI TẠO BẢNG (NoReferencedTableError) ❗
    # Cần phải import tất cả các Models (đã được định nghĩa) vào bộ nhớ 
    # TRƯỚC KHI gọi db.create_all() để SQLAlchemy biết thứ tự tạo bảng.
    
    # 3. Imports cho các Models (Đảm bảo tất cả các models được tải vào bộ nhớ)
    from .models.branch_product import BranchProduct
    from .models.branch import Branch
    from .models.cart_item import CartItem
    from .models.category import Category         
    from .models.coupon_custom import CouponCustomer
    from .models.coupon import Coupon
    from .models.customer import Customer
    from .models.employee import Employee
    from .models.feed_back import Feedback
    from .models.order_item import OrderItem
    from .models.order_status import OrderStatus
    from .models.order import Order
    from .models.product_review import ProductReview
    from .models.product import Product           
    from .models.shipper_review import ShipperReview
    from .models.shipper import Shipper
    
    # 4. Đăng ký Blueprints 
    from .routers.auth import auth_bp
    from .routers.order_process import order_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(order_bp)

    @app.route("/test_db")
    def test_db():
        try:
            db.session.execute(text('SELECT 1'))
            return "Kết nối cơ sở dữ liệu **thành công**!"
        except Exception as e:
            return f"Kết nối thất bại. Lỗi: {e}"

    # 5. Tạo bảng (db.create_all())
    with app.app_context():
        # Lệnh này sẽ chạy thành công vì tất cả các models đã được tải
        db.create_all() 

    return app