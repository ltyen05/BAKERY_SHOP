from flask import Blueprint, jsonify, request
from hus_bakery_app.services.admin.order_management_services import order_detail, delete_order, get_all_orders_service

order_admin_bp = Blueprint('order_management', __name__)
@order_admin_bp.route("/order_mangement", methods=['GET'])
def order_management():
    order_id = request.args.get('order_id')

    if not order_id:
        return jsonify({"error": "Vui lòng cung cấp order_id"}), 400

    order_items = order_detail(order_id)

    if not order_items:
        return jsonify({"message": "Đơn hàng trống hoặc không tồn tại"}), 404

    return jsonify(order_items), 200

@order_admin_bp.route("/orders/<int:order_id>", methods=['DELETE'])
def delete_order(order_id):
    success = delete_order(order_id)
    if not success:
        return jsonify({"message": "Xóa đơn hàng thành công"}), 200
    return jsonify({"error": "Không tìm thấy đơn hàng"}), 404

@order_admin_bp.route("/orders", methods=['GET'])
def get_orders():
    orders = get_all_orders_service()
    return jsonify(orders), 200
