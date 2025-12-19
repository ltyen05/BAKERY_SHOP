from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..services.account_services import update_profile, change_password, update_avatar
from ..models.customer import Customer

account_bp = Blueprint("account", __name__, url_prefix="/account")

# ===================== OPTIONS =====================
@account_bp.route("/profile", methods=["OPTIONS"])
def profile_options():
    return "", 200

@account_bp.route("/avatar", methods=["OPTIONS"])
def avatar_options():
    return "", 200

@account_bp.route("/change-password", methods=["OPTIONS"])
def change_password_options():
    return "", 200
# ==================================================


@account_bp.route(
    "/profile",
    methods=["GET", "PUT"],
    provide_automatic_options=False,  # 🔥 QUAN TRỌNG
)
@jwt_required()
def profile_api():
    current_user_id = get_jwt_identity()["id"]

    if request.method == "GET":
        user = Customer.query.get(current_user_id)
        return jsonify({
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "address": user.address,
            "avatar": f"/static/avatars/{user.avatar}" if user.avatar else None
        })

    if request.method == "PUT":
        data = request.get_json()
        success, msg = update_profile(current_user_id, data)
        return jsonify({"message": msg}), (200 if success else 400)


@account_bp.route(
    "/avatar",
    methods=["POST"],
    provide_automatic_options=False,
)
@jwt_required()
def update_avatar_api():
    current_user_id = get_jwt_identity()["id"]

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
    provide_automatic_options=False,
)
@jwt_required()
def change_password_api():
    current_user_id = get_jwt_identity()["id"]
    data = request.json

    success, msg = change_password(
        current_user_id,
        data.get("old_password"),
        data.get("new_password"),
        data.get("confirm_password"),
    )

    return jsonify({"message": msg}), (200 if success else 400)
