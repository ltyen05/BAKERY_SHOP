from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.hus_bakery_app.models.order import Order
from backend.hus_bakery_app.services.customer.cart_services import (
    add_to_cart,
    update_selected,
    get_cart,
    coupon_of_customer,
    coupon_info
)
from backend.hus_bakery_app.services.customer.order_services import create_order, calculate_shipping_preview

order_bp = Blueprint("order_bp", __name__)

# ==========================
# 1. GET CART
# ==========================
@order_bp.route("/cart", methods=["GET"])
@jwt_required()
def api_get_cart(customer_id):
    identity = get_jwt_identity()
    customer_id = identity["id"]
    cart = get_cart(customer_id)
    return jsonify(cart), 200

@order_bp.route("/cart/manage", methods=["POST"])
def api_manage_cart():
    data = request.json
    customer_id = data.get("customer_id")
    product_id = data.get("product_id")

    # Lấy các trường tùy chọn (nếu không gửi thì để None)
    quantity = data.get("quantity")
    selected = data.get("selected")

    if not customer_id or not product_id:
        return jsonify({"error": "Missing customer_id or product_id"}), 400

    # Logic xử lý:
    # 1. Nếu có quantity -> Thực hiện thêm mới hoặc cập nhật số lượng
    # 2. Nếu có selected -> Thực hiện cập nhật trạng thái chọn

    item = None
    if quantity is not None:
        item = add_to_cart(customer_id, product_id, quantity)

    if selected is not None:
        item = update_selected(customer_id, product_id, selected)

    if not item:
        return jsonify({"error": "Failed to update cart. Item might not exist."}), 404

    return jsonify({
        "message": "Cart updated successfully",
        "product_id": item.product_id,
        "current_quantity": item.quantity,
        "is_selected": item.selected
    }), 200

# ==========================
# 4. GET COUPONS OF CUSTOMER
# ==========================
@order_bp.route("/my-coupons", methods=["GET"])
@jwt_required()
def my_coupons():
    identity = get_jwt_identity()
    customer_id = identity["id"]
    coupons = coupon_of_customer(customer_id)
    return jsonify(coupons), 200

# ==========================
# 5. GET COUPON INFO
# ==========================
@order_bp.route("/coupon/info/<int:coupon_id>", methods=["GET"])
def api_coupon_info(coupon_id):
    info = coupon_info(coupon_id)
    if not info:
        return jsonify({"error": "Invalid coupon"}), 400

    return jsonify(info), 200

# ==========================
# 6. CREATE ORDER
# ==========================
@order_bp.route("/order", methods=["POST"])
def api_create_order():
    data = request.json

    customer_id = data.get("customer_id")
    shipping_address = data.get("shipping_address")
    recipient_name = data.get("recipient_name")
    coupon_id = data.get("coupon_id")
    customer_lat = data.get("lat")
    customer_lng = data.get("lng")

    order, msg = create_order(
        customer_id,
        recipient_name,
        shipping_address,
        customer_lat,
        customer_lng,
        coupon_id
    )

    if not order:
        return jsonify({"error": msg}), 400

    return jsonify({
        "message": msg,
        "order_id": order.order_id
    }), 200

# API tính phí ship trước khi đặt
@order_bp.route("/order/preview-ship", methods=["POST"])
def api_preview_ship():
    data = request.json
    res, error = calculate_shipping_preview(data.get("address"), data.get("lat"), data.get("lng"))
    if error: return jsonify({"error": error}), 400
    return jsonify(res), 200

# API Lịch sử đơn hàng của khách
@order_bp.route("/order/history/<int:customer_id>", methods=["GET"])
def api_order_history(customer_id):
    orders = Order.query.filter_by(customer_id=customer_id).order_by(Order.created_at.desc()).all()
    # Serialize orders here...
    return jsonify([...]), 200