from hus_bakery_app import db
from hus_bakery_app.models.coupon import Coupon


def get_all_coupons_service():
    # Lấy toàn bộ danh sách mã giảm giá
    return Coupon.query.all()


def add_coupon_service(data):
    # Khởi tạo Coupon mới dựa trên dữ liệu từ Frontend
    new_coupon = Coupon(
        coupon_id=data.get('coupon_id'),
        description=data.get('description'),
        discount_percent=data.get('discount_percent'),
        discount_value=data.get('discount_value'),
        discount_type=data.get('discount_type'),
        min_purchase=data.get("min_purschase"),
        max_discount=data.get("discount"),
        begin_date=data.get('begin_date'),
        end_date=data.get('end_date'),
        status=data.get("status"),
        used_count=data.get("used_count"),
        created_at=data.get("created_at")
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
        coupon.discount_value = data.get('discount_value', coupon.discount_value)
        coupon.begin_date = data.get('begin_date', coupon.begin_date)
        coupon.end_date = data.get('end_date', coupon.end_date)
        coupon.status = data.get('status', coupon.status)

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