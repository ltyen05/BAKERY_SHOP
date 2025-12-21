from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..services.account_services import update_profile, change_password, update_avatar
from ..models.customer import Customer
import json

account_bp = Blueprint("account", __name__)


@account_bp.route("/profile", methods=["GET", "PUT"])
@jwt_required()
def profile_api():
    identity_str = get_jwt_identity()  # Lúc này là chuỗi '{"id": 17, "role": "customer"}'

    try:
        # Chuyển từ chuỗi JSON ngược lại thành Dictionary
        identity = json.loads(identity_str)
        current_user_id = identity["id"]
    except Exception:
        # Phòng trường hợp Token cũ vẫn còn là dạng số
        current_user_id = identity_str

    user = Customer.query.get(current_user_id)
    if not user:
        return jsonify({"message": "Không tìm thấy người dùng"}), 404

    if request.method == "GET":
        return jsonify({
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "address": user.address,
            "avatar": f"/static/avatars/{user.avatar}" if user.avatar else None
        })

    # Xử lý PUT
    data = request.get_json()
    success, msg = update_profile(current_user_id, data)
    # Trả về key "message" để Frontend dễ đọc
    return jsonify({"message": msg}), (200 if success else 400)


@account_bp.route("/avatar", methods=["POST"])
@jwt_required()
def update_avatar_api():
    identity = get_jwt_identity()
    current_user_id = identity["id"]

    if "avatar" not in request.files:
        return jsonify({"message": "Không tìm thấy file"}), 400

    file = request.files["avatar"]
    success, result = update_avatar(current_user_id, file)

    if success:
        return jsonify({"status": "success", "avatar_url": result}), 200
    return jsonify({"status": "fail", "message": result}), 400


@account_bp.route(
    "/change-password",
    methods=["PUT"],
)
@jwt_required()
def change_password_api():
    identity = get_jwt_identity()
    current_user_id = identity["id"]

    data = request.json

    success, msg = change_password(
        current_user_id,
        data.get("old_password"),
        data.get("new_password"),
        data.get("confirm_password"),
    )

    return jsonify({"message": msg}), (200 if success else 400)