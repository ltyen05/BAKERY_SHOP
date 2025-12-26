from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
from hus_bakery_app.services.shipper.order_notifications import check_new_order_for_shipper

# Tạo Blueprint với tên trùng với folder để dễ quản lý
shipper_notifications_bp = Blueprint("shipper_notifications", __name__)


@shipper_notifications_bp.route("/notifications", methods=["GET"])
@jwt_required()
def api_get_shipper_notifications():
    # 1. Lấy ID Shipper từ Token
    identity_str = get_jwt_identity()
    try:
        # Xử lý an toàn cho cả dạng chuỗi JSON lẫn Dict
        if isinstance(identity_str, str):
            identity = json.loads(identity_str)
        else:
            identity = identity_str

        current_shipper_id = identity.get("id")
        role = identity.get("role")
    except Exception:
        return jsonify({"status": "fail", "message": "Token lỗi"}), 401

    # Check quyền Shipper
    if role != "shipper":
        return jsonify({"status": "fail", "message": "Không có quyền truy cập"}), 403

    # 2. Gọi Service lấy danh sách thông báo
    data = check_new_order_for_shipper(current_shipper_id)

    # 3. Trả về kết quả
    return jsonify({
        "status": "success",
        "count": len(data),
        "data": data
    }), 200