from sqlalchemy import func, desc
from hus_bakery_app import db
from hus_bakery_app.models.order import Order
from hus_bakery_app.models.order_item import OrderItem
from hus_bakery_app.models.order_status import OrderStatus
from hus_bakery_app.models.shipper_review import ShipperReview


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
        OrderStatus.status == "Đã giao"  # Sửa lại nếu DB lưu chuỗi khác (VD: "completed")
    ).scalar()
    return count if count else 0


# 3. Hàm đếm đơn thất bại (Hủy / Từ chối / Không thành công)
def count_failed_orders(shipper_id):
    count = db.session.query(func.count(Order.order_id)) \
        .join(OrderStatus, Order.order_id == OrderStatus.order_id) \
        .filter(
        Order.shipper_id == shipper_id,
        OrderStatus.status.in_(["Không thành công"])
    ).scalar()
    return count if count else 0


# 4. Hàm tính điểm đánh giá trung bình
def calculate_avg_rating(shipper_id):
    avg = db.session.query(func.avg(ShipperReview.rating)) \
        .filter(ShipperReview.shipper_id == shipper_id).scalar()

    # Làm tròn 1 chữ số thập phân (VD: 4.8)
    return round(float(avg), 1) if avg else 0.0

def get_shipper_all_order_history(shipper_id, page, per_page):
    finished_status = ["Đã giao", "Không thành công"]
    query = db.session.query(Order).join(
        OrderStatus, Order.order_id == OrderStatus.order_id
    ).filter(
        Order.shipper_id == shipper_id,
        OrderStatus.status.in_(finished_status)
    ).order_by(desc(Order.created_at))

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    orders = pagination.items

    history_list = []

    for order in orders:
        item_count = db.session.query(func.count(OrderItem.order_item_id))\
            .filter(OrderItem.order_id == order.order_id).scalar() or 0

        # ✅ SỬA TẠI ĐÂY: Mặc định là None (hoặc 0) để Frontend hiện "--"
        rating_val = None 
        
        # Vì bảng shipper_reviews của bạn không có order_id, 
        # chúng ta chỉ nên lấy rating nếu đơn hàng này thực sự đã hoàn thành 
        # và tồn tại bản ghi đánh giá tương ứng.
        if order.customer_id:
            # Lưu ý: Nếu muốn chính xác tuyệt đối từng đơn, 
            # bạn nên thêm cột order_id vào bảng shipper_reviews trong SQL.
            review = ShipperReview.query.filter_by(
                shipper_id=shipper_id,
                customer_id=order.customer_id
            ).first()
            
            if review:
                rating_val = review.rating

        history_list.append({
            "order_id": order.order_id,
            "quantity_text": f"{item_count} sản phẩm",
            "total_amount": float(order.total_amount),
            "shipping_address": order.shipping_address,
            "status": "Đã giao" if order.order_id % 2 == 0 else "Không thành công", # Demo logic status
            "rating": rating_val, 
            "created_at": order.created_at.strftime("%d/%m/%Y")
        })

    return {
        "data": history_list,
        "pagination": {
            "total_records": pagination.total,
            "total_pages": pagination.pages,
            "current_page": page,
            "per_page": per_page
        }
    }