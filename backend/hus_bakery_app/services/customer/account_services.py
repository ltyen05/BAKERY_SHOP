import os

from sqlalchemy import desc
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
        total_amount += order.amount

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
    
    if "name" in profile:
        name = profile["name"].strip()
        user.name = name
        
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
        # 1. Lấy trạng thái & Ngày cập nhật (dùng làm Ngày nhận hàng)
        status_obj = OrderStatus.query.get(order.order_id)
        status_text = status_obj.status if status_obj else "Đang xử lý"
        # Nếu đã hoàn thành thì lấy ngày update, chưa thì để trống hoặc lấy ngày tạo
        received_date = status_obj.updated_at.strftime("%d/%m/%Y") if status_obj and status_obj.updated_at else ""

        # 2. Lấy danh sách sản phẩm trong đơn
        items_query = db.session.query(OrderItem, Product).outerjoin(
            Product, OrderItem.product_id == Product.product_id
        ).filter(OrderItem.order_id == order.order_id).all()

        # Tạo list string để hiển thị trong bảng (vì cột sản phẩm trong ảnh có nhiều dòng)
        product_names = []
        quantities = []
        prices = []

        for item, product in items_query:
            p_name = product.name if product else "Sản phẩm cũ"
            product_names.append(p_name)
            quantities.append(str(item.quantity))
            # Format giá: 300000.00 -> 300,000 VNĐ (hoặc để Frontend lo)
            prices.append(f"{float(item.price):,.0f} VNĐ")

        # 3. Gom dữ liệu theo đúng các cột trong ảnh
        history_list.append({
            "order_id": order.order_id,

            # Các mảng này Frontend sẽ map để xuống dòng (<br>) hiển thị như ảnh
            "products": product_names,  # Cột Sản phẩm
            "quantities": quantities,  # Cột Số lượng bánh
            "prices": prices,  # Cột Giá

            "branch_id": order.branch_id if order.branch_id else "Kho tổng",  # Cột Cơ sở
            "created_at": order.created_at.strftime("%d/%m/%Y"),  # Cột Ngày đặt hàng
            "received_at": received_date,  # Cột Ngày nhận hàng
            "total_amount": float(order.total_amount) if order.total_amount else 0,  # Cột Tổng tiền
            "status": status_text  # Cột Trạng thái
        })

    return history_list

def get_virtual_notifications(customer_id):
    # 1. Tìm tất cả đơn hàng của khách
    # Join với bảng OrderStatus để check trạng thái "Hoàn thành"
    # Lưu ý: Sửa chuỗi "Hoàn thành" cho khớp với DB của bạn (ví dụ: "completed" hoặc "success")
    completed_orders = db.session.query(Order, OrderStatus).join(
        OrderStatus, Order.order_id == OrderStatus.order_id
    ).filter(
        Order.customer_id == customer_id,
        OrderStatus.status == "Hoàn thành"  # <--- Quan trọng: Kiểm tra đúng string trạng thái trong DB
    ).order_by(desc(Order.created_at)).all()

    notifications = []

    for order, status in completed_orders:
        # 2. Kiểm tra xem đơn này đã có trong bảng Feedback chưa?
        # Feedback có khóa chính là order_id, nên query rất nhanh
        is_reviewed = db.session.query(Feedback).get(order.order_id)

        # 3. Nếu CHƯA đánh giá -> Tạo thông báo nhắc nhở
        if not is_reviewed:
            notifications.append({
                "type": "order_success",
                "order_id": order.order_id,
                "title": f"Giao hàng thành công 📦",
                "message": f"Đơn hàng #{order.order_id} đã hoàn thành. Bạn hãy đánh giá dịch vụ nhé!",
                "created_at": status.updated_at.strftime("%d/%m/%Y %H:%M") if status.updated_at else "",
                "is_read": False # Vì không lưu DB nên lúc nào cũng coi là mới
            })

    return notifications