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
from hus_bakery_app.models.feedback import Feedback

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
        # 1. Tìm bản ghi trạng thái "Hoàn thành" của đơn hàng này
        # Giả sử trong DB cột trạng thái tên là 'status' và giá trị là 'Hoàn thành'
        completed_status = OrderStatus.query.filter_by(
            order_id=order.order_id,
            status="Hoàn thành"
        ).first()

        # Nếu tìm thấy trạng thái Hoàn thành thì lấy ngày updated_at, ngược lại để trống
        received_date = completed_status.updated_at.strftime(
            "%d/%m/%Y") if completed_status and completed_status.updated_at else ""

        # Lấy trạng thái hiện tại (mới nhất) để hiển thị ở cột Trạng thái
        # (Nếu bạn vẫn muốn hiển thị trạng thái hiện tại của đơn hàng)
        latest_status_obj = OrderStatus.query.filter_by(order_id=order.order_id).order_by(
            desc(OrderStatus.updated_at)).first()
        status_text = latest_status_obj.status if latest_status_obj else "Đang xử lý"

        # 2. Lấy danh sách sản phẩm trong đơn (giữ nguyên logic cũ)
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
            prices.append(f"{float(item.price):,.0f} VNĐ")

        # 3. Gom dữ liệu
        history_list.append({
            "order_id": order.order_id,
            "products": product_names,
            "quantities": quantities,
            "prices": prices,
            "branch_id": order.branch_id if order.branch_id else "Kho tổng",
            "created_at": order.created_at.strftime("%d/%m/%Y"),
            "received_at": received_date,  # Chỉ có giá trị nếu đơn hàng đã "Hoàn thành"
            "total_amount": float(order.total_amount) if order.total_amount else 0,
            "status": status_text
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

def get_latest_active_order_id(customer_id):
    # Trạng thái được coi là "đã hoàn thành/kết thúc" cần loại bỏ
    finished_statuses = ["Đang giao", "Đang xử lí"]

    # Truy vấn đơn hàng mới nhất của khách hàng
    # Join với OrderStatus để kiểm tra trạng thái hiện tại
    latest_order = db.session.query(Order) \
        .join(OrderStatus, Order.order_id == OrderStatus.order_id) \
        .filter(Order.customer_id == customer_id) \
        .filter(~OrderStatus.status.in_(finished_statuses)) \
        .order_by(Order.created_at.desc()) \
        .first()

    return latest_order.order_id if latest_order else None