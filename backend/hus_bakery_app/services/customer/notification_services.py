from hus_bakery_app import db
from hus_bakery_app.models.customer_notifications import CustomerNotification
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
            # Giữ nguyên đối tượng datetime, không dùng .strftime()
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