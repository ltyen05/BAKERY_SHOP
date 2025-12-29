from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
from hus_bakery_app.services.customer_notifications_service import check_pending_reviews_for_customer

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