from hus_bakery_app import db
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import desc, exists, func, and_
from hus_bakery_app.models.order import Order
from hus_bakery_app.models.order_status import OrderStatus
from sqlalchemy import desc

from hus_bakery_app.models.shipper_notifications import ShipperNotification


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

            "created_at": order.created_at if order.created_at else "",
            "is_read": False  # Luôn coi là mới để hiện đậm
        })

    return notifications


def get_current_order(shipper_id):
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

        order = (
            db.session.query(
                Order.order_id,
                latest_status.c.status
            )
            .join(latest_status, Order.order_id == latest_status.c.order_id)
            .filter(Order.shipper_id == shipper_id)
            .filter(latest_status.c.status != "Đã giao")
            .filter(latest_status.c.status != "Không thành công")
            .order_by(Order.created_at.desc())
            .first()
        )

        return order, None

    except SQLAlchemyError:
        db.session.rollback()
        return None, "Lỗi hệ thống"


def get_all_notifications_service(shipper_id):
    notifications = ShipperNotification.query.filter_by(shipper_id=shipper_id) \
        .order_by(ShipperNotification.created_at.desc()).all()

    result = []
    for noti in notifications:
        result.append({
            "id": noti.id,
            "customer_id": noti.customer_id,
            "order_id": noti.order_id,
            "is_read": noti.is_read,
            "created_at": noti.created_at
        })

    return result
