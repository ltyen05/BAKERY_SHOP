import requests
import math
from datetime import datetime
from sqlalchemy import desc
from .. import db

# Models
from ..models.order import Order
from ..models.order_item import OrderItem
from ..models.cart_item import CartItem
from ..models.products import Product
from ..models.branch import Branch
from ..models.shipper import Shipper
from ..models.coupon import Coupon
from ..models.coupon_custom import CouponCustomer

# --- SECTION A: UTILS & HELPERS ---
def geocode_address(address):
    try:
        url = "https://nominatim.openstreetmap.org/search"
        params = {"q": address, "format": "json", "limit": 1}
        res = requests.get(url, params=params, headers={"User-Agent": "Mozilla/5.0"}, timeout=5)
        data = res.json()
        if not data: return None, None
        return float(data[0]["lat"]), float(data[0]["lon"])
    except:
        return None, None

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

# --- SECTION B: CLIENT ORDER CREATION ---
def create_order(customer_id, recipient_name, shipping_address, customer_lat, customer_lng, coupon_id=None):
    # 1. Xử lý tọa độ
    if not customer_lat or not customer_lng:
        customer_lat, customer_lng = geocode_address(shipping_address)
        if not customer_lat:
            return None, "Không thể tìm tọa độ từ địa chỉ"

    # 2. Lấy item trong giỏ
    selected_items = CartItem.query.filter_by(customer_id=customer_id, selected=True).all()
    if not selected_items:
        return None, "Giỏ hàng rỗng hoặc chưa chọn sản phẩm"

    # 3. Tính tiền
    subtotal = 0
    for item in selected_items:
        product = Product.query.get(item.product_id)
        if product:
            subtotal += float(product.price) * item.quantity

    # 4. Tính mã giảm giá
    discount = 0
    if coupon_id:
        cc = CouponCustomer.query.filter_by(customer_id=customer_id, coupon_id=coupon_id, status="unused").first()
        if cc:
            coupon = Coupon.query.get(coupon_id)
            if subtotal >= coupon.min_purchase:
                if coupon.discount_type == "percent":
                    discount = subtotal * (coupon.discount_percent / 100)
                    if coupon.max_discount: discount = min(discount, coupon.max_discount)
                else:
                    discount = coupon.discount_value
                
                # Update Coupon status
                cc.status = "used"
                cc.used_at = datetime.now()
            else:
                return None, f"Đơn hàng chưa đạt tối thiểu {coupon.min_purchase}"
        else:
            return None, "Mã giảm giá không hợp lệ"

    # 5. Tính phí ship (Tìm branch gần nhất)
    branches = Branch.query.all()
    nearest_branch = None
    min_dist = 10**9

    for b in branches:
        if b.lat and b.lng:
            dist = haversine(customer_lat, customer_lng, b.lat, b.lng)
            if dist < min_dist:
                min_dist = dist
                nearest_branch = b
    
    if not nearest_branch:
        return None, "Không tìm thấy cửa hàng nào gần bạn"

    shipping_fee = min_dist * 5000
    total_amount = subtotal - discount + shipping_fee

    # 6. Tìm Shipper (Optional)
    shipper = Shipper.query.filter_by(branch_id=nearest_branch.branch_id, status="active").first()
    if shipper:
        shipper.status = "busy"

    # 7. Lưu Order
    try:
        new_order = Order(
            customer_id=customer_id,
            branch_id=nearest_branch.branch_id,
            shipper_id=shipper.shipper_id if shipper else None,
            shipping_address=shipping_address,
            recipient_name=recipient_name,
            total_money=total_amount, # Lưu ý: check lại tên cột trong DB là total_money hay total_amount
            created_at=datetime.now(),
            status="pending"
        )
        db.session.add(new_order)
        db.session.flush() # Để lấy order_id ngay

        # 8. Lưu Order Items và Xóa Cart
        for item in selected_items:
            product = Product.query.get(item.product_id)
            order_item = OrderItem(
                order_id=new_order.order_id,
                product_id=item.product_id,
                quantity=item.quantity,
                price=product.price
            )
            db.session.add(order_item)
            db.session.delete(item)

        db.session.commit()
        return new_order, "Đặt hàng thành công"
    except Exception as e:
        db.session.rollback()
        print(e)
        return None, "Lỗi hệ thống khi tạo đơn"

# --- SECTION C: ADMIN ORDER MANAGEMENT (Đã di chuyển từ cart_services sang đây) ---

def get_all_orders_service(status=None, page=1, per_page=10):
    query = Order.query
    if status:
        query = query.filter_by(status=status)
    query = query.order_by(desc(Order.created_at))
    
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    result = []
    for order in pagination.items:
        result.append({
            "order_id": order.order_id,
            "customer_name": order.recipient_name,
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

def get_order_detail_service(order_id):
    order = Order.query.get(order_id)
    if not order: return None, "Không tìm thấy đơn hàng"

    # Query items tối ưu hơn dùng loop
    items_query = db.session.query(OrderItem, Product)\
        .join(Product, OrderItem.product_id == Product.product_id)\
        .filter(OrderItem.order_id == order_id).all()
        
    items = []
    for oi, p in items_query:
        items.append({
            "product_name": p.name,
            "quantity": oi.quantity,
            "price": float(oi.price),
            "image": p.image
        })

    return {
        "order_id": order.order_id,
        "status": order.status,
        "recipient_name": order.recipient_name,
        "address": order.shipping_address,
        "total_money": float(order.total_money),
        "note": order.note,
        "items": items,
        "shipper_id": order.shipper_id
    }, None

def update_order_status_service(order_id, new_status):
    order = Order.query.get(order_id)
    if not order: return False, "Order not found"
    order.status = new_status
    db.session.commit()
    return True, "Updated"

def assign_shipper_service(order_id, shipper_id):
    order = Order.query.get(order_id)
    shipper = Shipper.query.get(shipper_id)
    if not order or not shipper: return False, "Data invalid"
    
    order.shipper_id = shipper_id
    order.status = 'shipping'
    db.session.commit()
    return True, f"Assigned to {shipper.full_name}"