from flask import Blueprint, request, jsonify
import json
from flask_jwt_extended import jwt_required, get_jwt_identity
from hus_bakery_app.models.branches import Branch
from hus_bakery_app.services.admin.shipper_management_services import (
    get_all_shippers_service, add_shipper_service,
    edit_shipper_service, delete_shipper_service,
    total_successful_order_of_shipper
)
from hus_bakery_app.services.shipper.shipper_statistics_service import calculate_avg_rating

shipper_admin_bp = Blueprint('shipper_admin_bp', __name__)


def get_branch_id_from_token():
    """Hàm helper trích xuất branch_id từ Token"""
    identity = json.loads(get_jwt_identity())
    employee_id = identity.get("id")
    branch = Branch.query.filter_by(manager_id=employee_id).first()
    return branch.branch_id if branch else None


@shipper_admin_bp.route('/infomation', methods=['GET'])
@jwt_required()
def get_shippers():
    # 1. Lấy branch_id từ Token
    branch_id = get_branch_id_from_token()
    if not branch_id:
        return jsonify({"error": "Bạn không quản lý chi nhánh nào"}), 404

    # 2. KHỞI TẠO BIẾN (Đây là phần bạn thiếu dẫn đến NameError)
    shipper_list = []

    status_filter = request.args.get('status')
    raw_shippers = get_all_shippers_service(branch_id)

    # 3. Duyệt danh sách và xử lý dữ liệu
    for s in raw_shippers:
        # Kiểm tra điều kiện lọc status nếu có
        if status_filter and s.status != status_filter:
            continue

        # Lấy thông tin bổ sung (thống kê)
        success_count = total_successful_order_of_shipper(s.shipper_id)
        average_star = calculate_avg_rating(s.shipper_id)

        shipper_list.append({
            'shipper_id': s.shipper_id,
            'shipper_name': s.name,
            'phone': s.phone,
            'email': s.email,
            'status': s.status,
            'branch_id': s.branch_id,
            'total_success': success_count,
            'rating': average_star
        })

    # 4. Trả về kết quả
    return jsonify(shipper_list), 200


@shipper_admin_bp.route('/add_shipper', methods=['POST'])
@jwt_required()
def add_shipper():
    branch_id = get_branch_id_from_token()
    if not branch_id: return jsonify({"error": "Không thể xác định chi nhánh"}), 404

    new_shipper = add_shipper_service(request.json, branch_id)
    return jsonify({"message": "Thành công", "id": new_shipper.shipper_id}), 201


@shipper_admin_bp.route('/update_shipper/<int:shipper_id>', methods=['PUT'])
@jwt_required()
def update_shipper(shipper_id):
    branch_id = get_branch_id_from_token()
    updated = edit_shipper_service(shipper_id, branch_id, request.json)
    if updated: return jsonify({"message": "Đã cập nhật"}), 200
    return jsonify({"error": "Không tìm thấy shipper tại chi nhánh này"}), 404


@shipper_admin_bp.route('/delete_shipper/<int:shipper_id>', methods=['DELETE'])
@jwt_required()
def delete_shipper(shipper_id):
    branch_id = get_branch_id_from_token()
    if delete_shipper_service(shipper_id, branch_id):
        return jsonify({"message": "Đã xóa thành công"}), 200
    return jsonify({"error": "Không có quyền xóa hoặc shipper không tồn tại"}), 404