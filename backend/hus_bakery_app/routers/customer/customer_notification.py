from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
from hus_bakery_app.services.customer.notification_services import (
    check_pending_reviews_for_customer,
    mark_customer_notification_read,
    get_new_success_order_notification
)

customer_noti_bp = Blueprint("customer_noti", __name__)


@customer_noti_bp.route("/pending-reviews", methods=["GET"])
@jwt_required()
def get_pending_reviews():
    # Lấy thông tin khách hàng từ Token
    identity = json.loads(get_jwt_identity())
    customer_id = identity["id"]

    # Gọi hàm service bạn đã viết
    notifications = check_pending_reviews_for_customer(customer_id)

    return jsonify({
        "success": True,
        "data": notifications
    }), 200

@customer_noti_bp.route("/mark-read/<int:order_id>", methods=["POST"])
@jwt_required()
def mark_as_read(order_id):
    """
    API để Frontend gọi sau khi khách hàng nhấn vào đơn hàng hoặc hoàn tất đánh giá.
    """
    success = mark_customer_notification_read(order_id)
    if success:
        return jsonify({"success": True, "message": "Đã đánh dấu đã đọc"}), 200
    return jsonify({"success": False, "message": "Không tìm thấy thông báo"}), 404


@customer_noti_bp.route("/check-latest-success", methods=["GET"])
@jwt_required()
def check_latest_success():
    identity = json.loads(get_jwt_identity())
    customer_id = identity["customer_id"]

    order_notification = get_new_success_order_notification(customer_id)

    if order_notification:
        return jsonify({
            "success": True,
            "data": order_notification
        }), 200

    return jsonify({
        "success": False,
        "message": "Không có đơn hàng mới hoàn thành"
    }), 200