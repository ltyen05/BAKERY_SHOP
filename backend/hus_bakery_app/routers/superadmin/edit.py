from flask import Blueprint, request, jsonify
from hus_bakery_app.services.superadmin.edit_services import (
    add_branch_service,
    update_branch_service,
    create_employee_service,
    update_employee_service,
    add_product_service,
    update_product_service,
    create_coupon_service,
    update_coupon_service,
    get_branch_detail_service,
    get_branch_manager_info_service,
    get_all_products_service
)

admin_mgmt_bp = Blueprint('admin_mgmt', __name__)

@admin_mgmt_bp.route('/branches', methods=['POST'])
def create_branch():
    data = request.json
    branch = add_branch_service(data)
    return jsonify({"success": True, "message": "Thêm chi nhánh thành công", "id": branch.branch_id}), 201

@admin_mgmt_bp.route('/branches/<int:id>', methods=['PUT'])
def update_branch(id):
    data = request.json
    branch = update_branch_service(id, data)
    if branch:
        return jsonify({"success": True, "message": "Cập nhật chi nhánh thành công"}), 200
    return jsonify({"success": False, "message": "Không tìm thấy chi nhánh"}), 404

@admin_mgmt_bp.route('/employees', methods=['POST'])
def create_employee():
    data = request.json
    emp = create_employee_service(data)
    return jsonify({"success": True, "message": "Thêm nhân viên thành công", "id": emp.employee_id}), 201

@admin_mgmt_bp.route('/employees/<int:id>', methods=['PUT'])
def update_employee(id):
    data = request.json
    emp = update_employee_service(id, data)
    if emp:
        return jsonify({"success": True, "message": "Cập nhật nhân viên thành công"}), 200
    return jsonify({"success": False, "message": "Không tìm thấy nhân viên"}), 404

@admin_mgmt_bp.route('/products', methods=['POST'])
def create_product():
    data = request.json
    product = add_product_service(data)
    return jsonify({"success": True, "message": "Thêm sản phẩm thành công", "id": product.product_id}), 201

@admin_mgmt_bp.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    data = request.json
    product = update_product_service(id, data)
    if product:
        return jsonify({"success": True, "message": "Cập nhật sản phẩm thành công"}), 200
    return jsonify({"success": False, "message": "Không tìm thấy sản phẩm"}), 404

@admin_mgmt_bp.route('/coupons', methods=['POST'])
def create_coupon():
    data = request.json
    coupon = create_coupon_service(data)
    return jsonify({"success": True, "message": "Tạo mã giảm giá thành công", "id": coupon.coupon_id}), 201

@admin_mgmt_bp.route('/coupons/<int:id>', methods=['PUT'])
def update_coupon(id):
    data = request.json
    coupon = update_coupon_service(id, data)
    if coupon:
        return jsonify({"success": True, "message": "Cập nhật mã giảm giá thành công"}), 200
    return jsonify({"success": False, "message": "Không tìm thấy mã giảm giá"}), 404

# Chi tiết chi nhánh
@admin_mgmt_bp.route('/branches/<int:id>', methods=['GET'])
def get_branch_detail(id):
    branch_data = get_branch_detail_service(id)
    if branch_data:
        return jsonify({
            "success": True,
            "data": branch_data
        }), 200

    return jsonify({
        "success": False,
        "message": "Không tìm thấy thông tin chi nhánh"
    }), 404

@admin_mgmt_bp.route('/branches/<int:id>/manager', methods=['GET'])
def get_branch_manager(id):
    manager_info = get_branch_manager_info_service(id)

    if manager_info:
        return jsonify({
            "success": True,
            "data": manager_info
        }), 200

    return jsonify({
        "success": False,
        "message": "Chi nhánh này chưa được gán quản lý hoặc không tồn tại"
    }), 404

@admin_mgmt_bp.route('/products', methods=['GET'])
def get_all_products():
    try:
        products = get_all_products_service()
        return jsonify({
            "success": True,
            "count": len(products),
            "data": products
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500