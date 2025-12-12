from datetime import datetime
from .. import db
from ..models.feed_back import Feedback
from ..models.order import Order  # Import Order để lấy thông tin đơn hàng gốc


def create_feedback(user_id, order_id, rating, comment):
    # 1. Tìm đơn hàng trong Database
    order = Order.query.filter_by(order_id=order_id).first()

    if not order:
        return False, "Đơn hàng không tồn tại."

    # 2. BẢO MẬT: Kiểm tra đơn hàng này có phải của User đang đăng nhập không?
    # (Giả sử model Order có cột customer_id)
    if order.customer_id != user_id:
        return False, "Bạn không có quyền đánh giá đơn hàng của người khác."

    # 3. Kiểm tra xem đã đánh giá chưa
    # Vì order_id là Primary Key trong bảng Feedback nên check rất nhanh
    existing_feedback = Feedback.query.filter_by(order_id=order_id).first()
    if existing_feedback:
        return False, "Bạn đã đánh giá đơn hàng này rồi."

    # 4. Lưu Feedback
    # QUAN TRỌNG: Lấy branch_id từ chính đơn hàng (order.branch_id)
    # Model Feedback của bạn yêu cầu branch_id, nên bước này rất quan trọng
    new_feedback = Feedback(
        order_id=order_id,
        branch_id=order.branch_id,
        rating=rating,
        comment=comment
        # created_at sẽ tự tạo nếu bạn set default=datetime.now trong Model
    )
    # Nếu model chưa set default time thì thêm dòng này:
    new_feedback.created_at = datetime.now()

    try:
        db.session.add(new_feedback)
        db.session.commit()
        return True, "Cảm ơn bạn đã đánh giá!"
    except Exception as e:
        db.session.rollback()
        return False, f"Lỗi hệ thống: {str(e)}"