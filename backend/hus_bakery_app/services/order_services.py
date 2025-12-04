from ..models.order import Order
from ..models.order_item import OrderItem
from ..models.cart_item import CartItem
from ..models.product import Product
from ..models.branch import Branch
from ..models.shipper import Shipper
from ..models.coupon import Coupon
from ..models.coupon_custom import CouponCustomer
from .. import db
from datetime import datetime
import math

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

# ==========================
# Tạo đơn hàng
# ==========================
def create_order(customer_id, recipient_name, shipping_address, customer_lat, customer_lng, coupon_id=None):
    selected_items = CartItem.query.filter_by(customer_id=customer_id, selected=True).all()

    if not selected_items:
        return None, "Không có sản phẩm nào được chọn"

    # Tính tổng tiền
    total = 0
    for item in selected_items:
        product = Product.query.get(item.product_id)
        total += float(product.price) * item.quantity

    # Áp dụng coupon nếu có
    if coupon_id:
        coupon = Coupon.query.get(coupon_id)
        if coupon and coupon.discount_percent:
            discount = total * (coupon.discount_percent / 100)
            if coupon.max_discount:
                discount = min(discount, float(coupon.max_discount))
            total -= discount

        # Cập nhật đã dùng
        cc = CouponCustomer.query.filter_by(customer_id=customer_id, coupon_id=coupon_id).first()
        if cc:
            cc.status = "used"
            cc.used_at = datetime.now()

    # Tìm branch gần nhất
    branches = Branch.query.all()
    nearest_branch = None
    min_dist = 10**9

    for b in branches:
        if b.lat is None or b.lng is None:
            continue
        dist = haversine(customer_lat, customer_lng, b.lat, b.lng)
        if dist < min_dist:
            min_dist = dist
            nearest_branch = b

    # Tìm shipper
    shipper = Shipper.query.filter_by(branch_id=nearest_branch.branch_id, status="active").first()

    # Tạo Order
    order = Order(
        customer_id=customer_id,
        branch_id=nearest_branch.branch_id,
        shipper_id=shipper.shipper_id if shipper else None,
        shipping_address=shipping_address,
        recipient_name=recipient_name,
        total_amount=total,
        created_at=datetime.now()
    )
    db.session.add(order)
    db.session.commit()

    # Tạo order_items
    for item in selected_items:
        product = Product.query.get(item.product_id)
        order_item = OrderItem(
            order_id=order.order_id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=product.price
        )
        db.session.add(order_item)

        # Xóa item khỏi giỏ hàng sau khi đặt hàng
        db.session.delete(item)

    db.session.commit()

    return order, "Đặt hàng thành công"
