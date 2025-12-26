import requests
import math
from datetime import datetime
from sqlalchemy import desc
from hus_bakery_app import db

# Models
from hus_bakery_app.models.order import Order
from hus_bakery_app.models.order_item import OrderItem
from hus_bakery_app.models.cart_item import CartItem
from hus_bakery_app.models.products import Product
from hus_bakery_app.models.branches import Branch
from hus_bakery_app.models.shipper import Shipper
from hus_bakery_app.models.coupon import Coupon
from hus_bakery_app.models.coupon_custom import CouponCustomer
from hus_bakery_app.models.branch_product import BranchProduct


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
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def find_best_branch(customer_lat, customer_lng, required_product_ids):
    """
    Tìm chi nhánh:
    1. Có đủ tất cả product_id yêu cầu.
    2. Gần khách hàng nhất.
    """
    # Lấy tất cả chi nhánh có tọa độ
    all_branches = Branch.query.filter(Branch.lat.isnot(None), Branch.lng.isnot(None)).all()

    valid_branches = []

    for branch in all_branches:
        # Kiểm tra xem chi nhánh này có bán TẤT CẢ sản phẩm trong giỏ không
        # Query bảng BranchProduct xem branch_id này có bao nhiêu sản phẩm khớp với list yêu cầu
        count_products = BranchProduct.query.filter(
            BranchProduct.branch_id == branch.branch_id,
            BranchProduct.product_id.in_(required_product_ids)
        ).count()

        # Nếu số lượng sản phẩm tìm thấy trong kho bằng số lượng sản phẩm yêu cầu -> Đủ hàng
        if count_products == len(required_product_ids):
            # Tính khoảng cách
            dist = haversine(customer_lat, customer_lng, branch.lat, branch.lng)
            valid_branches.append({
                "branch": branch,
                "distance": dist
            })

    # Nếu không có chi nhánh nào đủ hàng
    if not valid_branches:
        return None, None

    # Sắp xếp theo khoảng cách (Gần nhất lên đầu)
    valid_branches.sort(key=lambda x: x["distance"])

    # Trả về chi nhánh tốt nhất (index 0) và khoảng cách
    best_option = valid_branches[0]
    return best_option["branch"], best_option["distance"]

# --- SECTION B: CLIENT ORDER CREATION ---
def create_order(customer_id, recipient_name, shipping_address, customer_lat, customer_lng, coupon_id=None):
    # --- 1. Xử lý tọa độ ---
    if not customer_lat or not customer_lng:
        # Giả sử bạn đã có hàm geocode
        customer_lat, customer_lng = geocode_address(shipping_address)
        if not customer_lat:
            return None, "Không thể xác định tọa độ từ địa chỉ giao hàng"

    # --- 2. Lấy item trong giỏ hàng ---
    selected_items = CartItem.query.filter_by(customer_id=customer_id, selected=True).all()
    if not selected_items:
        return None, "Giỏ hàng rỗng hoặc chưa chọn sản phẩm để thanh toán"

    # Tạo list các ID sản phẩm cần mua để check kho
    # Lưu ý: Set dùng để loại bỏ ID trùng lặp nếu khách mua 2 dòng cùng 1 loại bánh
    required_product_ids = {item.product_id for item in selected_items}

    # --- 3. TÌM CHI NHÁNH TỐI ƯU (Logic mới) ---
    nearest_branch, distance_km = find_best_branch(customer_lat, customer_lng, required_product_ids)

    if not nearest_branch:
        return None, "Rất tiếc, không có chi nhánh nào gần bạn có đủ các loại bánh bạn chọn."

    # --- 4. Tính tiền hàng (Subtotal) ---
    subtotal = 0
    for item in selected_items:
        product = Product.query.get(item.product_id)
        if product:
            # Lưu ý: Cần đảm bảo kiểu dữ liệu (float/Decimal) khớp nhau
            subtotal += float(product.unit_price if hasattr(product, 'unit_price') else product.price) * item.quantity

    # --- 5. Tính Mã giảm giá ---
    discount = 0
    if coupon_id:
        cc = CouponCustomer.query.filter_by(customer_id=customer_id, coupon_id=coupon_id, status="unused").first()
        if cc:
            coupon = Coupon.query.get(coupon_id)
            # Logic check điều kiện coupon...
            if subtotal >= coupon.min_purchase:
                if coupon.discount_type == "percent":
                    discount = subtotal * (float(coupon.discount_percent) / 100)
                    if coupon.max_discount:
                        discount = min(discount, float(coupon.max_discount))
                else:
                    discount = float(coupon.discount_value)

                # Đánh dấu coupon đã dùng
                cc.status = "used"
                cc.used_at = datetime.now()
            else:
                return None, f"Đơn hàng chưa đạt giá trị tối thiểu để dùng mã giảm giá"
        else:
            return None, "Mã giảm giá không hợp lệ hoặc đã qua sử dụng"

    # --- 6. Tính phí ship dựa trên khoảng cách thực tế ---
    # Ví dụ: 5000 VNĐ / 1 km
    shipping_fee = distance_km * 5000
    total_amount = subtotal - discount + shipping_fee

    # --- 7. Tìm Shipper tại chi nhánh đó (Optional) ---
    shipper = Shipper.query.filter_by(branch_id=nearest_branch.branch_id, status="active").first()
    # Nếu có shipper thì set bận, không có thì để order đó pending shipper sau
    if shipper:
        shipper.status = "busy"

    # --- 8. Lưu Order vào DB ---
    try:
        new_order = Order(
            customer_id=customer_id,
            branch_id=nearest_branch.branch_id,  # Gán đơn cho chi nhánh tìm được
            shipper_id=shipper.shipper_id if shipper else None,
            shipping_address=shipping_address,
            recipient_name=recipient_name,
            total_amount=total_amount,  # Check lại tên cột trong model (total_amount hay total_money)
            created_at=datetime.now(),
            payment_method="COD",  # Hoặc lấy từ tham số truyền vào
            status="pending"
        )
        db.session.add(new_order)
        db.session.flush()  # Để sinh order_id

        # --- 9. Lưu Order Items và Xóa Giỏ hàng ---
        for item in selected_items:
            product = Product.query.get(item.product_id)
            order_item = OrderItem(
                order_id=new_order.order_id,
                product_id=item.product_id,
                quantity=item.quantity,
                price=product.unit_price  # Lưu giá tại thời điểm mua
            )
            db.session.add(order_item)
            db.session.delete(item)  # Xóa khỏi giỏ

        db.session.commit()
        return new_order, "Đặt hàng thành công! Đơn hàng đã được chuyển đến cửa hàng gần nhất."

    except Exception as e:
        db.session.rollback()
        print(f"Error creating order: {e}")
        return None, "Lỗi hệ thống khi tạo đơn hàng."


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
    items_query = db.session.query(OrderItem, Product) \
        .join(Product, OrderItem.product_id == Product.product_id) \
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


def calculate_shipping_preview(address, lat=None, lng=None):
    if not lat or not lng:
        lat, lng = geocode_address(address)

    if not lat:
        return None, "Địa chỉ không hợp lệ"

    branches = Branch.query.all()
    min_dist = 10 ** 9
    for b in branches:
        dist = haversine(lat, lng, b.lat, b.lng)
        if dist < min_dist:
            min_dist = dist

    shipping_fee = min_dist * 5000  # 5k/km
    return {
        "lat": lat,
        "lng": lng,
        "distance": round(min_dist, 2),
        "shipping_fee": round(shipping_fee, -3)  # Làm tròn đến nghìn
    }, None