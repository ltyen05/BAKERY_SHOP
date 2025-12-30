import os
from sqlalchemy import desc, exists, func, and_
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash
from hus_bakery_app import db
from hus_bakery_app.models.customer import Customer
from hus_bakery_app.models.order import Order
from hus_bakery_app.models.order_item import OrderItem
from hus_bakery_app.models.order_status import OrderStatus
from hus_bakery_app.models.products import Product

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, '..', 'static', 'avatars')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}


def total_amount_of_customer(customer_id):
    order_of_customer = db.session.query(Order).filter_by(customer_id=customer_id).all()
    total_amount = 0
    for order in order_of_customer:
        total_amount += order.total_amount

    return total_amount

def get_customer_rank_service(total_amount):
    # Logic phân hạng dựa trên tổng chi tiêu
    if total_amount >= 10000000:
        return "diamond"
    elif total_amount >= 5000000:
        return "gold"
    elif total_amount >= 1000000:
        return "silver"
    return "bronze"

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def update_profile(customer_id, profile):
    user = Customer.query.get(customer_id)
    if not user:
        return False, "Người dùng không tồn tại"

    # Cập nhật Email
    if "email" in profile:
        email = profile["email"].strip().lower()
        if not email:
            return False, "Email không được để trống"

        # Kiểm tra trùng email
        exists = Customer.query.filter(Customer.email == email, Customer.customer_id != customer_id).first()
        if exists:
            return False, "Email đã được sử dụng"
        user.email = email

    # Cập nhật Số điện thoại
    if "phone" in profile:
        user.phone = profile["phone"].strip()

    db.session.commit()
    return True, "Cập nhật thành công"


def update_avatar(customer_id, file):
    user = Customer.query.get(customer_id)
    if not user:
        return False, "Người dùng không tồn tại"

    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    if file and allowed_file(file.filename):
        filename = secure_filename(f"user_{customer_id}_{file.filename}")
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        user.avatar = filename
        db.session.commit()
        return True, filename

    return False, "File không hợp lệ"


def change_password(customer_id, old_pass, new_pass, confirm_pass):
    user = Customer.query.get(customer_id)

    if not user or not user.check_password(old_pass):
        return False, "Mật khẩu cũ không chính xác"
    if new_pass != confirm_pass:
        return False, "Mật khẩu xác nhận không khớp"
    if len(new_pass) < 6:
        return False, "Mật khẩu mới phải ≥ 6 ký tự"

    user.password_hash = generate_password_hash(new_pass)
    db.session.commit()
    return True, "Đổi mật khẩu thành công"

def get_order_history_service(customer_id):
    orders = Order.query.filter_by(customer_id=customer_id).order_by(desc(Order.created_at)).all()

    history_list = []

    for order in orders:
        status_obj = OrderStatus.query.get(order.order_id)
        status_text = status_obj.status if status_obj else "Đang xử lý"
        received_date = status_obj.updated_at.strftime("%d/%m/%Y") if status_obj and status_obj.updated_at else ""
        items_query = db.session.query(OrderItem, Product).outerjoin(
            Product, OrderItem.product_id == Product.product_id
        ).filter(OrderItem.order_id == order.order_id).all()

        product_names = []
        quantities = []
        prices = []

        for item, product in items_query:
            p_name = product.name if product else "Sản phẩm cũ"
            product_names.append(p_name)
            quantities.append(str(item.quantity))
            # Format giá: 300000.00 -> 300,000 VNĐ (hoặc để Frontend lo)
            prices.append(f"{float(item.price):,.0f} VNĐ")

        history_list.append({
            "order_id": order.order_id,
            "products": product_names,
            "quantities": quantities,
            "prices": prices,  # Cột Giá

            "branch_id": order.branch_id if order.branch_id else "Kho tổng",
            "created_at": order.created_at.strftime("%d/%m/%Y"),
            "received_at": received_date,
            "total_amount": float(order.total_amount) if order.total_amount else 0,  # Cột Tổng tiền
            "status": status_text 
        })

    return history_list

def get_latest_active_order_id(customer_id):

    try:
        latest_status_time = (
            db.session.query(
                OrderStatus.order_id,
                func.max(OrderStatus.updated_at).label("latest_time")
            )
            .group_by(OrderStatus.order_id)
            .subquery()
        )

        latest_status = (
            db.session.query(
                OrderStatus.order_id,
                OrderStatus.status
            )
            .join(
                latest_status_time,
                (OrderStatus.order_id == latest_status_time.c.order_id) &
                (OrderStatus.updated_at == latest_status_time.c.latest_time)
            )
            .subquery()
        )

        orders = (
            db.session.query(
                Order.order_id,
                latest_status.c.status
            )
            .join(latest_status, Order.order_id == latest_status.c.order_id)
            .filter(Order.customer_id == customer_id)
            .filter(latest_status.c.status != "Đã giao")
            .filter(latest_status.c.status !="Không thành công")
            .order_by(Order.created_at.desc())
            .all()
        )

        return orders, None

    except SQLAlchemyError:
        db.session.rollback()
        return None, "Lỗi hệ thống"