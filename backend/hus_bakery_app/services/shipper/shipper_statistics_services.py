from sqlalchemy import func, desc
from hus_bakery_app import db
from hus_bakery_app.models.order import Order
from hus_bakery_app.models.order_status import OrderStatus
from hus_bakery_app.models.shipper_review import ShipperReview
from hus_bakery_app.models.order_item import OrderItem


# 1. Hàm đếm tổng số đơn hàng
def count_total_orders(shipper_id):
    count = db.session.query(func.count(Order.order_id)) \
        .filter(Order.shipper_id == shipper_id).scalar()
    return count if count else 0


# 2. Hàm đếm đơn thành công
def count_successful_orders(shipper_id):
    # Join OrderStatus để check trạng thái "Hoàn thành"
    count = db.session.query(func.count(Order.order_id)) \
        .join(OrderStatus, Order.order_id == OrderStatus.order_id) \
        .filter(
        Order.shipper_id == shipper_id,
        OrderStatus.status == "Hoàn thành"  # Sửa lại nếu DB lưu chuỗi khác (VD: "completed")
    ).scalar()
    return count if count else 0


# 3. Hàm đếm đơn thất bại (Hủy / Từ chối / Không thành công)
def count_failed_orders(shipper_id):
    count = db.session.query(func.count(Order.order_id)) \
        .join(OrderStatus, Order.order_id == OrderStatus.order_id) \
        .filter(
        Order.shipper_id == shipper_id,
        OrderStatus.status.in_(["Đã hủy", "Không thành công", "Từ chối"])
    ).scalar()
    return count if count else 0


# 4. Hàm tính điểm đánh giá trung bình
def calculate_avg_rating(shipper_id):
    avg = db.session.query(func.avg(ShipperReview.rating)) \
        .filter(ShipperReview.shipper_id == shipper_id).scalar()

    # Làm tròn 1 chữ số thập phân (VD: 4.8)
    return round(float(avg), 1) if avg else 0.0

def get_shipper_all_order_history(shipper_id):
    # 1. Query lấy toàn bộ đơn hàng "Đã giao" của Shipper này
    orders = db.session.query(Order).join(
        OrderStatus, Order.order_id == OrderStatus.order_id
    ).filter(
        Order.shipper_id == shipper_id,
        OrderStatus.status == "Đã giao"
    ).order_by(desc(Order.created_at)).all()

    history_list = []

    for order in orders:
        # a. Đếm số món trong đơn
        item_count = db.session.query(func.count(OrderItem.order_item_id))\
            .filter(OrderItem.order_id == order.order_id).scalar() or 0

        # b. Lấy Rating từ bảng ShipperReview theo order_id
        # Vì order_id hiện là Primary Key duy nhất của ShipperReview
        review = ShipperReview.query.get(order.order_id)
        rating_val = review.rating if review else 0

        # c. Format kết quả trả về
        history_list.append({
            "order_id": order.order_id,
            "quantity_text": f"{item_count} sản phẩm",
            "total_amount": float(order.total_amount),
            "shipping_address": order.shipping_address,
            "status": "Đã giao",
            "rating": rating_val,
        })

    return {
        "data": history_list,
        "total_records": len(history_list)
    }