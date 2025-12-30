from hus_bakery_app import db
from hus_bakery_app.models.customer_notifications import CustomerNotification
from hus_bakery_app.models.order import Order
from hus_bakery_app.models.order_status import OrderStatus
from sqlalchemy import desc

def check_pending_reviews_for_customer(customer_id):
    """
    Lấy danh sách các đơn hàng chờ khách hàng đánh giá.
    Trả về created_at dưới dạng đối tượng datetime gốc.
    """
    pending_notifications = CustomerNotification.query.filter_by(
        customer_id=customer_id,
        is_read=False
    ).order_by(desc(CustomerNotification.created_at)).all()

    notifications = []

    for noti in pending_notifications:
        notifications.append({
            "id": noti.id,
            "order_id": noti.order_id,
            "message": "Bạn có đơn hàng chưa đánh giá, hãy chia sẻ cảm nhận nhé! ⭐",
            "created_at": noti.created_at,
            "note": noti.order.note if noti.order else "",
            "is_read": False
        })

    return notifications

def mark_customer_notification_read(order_id):
    """
    Đánh dấu thông báo đã đọc dựa trên order_id.
    """
    notification = CustomerNotification.query.filter_by(order_id=order_id, is_read=False).first()
    if notification:
        notification.is_read = True
        db.session.commit()
        return True
    return False

def get_new_success_order_notification(customer_id):
    latest_order = db.session.query(Order, OrderStatus.status)\
        .join(OrderStatus, Order.order_id == OrderStatus.order_id)\
        .filter(Order.customer_id == customer_id)\
        .order_by(desc(OrderStatus.updated_at)).first()

    if latest_order:
        order_obj, current_status = latest_order

        if current_status == "Đã giao":
            return {
                "order_id": order_obj.order_id,
                "status": current_status,
                "message": f"Đơn hàng #{order_obj.order_id} đã giao thành công! Chúc bạn ngon miệng. ❤️",
                "can_review": True
            }

    return None

from sqlalchemy import desc

def get_all_success_order_notifications(customer_id):
    # 1. Truy vấn tất cả các đơn hàng có trạng thái "Đã giao" của khách hàng này
    success_orders = db.session.query(Order, OrderStatus.status)\
        .join(OrderStatus, Order.order_id == OrderStatus.order_id)\
        .filter(Order.customer_id == customer_id)\
        .filter(OrderStatus.status == "Đã giao")\
        .order_by(desc(OrderStatus.updated_at)).all()

    # 2. Tạo một danh sách trống để chứa các thông báo
    notifications = []

    # 3. Duyệt qua từng bản ghi trả về từ Database
    for order_obj, current_status in success_orders:
        # Với mỗi đơn hàng, tạo một dictionary thông báo
        notif_data = {
            "order_id": order_obj.order_id,
            "status": current_status,
            "message": f"Đơn hàng #{order_obj.order_id} đã giao thành công! Chúc bạn ngon miệng. ❤️",
            "can_review": True,
            "created_at": order_obj.created_at # Bạn có thể lấy thêm thời gian nếu muốn
        }
        # Thêm vào danh sách tổng
        notifications.append(notif_data)

    # 4. Trả về toàn bộ danh sách (nếu không có đơn nào sẽ trả về danh sách rỗng [])
    return notifications
