from backend.hus_bakery_app import db
from backend.hus_bakery_app.models.coupon import Coupon


def get_all_coupons_service():
    # Lấy toàn bộ danh sách mã giảm giá
    return Coupon.query.all()


def add_coupon_service(data):
    # Khởi tạo Coupon mới dựa trên dữ liệu từ Frontend
    new_coupon = Coupon(
        coupon_id=data.get('coupon_id'),
        coupon_code=data.get('coupon_code'),
        discount_value=data.get('discount_value'),
        start_date=data.get('start_date'),
        end_date=data.get('end_date'),
        branch_id=data.get('branch_id')
    )
    # Trạng thái mặc định là 'active' nếu không truyền vào
    new_coupon.status = data.get('status', 'active')

    db.session.add(new_coupon)
    db.session.commit()
    return new_coupon


def edit_coupon_service(coupon_id, data):
    coupon = Coupon.query.get(coupon_id)
    if coupon:
        # Cập nhật các trường dựa trên tên biến trong Model coupon.py
        coupon.coupon_code = data.get('coupon_code', coupon.coupon_code)
        coupon.discount_value = data.get('discount_value', coupon.discount_value)
        coupon.start_date = data.get('start_date', coupon.start_date)
        coupon.end_date = data.get('end_date', coupon.end_date)
        coupon.status = data.get('status', coupon.status)
        coupon.branch_id = data.get('branch_id', coupon.branch_id)

        db.session.commit()
        return coupon
    return None


def delete_coupon_service(coupon_id):
    coupon = Coupon.query.get(coupon_id)
    if coupon:
        db.session.delete(coupon)
        db.session.commit()
        return True
    return False