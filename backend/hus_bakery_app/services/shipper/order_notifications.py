from hus_bakery_app import db
from hus_bakery_app.models.order import Order
from hus_bakery_app.models.order_status import OrderStatus
from sqlalchemy import desc


def check_new_order_for_shipper(shipper_id):
    """
    Lấy danh sách các đơn hàng đang được gán cho Shipper (chưa hoàn thành).
    Trả về danh sách thông báo để hiển thị xếp chồng lên nhau.
    """

    # 1. Query lấy TẤT CẢ các đơn hàng (dùng .all() thay vì .first())
    # Điều kiện: Shipper ID khớp + Trạng thái chưa xong (Hoàn thành/Đã hủy/Từ chối)
    active_orders = db.session.query(Order).join(
        OrderStatus, Order.order_id == OrderStatus.order_id
    ).filter(
        Order.shipper_id == shipper_id,
        ~OrderStatus.status.in_(["Hoàn thành", "Đã hủy", "Từ chối"])
    ).order_by(desc(Order.created_at)).all()

    notifications = []

    # 2. Duyệt qua từng đơn hàng tìm thấy để tạo thông báo
    for order in active_orders:
        notifications.append({
            "id": f"noti_{order.order_id}",  # ID giả lập
            "order_id": order.order_id,

            # Nội dung text y hệt trong ảnh bạn gửi
            "message": "Bạn vừa có đơn hàng cần giao , vui lòng kiểm tra đơn hàng 📦",

            "created_at": order.created_at.strftime("%H:%M %d/%m/%Y") if order.created_at else "",
            "is_read": False  # Luôn coi là mới để hiện đậm
        })

    return notifications

def get_current_order(shipper_id):
    # Truy vấn lấy đơn hàng và trạng thái hiện tại
    result = db.session.query(Order.order_id, OrderStatus.status)\
        .join(OrderStatus, Order.order_id == OrderStatus.order_id)\
        .filter(
            Order.shipper_id == shipper_id,
            ~OrderStatus.status.in_(["Đang xử lí", "Đang giao", "Đã giao"])
        )\
        .order_by(desc(Order.created_at))\
        .first()

    if result:
        return {
            "order_id": result.order_id,
            "status": result.status
        }
    return None