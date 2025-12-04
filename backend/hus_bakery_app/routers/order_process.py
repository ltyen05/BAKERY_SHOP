from flask import Blueprint, request, jsonify
from ..services.cart_services import (
    add_to_cart,
    update_selected,
    get_cart,
    coupon_of_customer,
    coupon_info
)
from ..services.order_services import create_order

order_bp = Blueprint("order_bp", __name__)


# ==========================
# 1. GET CART
# ==========================
@order_bp.route("/cart/<int:customer_id>", methods=["GET"])
def api_get_cart(customer_id):
    cart = get_cart(customer_id)
    return jsonify(cart), 200


# ==========================
# 2. ADD TO CART
# ==========================
@order_bp.route("/cart", methods=["POST"])
def api_add_to_cart():
    data = request.json
    customer_id = data.get("customer_id")
    product_id = data.get("product_id")
    quantity = data.get("quantity", 1)

    item = add_to_cart(customer_id, product_id, quantity)
    return jsonify({"message": "Added to cart", "item": item.product_id}), 200


# ==========================
# 3. UPDATE SELECTED ITEM
# ==========================
@order_bp.route("/cart/select", methods=["PUT"])
def api_update_selected():
    data = request.json
    customer_id = data.get("customer_id")
    product_id = data.get("product_id")
    selected = data.get("selected")

    item = update_selected(customer_id, product_id, selected)

    if not item:
        return jsonify({"error": "Item not found"}), 404

    return jsonify({"message": "Selection updated"}), 200


# ==========================
# 4. GET COUPONS OF CUSTOMER
# ==========================
@order_bp.route("/coupon/<int:customer_id>", methods=["GET"])
def api_coupon_of_customer(customer_id):
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
    coupon_id = data.get("coupon_id")  # ← FE gửi coupon đã chọn
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
