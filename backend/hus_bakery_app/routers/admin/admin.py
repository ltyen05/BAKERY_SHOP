from flask import Blueprint, request, jsonify
from ..utils import admin_required
from hus_bakery_app.services.admin.admin_services import (
    get_all_orders_service,
    get_order_detail_service,
    update_order_status_service,
    assign_shipper_service
)

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')


# --- 1. LẤY DANH SÁCH ĐƠN HÀNG ---
@admin_bp.route('/orders', methods=['GET'])
@admin_required()
def api_get_orders():
    status = request.args.get('status')  # Lấy ?status=pending
    page = request.args.get('page', 1, type=int)

    data = get_all_orders_service(status, page)
    return jsonify({"status": "success", "data": data}), 200


# --- 2. CHI TIẾT ĐƠN HÀNG ---
@admin_bp.route('/orders/<int:order_id>', methods=['GET'])
@admin_required()
def api_order_detail(order_id):
    data, error = get_order_detail_service(order_id)
    if error:
        return jsonify({"status": "fail", "message": error}), 404
    return jsonify({"status": "success", "data": data}), 200


# --- 3. CẬP NHẬT TRẠNG THÁI ---
@admin_bp.route('/orders/<int:order_id>/status', methods=['PUT'])
@admin_required()
def api_update_status(order_id):
    req_data = request.json
    new_status = req_data.get('status')  # vd: "confirmed", "completed"

    success, msg = update_order_status_service(order_id, new_status)
    if success:
        return jsonify({"status": "success", "message": msg}), 200
    return jsonify({"status": "fail", "message": msg}), 400


# --- 4. GÁN SHIPPER ---
@admin_bp.route('/orders/<int:order_id>/assign', methods=['PUT'])
@admin_required()
def api_assign_shipper(order_id):
    req_data = request.json
    shipper_id = req_data.get('shipper_id')

    success, msg = assign_shipper_service(order_id, shipper_id)
    if success:
        return jsonify({"status": "success", "message": msg}), 200
    return jsonify({"status": "fail", "message": msg}), 400