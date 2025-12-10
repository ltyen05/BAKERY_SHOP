import requests
from ..models.order import Order
from ..models.order_item import OrderItem
from ..models.cart_item import CartItem
from ..models.products import Product
from ..models.branch import Branch
from ..models.shipper import Shipper
from ..models.coupon import Coupon
from ..models.coupon_custom import CouponCustomer
from .. import db
from datetime import datetime
import math
from .cart_services import coupon_of_customer

# =============================
# Lấy tọa độ từ địa chỉ (FREE API)
# =============================
def geocode_address(address):
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": address,
        "format": "json",
        "limit": 1
    }

    res = requests.get(url, params=params, headers={"User-Agent": "Mozilla/5.0"})
    data = res.json()

    if not data:
        return None, None

    return float(data[0]["lat"]), float(data[0]["lon"])

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
    # Lấy tọa độ khách hàng từ địa chỉ
    customer_lat, customer_lng = geocode_address(shipping_address)
    if not customer_lat:
        return None, "Không thể tìm tọa độ từ địa chỉ"

    # lấy item được chọn
    selected_items = CartItem.query.filter_by(customer_id=customer_id, selected=True).all()

    if not selected_items:
        return None, "Không có sản phẩm nào được chọn"

    # Tính tổng tiền
    subtotal = 0
    for item in selected_items:
        product = Product.query.get(item.product_id)
        subtotal += float(product.price) * item.quantity

    discount = 0
    if coupon_id:
        cc = CouponCustomer.query.filter_by(
            customer_id=customer_id,
            coupon_id=coupon_id,
            status="unused"
        ).first()

        if not cc:
            return None, "Coupon không hợp lệ"

        coupon = Coupon.query.get(coupon_id)
        today = datetime.today().date()

        if subtotal < coupon.min_purchase:
            return None, f"Bạn phải mua tối thiểu {coupon.min_purchase} để dùng coupon"

        if coupon.discount_type == "percent":
            discount = subtotal * (coupon.discount_percent / 100)
            if coupon.max_discount:
                discount = min(discount, coupon.max_discount)
        else:
            discount = coupon.discount_value

        # Đánh dấu coupon đã dùng
        cc.status = "used"
        cc.used_at = datetime.now()

        # Tổng cuối sau giảm giá
    total = subtotal - discount

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

    shipping_fee = min_dist * 5000

    # Tìm shipper
    shipper = Shipper.query.filter_by(branch_id=nearest_branch.branch_id, status="active").first()
    if shipper:
        shipper.status = "busy"

    total = subtotal - discount + shipping_fee

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
        db.session.delete(item)

    db.session.commit()

    return order, "Đặt hàng thành công"
