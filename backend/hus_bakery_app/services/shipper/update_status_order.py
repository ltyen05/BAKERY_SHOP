import datetime
from hus_bakery_app.models.order_status import OrderStatus
from hus_bakery_app import db


def update_status_order(order_id, status):
    try:
        new_status = OrderStatus(
            order_id=order_id,
            status=status,
            updated_at=datetime.now()
        )
        db.session.add(new_status)
        db.session.commit()
        return True, "Cập nhật trạng thái đơn hàng thành công"
    except Exception as e:
        db.session.rollback()
        return False, str(e)