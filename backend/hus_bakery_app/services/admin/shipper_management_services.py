from sqlalchemy import func
from werkzeug.security import generate_password_hash
from hus_bakery_app import db
from hus_bakery_app.models.shipper import Shipper
from hus_bakery_app.models.order import Order
from hus_bakery_app.models.order_status import OrderStatus
from hus_bakery_app.models.shipper_review import ShipperReview

def get_all_shippers_service():
    return Shipper.query.all()

def add_shipper_service(data):
    new_shipper = Shipper(
        shipper_id=data.get('shipper_id'),
        shipper_name=data.get('name'),
        phone=data.get('phone'),
        email=data.get('email'),
        password=generate_password_hash(data.get('password')),
        branch_id=data.get('branch_id')
    )
    new_shipper.status = data.get('status', 'active')

    db.session.add(new_shipper)
    db.session.commit()
    return new_shipper

def edit_shipper_service(shipper_id, data):
    shipper = Shipper.query.get(shipper_id)
    if shipper:
        # Cập nhật các trường dựa trên tên biến trong Model shipper.py
        shipper.shipper_name = data.get('name', shipper.name)
        shipper.phone = data.get('phone', shipper.phone)
        shipper.email = data.get('email', shipper.email)
        shipper.status = data.get('status', shipper.status)
        shipper.branch_id = data.get('branch_id', shipper.branch_id)

        # Hash lại mật khẩu nếu có thay đổi
        if data.get('password'):
            shipper.set_password(data.get('password'))

        db.session.commit()
        return shipper
    return None

def delete_shipper_service(shipper_id):
    shipper = Shipper.query.get(shipper_id)
    if shipper:
        db.session.delete(shipper)
        db.session.commit()
        return True
    return False


def total_successful_order_of_shipper(shipper_id):
    total = (db.session.query(func.count(Order.order_id))
             .join(OrderStatus, Order.order_id == OrderStatus.order_id)
             .filter(Order.shipper_id == shipper_id)
             .filter(OrderStatus.status == 'Đã giao')
             .scalar())

    return total if total else 0

def star_of_shipper_service(shipper_id):
    star = db.session.query(func.avg(ShipperReview.rating)) \
        .filter(ShipperReview.shipper_id == shipper_id) \
        .scalar()
    return round(float(star), 1) if star else 0