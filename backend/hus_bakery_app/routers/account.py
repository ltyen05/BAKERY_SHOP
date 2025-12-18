from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..services.account_services import (
    update_profile_service,
    change_password_service,
    update_avatar_service
)
from ..models.customer import Customer

account_bp = Blueprint('account', __name__, url_prefix='/api/account')

@account_bp.route('/profile', methods=['POST'])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()['id']

    if request.method == "GET":
        user = Customer.query.get(current_user_id)
        return jsonify({
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "address": user.address,
            "avatar": f"/static/avatars/{user.avatar}"
        })

    if request.method == "PUT":
        data = request.get_json()
        success, msg = update_profile_service(current_user_id, data)
        return jsonify({"message": msg}), (200 if success else 400)

@account_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    current_user_id = get_jwt_identity()['id']
    data = request.json

    old_pass = data.get('old_password')
    new_pass = data.get('new_password')
    confirm_pass = data.get('confirm_password')

    success, msg = change_password_service(current_user_id, old_pass, new_pass, confirm_pass)

    if success:
        return jsonify({"status": "success", "message": msg}), 200
    return jsonify({"status": "fail", "message": msg}), 400


@account_bp.route('/avatar', methods=['POST'])
@jwt_required()
def upload_avatar():
    current_user_id = get_jwt_identity()['id']

    if 'avatar' not in request.files:
        return jsonify({"message": "Không tìm thấy file"}), 400

    file = request.files['avatar']

    if file.filename == '':
        return jsonify({"message": "Chưa chọn file"}), 400

    success, result = update_avatar_service(current_user_id, file)

    if success:
        return jsonify({"status": "success", "avatar_url": result}), 200
    return jsonify({"status": "fail", "message": result}), 400