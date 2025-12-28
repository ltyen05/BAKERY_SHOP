import datetime
from hus_bakery_app.models.order_status import OrderStatus
from hus_bakery_app.models.shippers import Shipper

def update_status_order(shipper_id, order_id, status):
    os = OrderStatus(
            order_id=order_id,
            status=status,
            updated_at=datetime.now()
        )