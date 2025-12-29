import datetime
from hus_bakery_app.models.order_status import OrderStatus
from hus_bakery_app.models.shipper import Shipper
from hus_bakery_app.models.order import Order
from hus_bakery_app import db


def update_status_order(order_id, status):
    try:
        new_status = OrderStatus(
            order_id=order_id,
            status=status,
            updated_at=datetime.now()
        )
        if status == "Đã giao":
            order = db.session.get(Order, order_id)
            if order and order.shipper_id:
                shipper = db.session.get(Shipper, order.shipper_id)
                if shipper:
                    shipper.status = "Đang hoạt động"
            
        db.session.add(new_status)
        db.session.commit()
        return True, "Cập nhật trạng thái đơn hàng thành công"
    except Exception as e:
        db.session.rollback()
        return False, str(e)