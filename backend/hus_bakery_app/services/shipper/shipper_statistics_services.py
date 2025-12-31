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

from sqlalchemy import desc, func

def get_shipper_all_order_history(shipper_id, page=1, limit=10):
    # 1. Tạo Query cơ sở (chưa thực thi .all())
    query = db.session.query(Order).join(
        OrderStatus, Order.order_id == OrderStatus.order_id
    ).filter(
        Order.shipper_id == shipper_id,
        OrderStatus.status == "Đã giao"
    ).order_by(desc(Order.created_at))

    # 2. Sử dụng paginate để chỉ lấy dữ liệu của trang hiện tại
    # error_out=False giúp trả về danh sách rỗng thay vì lỗi 404 nếu trang không tồn tại
    pagination = query.paginate(page=page, per_page=limit, error_out=False)

    history_list = []

    # Duyệt qua các item trong trang hiện tại (pagination.items)
    for order in pagination.items:
        # a. Đếm số món trong đơn
        item_count = db.session.query(func.count(OrderItem.order_item_id))\
            .filter(OrderItem.order_id == order.order_id).scalar() or 0

        # b. Lấy Rating từ bảng ShipperReview theo order_id
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
            "created_at": order.created_at.isoformat() if order.created_at else None
        })

    # 3. Trả về dữ liệu kèm thông tin phân trang
    return {
        "data": history_list,
        "pagination": {
            "total_records": pagination.total,    # Tổng số đơn hàng trong DB
            "total_pages": pagination.pages,      # Tổng số trang
            "current_page": pagination.page,      # Trang hiện tại
            "per_page": pagination.per_page       # Số lượng mỗi trang
        }
    }