import datetime
from hus_bakery_app.models.order_status import OrderStatus
from hus_bakery_app.models.order import Order
from hus_bakery_app.models.shipper import Shipper
from hus_bakery_app import db


def update_status_order(order_id, status):
    try:
        new_status = OrderStatus(
            order_id=order_id,
            status=status,
            updated_at=datetime.datetime.now()  # Cần dùng datetime.datetime.now()
        )
        db.session.add(new_status)

        if status == "Đã giao":
            order = Order.query.get(order_id)
            if order and order.shipper_id:
                shipper = Shipper.query.get(order.shipper_id)
                if shipper:
                    shipper.status = "Đang hoạt động"

        db.session.commit()
        return True, "Cập nhật trạng thái đơn hàng thành công"
    except Exception as e:
        db.session.rollback()
        return False, str(e)