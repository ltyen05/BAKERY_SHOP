from flask import Blueprint, jsonify, request
import json
from flask_jwt_extended import jwt_required, get_jwt_identity
from hus_bakery_app.services.admin.product_management_services import add_product_service, edit_product_service, delete_product_service, get_all_products_admin_service

product_admin_bp = Blueprint('product_admin', __name__)

@product_admin_bp.route('/products', methods=['GET'])
@jwt_required()
def list_products():
    identity = json.loads(get_jwt_identity())
    if identity.get("role") != 'employee':
        return jsonify({"error": "Bạn không có quyền truy cập danh sách sản phẩm quản trị"}), 403

    products = get_all_products_admin_service()
    return jsonify(products), 200

@product_admin_bp.route("/add_products", methods=['POST'])
@jwt_required()
def add_product():
    identity = json.loads(get_jwt_identity())
    if identity.get("role") != 'employee':
        return jsonify({"error": "Chỉ nhân viên mới có quyền thêm sản phẩm"}), 403

    data = request.json # Nhận dữ liệu JSON từ React
    new_p = add_product_service(data)
    return jsonify({"message": "Thêm sản phẩm thành công", "id": new_p.product_id}), 201

@product_admin_bp.route("/update_products/<int:product_id>", methods=['PUT'])
@jwt_required()
def update_product(product_id):
    identity = json.loads(get_jwt_identity())
    if identity.get("role") != 'employee':
        return jsonify({"error": "Bạn không có quyền chỉnh sửa sản phẩm"}), 403

    data = request.json
    if edit_product_service(product_id, data):
        return jsonify({"message": "Cập nhật thành công"}), 200
    return jsonify({"error": "Sản phẩm không tồn tại"}), 404

@product_admin_bp.route("/delete_products/<int:product_id>", methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    identity = json.loads(get_jwt_identity())
    if identity.get("role") != 'employee':
        return jsonify({"error": "Bạn không có quyền xóa sản phẩm"}), 403

    if delete_product_service(product_id):
        return jsonify({"message": "Đã xóa sản phẩm"}), 200
    return jsonify({"error": "Không tìm thấy sản phẩm"}), 404