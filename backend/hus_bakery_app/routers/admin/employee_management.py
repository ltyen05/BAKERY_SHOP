from flask import Blueprint, request, jsonify
from backend.hus_bakery_app.services.admin.employee_management_services import get_employee, add_employee_service, edit_employee_service, delete_employee_service
from backend.hus_bakery_app.models.employee import Employee

employee_admin_bp = Blueprint('employee_admin_bp', __name__)
@employee_admin_bp.route('/employee', methods=['GET'])
def employee():
    filter_rank = request.args.get('status')
    raw_data = get_employee()

    employee_list = []
    if filter_rank:
        for e in raw_data:
            if e['employee_status'] == filter_rank:
                employee_list.append({
                    'employee_id': e['employee_id'],
                    'employee_name': e['employee_name'],
                    'role_name': e['role_name'],
                    'employee_phone': e['employee_phone'],
                    'employee_email': e['employee_email'],
                    'employee_status': e['employee_status'],
                })
    else:
        for e in raw_data:
            employee_list.append({
                'employee_id': e['employee_id'],
                'employee_name': e['employee_name'],
                'role_name': e['role_name'],
                'employee_phone': e['employee_phone'],
                'employee_email': e['employee_email'],
                'employee_status': e['employee_status'],
            })

    return jsonify(employee_list), 200

@employee_admin_bp.route('/employee', methods=['POST'])
def add_employee():
    data = request.json
    new_emp = add_employee_service(data)
    return jsonify({"message": "Thêm nhân viên thành công"}), 201

# Thêm route cho hành động DELETE (Xóa nhân viên)
@employee_admin_bp.route('/employee/<int:emp_id>', methods=['DELETE'])
def delete_employee(emp_id):
    if delete_employee_service(emp_id):
        return jsonify({"message": "Đã xóa nhân viên"}), 200
    return jsonify({"error": "Không tìm thấy nhân viên"}), 404


# API Chỉnh sửa thông tin nhân viên
@employee_admin_bp.route('/employee/<int:emp_id>', methods=['PUT'])
def update_employee(emp_id):
    data = request.json
    updated_emp = edit_employee_service(emp_id, data)

    if not updated_emp:
        return jsonify({"error": "Không tìm thấy nhân viên để cập nhật"}), 404

    return jsonify({
        "message": "Cập nhật nhân viên thành công",
        "employee_id": updated_emp.employee_id
    }), 200