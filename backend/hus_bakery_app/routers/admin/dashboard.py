from flask import Blueprint, jsonify, request
from hus_bakery_app.services.admin.dashboard_services import (
    get_total_orders,
    get_total_amount,
    get_total_customers,
    get_total_products,
    get_order_status_distribution,
    get_top_selling_products,
    get_customer_growth_service
)

dashboard_bp = Blueprint('dashboard', __name__)


def get_request_args():
    """Hàm tiện ích để lấy params từ URL"""
    return {
        'year': request.args.get('year', type=int),
        'month': request.args.get('month', type=int),  # Có thể None
        'day': request.args.get('day', type=int),
        'branch_id': request.args.get('branch_id', type=int)# Có thể None
    }


@dashboard_bp.route('/stats/orders', methods=['GET'])
def api_get_order_stats():
    args = get_request_args()
    if not args['year']:
        return jsonify({"error": "Năm (year) là bắt buộc"}), 400

    total = get_total_orders(**args)
    return jsonify({"status": "success", "data": total, "filters": args}), 200


@dashboard_bp.route('/stats/amount', methods=['GET'])
def api_get_total_amount():
    args = get_request_args()
    if not args['year']:
        return jsonify({"error": "Năm (year) là bắt buộc"}), 400

    total = get_total_amount(**args)
    return jsonify({"status": "success", "data": total, "filters": args}), 200


@dashboard_bp.route('/stats/customers', methods=['GET'])
def api_get_total_customer():
    args = get_request_args()
    if not args['year']:
        return jsonify({"error": "Năm (year) là bắt buộc"}), 400

    total = get_total_customers(**args)
    return jsonify({"status": "success", "data": total, "filters": args}), 200


@dashboard_bp.route('/stats/products', methods=['GET'])
def api_get_total_product():
    args = get_request_args()
    if not args['year']:
        return jsonify({"error": "Năm (year) là bắt buộc"}), 400

    total = get_total_products(**args)
    return jsonify({"status": "success", "data": total, "filters": args}), 200


@dashboard_bp.route('/order-status-distribution', methods=['GET'])
def api_order_status_distribution():
    branch_id = request.args.get('branch_id', type=int)
    try:
        data = get_order_status_distribution(branch_id=branch_id)
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@dashboard_bp.route('/top-products', methods=['GET'])
def api_top_products():
    def api_top_products():
        branch_id = request.args.get('branch_id', type=int)
        limit = request.args.get('limit', default=5, type=int)
        data = get_top_selling_products(limit=limit, branch_id=branch_id)
        return jsonify({"success": True, "data": data}), 200


@dashboard_bp.route('/customer-growth', methods=['GET'])
def api_customer_growth():
    branch_id = request.args.get('branch_id', type=int)
    try:
        growth_stats = get_customer_growth_service(branch_id=branch_id)
        return jsonify({"success": True, "data": growth_stats}), 200
    except Exception as e:
        return jsonify({"success": False, "message": f"Lỗi hệ thống: {str(e)}"}), 500