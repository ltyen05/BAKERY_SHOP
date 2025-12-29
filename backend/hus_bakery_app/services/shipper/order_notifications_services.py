from hus_bakery_app import db
from hus_bakery_app.models.order import Order
from hus_bakery_app.models.order_status import OrderStatus
from sqlalchemy import desc


def check_new_order_for_shipper(shipper_id):
    active_orders = db.session.query(Order).join(
        OrderStatus, Order.order_id == OrderStatus.order_id
    ).filter(
        Order.shipper_id == shipper_id,
        ~OrderStatus.status.in_(["Đã giao"])
    ).order_by(desc(Order.created_at)).all()

    notifications = []

    # 2. Duyệt qua từng đơn hàng tìm thấy để tạo thông báo
    for order in active_orders:
        notifications.append({
            "id": f"noti_{order.order_id}",  # ID giả lập
            "order_id": order.order_id,

            "message": "Bạn vừa có đơn hàng cần giao , vui lòng kiểm tra đơn hàng 📦",

            "created_at": order.created_at if order.created_at else "",
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