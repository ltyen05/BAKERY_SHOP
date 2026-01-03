from hus_bakery_app import db
from sqlalchemy import func
from werkzeug.security import generate_password_hash
from hus_bakery_app.models.shipper import Shipper
from hus_bakery_app.models.order import Order
from hus_bakery_app.models.order_status import OrderStatus
from hus_bakery_app.models.shipper_review import ShipperReview


def get_all_shippers_service(branch_id):
    """Lấy danh sách shipper thuộc chi nhánh quản lý"""
    return Shipper.query.filter_by(branch_id=branch_id).all()

def add_shipper_service(data, branch_id):
    """Thêm shipper và tự động gán chi nhánh của người quản lý"""
    new_shipper = Shipper(
        name=data.get('name'),
        phone=data.get('phone'),
        email=data.get('email'),
        branch_id=branch_id,
        salary=data.get("salary")
    )
    new_shipper.set_password(data.get('password'))
    new_shipper.status = data.get('status', 'active')
    db.session.add(new_shipper)
    db.session.commit()
    return new_shipper

def edit_shipper_service(shipper_id, branch_id, data):
    """Cập nhật shipper chỉ khi thuộc chi nhánh quản lý"""
    shipper = Shipper.query.filter_by(shipper_id=shipper_id, branch_id=branch_id).first()
    if shipper:
        shipper.name = data.get('name', shipper.name)
        shipper.phone = data.get('phone', shipper.phone)
        shipper.email = data.get('email', shipper.email)
        shipper.status = data.get('status', shipper.status)
        if data.get('password'):
            shipper.password = generate_password_hash(data.get('password'))
        db.session.commit()
        return shipper
    return None

def delete_shipper_service(shipper_id, branch_id):
    """Xóa shipper chỉ khi thuộc chi nhánh quản lý"""
    shipper = Shipper.query.filter_by(shipper_id=shipper_id, branch_id=branch_id).first()
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