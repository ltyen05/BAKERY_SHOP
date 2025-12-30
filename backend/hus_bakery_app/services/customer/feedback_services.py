from datetime import datetime
from hus_bakery_app import db
from hus_bakery_app.models.feedback import Feedback
from hus_bakery_app.models.order import Order


# Bỏ tham số comment ở đây
def create_feedback(user_id, order_id, rating):
    order = Order.query.filter_by(order_id=order_id).first()

    if not order:
        return False, "Đơn hàng không tồn tại."

    if order.customer_id != user_id:
        return False, "Bạn không có quyền đánh giá đơn hàng của người khác."

    existing_feedback = Feedback.query.filter_by(order_id=order_id).first()
    if existing_feedback:
        return False, "Bạn đã đánh giá đơn hàng này rồi."

    new_feedback = Feedback(
        order_id=order_id,
        branch_id=order.branch_id,
        rating=rating
        # Đã xóa dòng comment=comment
    )

    new_feedback.created_at = datetime.now()

    try:
        db.session.add(new_feedback)
        db.session.commit()
        return True, "Cảm ơn bạn đã đánh giá!"
    except Exception as e:
        db.session.rollback()
        return False, f"Lỗi hệ thống: {str(e)}"