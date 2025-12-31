from flask import Blueprint, request, jsonify

from hus_bakery_app.services.admin.admin_infomation_services import get_admin_information

admin_bp = Blueprint('admin_bp', __name__)


@admin_bp.route('/me', methods=['GET'])
def get_admin():
    e_id = request.args.get('e_id')

    if not e_id:
        return jsonify({"error": "Thiếu tham số e_id"}), 400

    data = get_admin_information(e_id)

    if not data:
        return jsonify({"error": "Không tìm thấy thông tin Admin"}), 404

    return jsonify(data), 200