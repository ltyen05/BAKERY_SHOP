import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ...services.customer.cart_services import (
    # add_to_cart,
    # update_selected,
    get_cart,
    coupon_of_customer,
    coupon_info,
    update_cart_service
)
from ...services.customer.order_services import create_order
from ...services.customer.order_services import create_order


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
    quantity = data.get("quantity")  # Có thể là số dương, số âm hoặc None
    selected = data.get("selected")  # Có thể là True, False hoặc None

    if not customer_id or not product_id:
        return jsonify({"error": "Missing ID"}), 400

    try:
        # Gọi 1 hàm duy nhất xử lý tất cả logic
        item = update_cart_service(customer_id, product_id, quantity, selected)

        return jsonify({
            "message": "Cart updated",
            "item": {
                "product_id": item.product_id,
                "quantity": item.quantity,
                "image": item.image_url      ,
                "selected": item.selected
            }
        }), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Internal Server Error"}), 500

# ==========================
# 4. GET COUPONS OF CUSTOMER
# ==========================
@order_bp.route("/my-coupons", methods=["GET"])
@jwt_required()
def my_coupons():
    identity_str = get_jwt_identity()
    identity = json.loads(identity_str)
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