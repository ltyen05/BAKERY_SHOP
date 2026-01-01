from flask import Blueprint, request, jsonify
import json
from flask_jwt_extended import jwt_required, get_jwt_identity
from hus_bakery_app.services.admin.admin_infomation_services import get_admin_information
admin_bp = Blueprint('admin_bp', __name__)


@admin_bp.route('/me', methods=['GET'])
@jwt_required()
def get_admin():
    identity_str = get_jwt_identity()
    identity = json.loads(identity_str)

    # 4. Kiểm tra quyền hạn: Chỉ cho phép 'employee' (Admin) truy cập
    if identity.get("role") != 'employee':
        return jsonify({"error": "Bạn không có quyền truy cập vào thông tin này"}), 403

    e_id = request.args.get('e_id')

    if not e_id:
        return jsonify({"error": "Thiếu tham số e_id"}), 400

    data = get_admin_information(e_id)

    if not data:
        return jsonify({"error": "Không tìm thấy thông tin Admin"}), 404

    return jsonify(data), 200