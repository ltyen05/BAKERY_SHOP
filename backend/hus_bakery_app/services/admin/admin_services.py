from hus_bakery_app import db
from hus_bakery_app.models.order import Order
from hus_bakery_app.models.order_item import OrderItem
from hus_bakery_app.models.products import Product
from hus_bakery_app.models.shipper import Shipper
from sqlalchemy import desc


# 1. Lấy danh sách toàn bộ đơn hàng (Có lọc và phân trang)
def get_all_orders_service(status=None, page=1, per_page=10):
    query = Order.query

    # Nếu có lọc theo trạng thái (vd: chỉ xem đơn pending)
    if status:
        query = query.filter_by(status=status)

    # Luôn sắp xếp đơn mới nhất lên đầu
    query = query.order_by(desc(Order.created_at))

    # Phân trang
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    orders = pagination.items

    # Format dữ liệu đẹp để trả về FE
    result = []
    for order in orders:
        result.append({
            "order_id": order.order_id,
            "customer_name": order.recipient_name,  # Hoặc lấy từ bảng Customer nếu cần
            "total_money": float(order.total_money),
            "status": order.status,
            "created_at": order.created_at.strftime('%Y-%m-%d %H:%M'),
            "shipper_id": order.shipper_id,
            "address": order.shipping_address
        })

    return {
        "orders": result,
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": page
    }


# 2. Xem chi tiết một đơn hàng (Kèm danh sách món ăn)
def get_order_detail_service(order_id):
    order = Order.query.get(order_id)
    if not order:
        return None, "Không tìm thấy đơn hàng"

    # Lấy danh sách món trong đơn
    items = []
    # Giả sử bạn có relationship order.items hoặc query thủ công:
    order_items = OrderItem.query.filter_by(order_id=order_id).all()

    for item in order_items:
        product = Product.query.get(item.product_id)
        items.append({
            "product_name": product.name if product else "Sản phẩm đã xóa",
            "quantity": item.quantity,
            "price": float(item.price),  # Giá tại thời điểm mua
            "image": product.image if product else None
        })

    data = {
        "order_id": order.order_id,
        "status": order.status,
        "recipient_name": order.recipient_name,
        "phone": order.phone,  # Giả sử model Order có lưu sđt nhận hàng
        "address": order.shipping_address,
        "total_money": float(order.total_money),
        "note": order.note,
        "items": items,
        "shipper_id": order.shipper_id
    }
    return data, None


# 3. Cập nhật trạng thái đơn (Duyệt đơn / Hủy đơn)
def update_order_status_service(order_id, new_status):
    order = Order.query.get(order_id)
    if not order:
        return False, "Đơn hàng không tồn tại"

    # Có thể thêm logic kiểm tra: Không cho chuyển từ 'completed' về 'pending'
    order.status = new_status
    db.session.commit()
    return True, "Cập nhật trạng thái thành công"


# 4. Gán Shipper cho đơn hàng
def assign_shipper_service(order_id, shipper_id):
    order = Order.query.get(order_id)
    if not order:
        return False, "Đơn hàng không tồn tại"

    shipper = Shipper.query.get(shipper_id)
    if not shipper:
        return False, "Shipper không tồn tại"

    order.shipper_id = shipper_id
    # Thường khi gán shipper xong thì status chuyển thành 'shipping' luôn
    order.status = 'shipping'

    db.session.commit()
    return True, f"Đã gán đơn cho shipper {shipper.full_name}"