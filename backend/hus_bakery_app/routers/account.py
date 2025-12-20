from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..services.account_services import update_profile, change_password, update_avatar
from ..models.customer import Customer

account_bp = Blueprint("account", __name__)


@account_bp.route("/profile", methods=["GET", "PUT"])
@jwt_required()
def profile_api():
    identity = get_jwt_identity()
    current_user_id = identity["id"]
    
    if request.method == "GET":
        user = Customer.query.get_or_404(current_user_id)
        return jsonify({
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "address": user.address,
            "avatar": f"/static/avatars/{user.avatar}" if user.avatar else None
        })

    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON body"}), 400

    success, msg = update_profile(current_user_id, data)
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
