from flask import Blueprint, jsonify, request
from hus_bakery_app.services.admin.product_management_services import add_product_service, edit_product_service, delete_product_service, get_all_products_admin_service

product_admin_bp = Blueprint('product_admin', __name__)

@product_admin_bp.route('/products', methods=['GET'])
def list_products():
    products = get_all_products_admin_service()
    return jsonify(products), 200

@product_admin_bp.route("/add_products", methods=['POST'])
def add_product():
    data = request.json # Nhận dữ liệu JSON từ React
    new_p = add_product_service(data)
    return jsonify({"message": "Thêm sản phẩm thành công", "id": new_p.product_id}), 201

@product_admin_bp.route("/update_products/<int:product_id>", methods=['PUT'])
def update_product(product_id):
    data = request.json
    if edit_product_service(product_id, data):
        return jsonify({"message": "Cập nhật thành công"}), 200
    return jsonify({"error": "Sản phẩm không tồn tại"}), 404

@product_admin_bp.route("/delete_products/<int:product_id>", methods=['DELETE'])
def delete_product(product_id):
    if delete_product_service(product_id):
        return jsonify({"message": "Đã xóa sản phẩm"}), 200
    return jsonify({"error": "Không tìm thấy sản phẩm"}), 404