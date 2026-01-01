from flask import Blueprint, request, jsonify
from hus_bakery_app.services.admin.employee_management_services import (
    get_all_employees_service, add_employee_service,
    edit_employee_service, delete_employee_service
)

employee_admin_bp = Blueprint('employee_admin_bp', __name__)


@employee_admin_bp.route('/employee', methods=['GET'])
def get_employees():
    status_filter = request.args.get('status')
    raw_employees = get_all_employees_service()

    employee_list = []
    for e in raw_employees:
        if status_filter and e.status != status_filter:
            continue

        employee_list.append({
            'employee_id': e.employee_id,
            'employee_name': e.employee_name,
            'role_name': e.role_name,
            'email': e.email,
            'salary': float(e.salary) if e.salary else 0,
            'status': e.status,
            'branch_id': e.branch_id
        })

    return jsonify(employee_list), 200


@employee_admin_bp.route('/employee', methods=['POST'])
def add_employee():
    data = request.json
    try:
        new_emp = add_employee_service(data)
        return jsonify({"message": "Thêm nhân viên thành công", "id": new_emp.employee_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@employee_admin_bp.route('/employee/<int:emp_id>', methods=['PUT'])
def update_employee(emp_id):
    data = request.json
    updated_emp = edit_employee_service(emp_id, data)
    if updated_emp:
        return jsonify({"message": "Cập nhật thành công"}), 200
    return jsonify({"error": "Không tìm thấy nhân viên"}), 404


@employee_admin_bp.route('/employee/<int:emp_id>', methods=['DELETE'])
def delete_employee(emp_id):
    if delete_employee_service(emp_id):
        return jsonify({"message": "Xóa nhân viên thành công"}), 200
    return jsonify({"error": "Không tìm thấy nhân viên"}), 404