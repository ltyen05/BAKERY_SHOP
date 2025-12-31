from flask import Blueprint, jsonify, request
from hus_bakery_app.services.superadmin.superadmin_dashboard_services import (
    get_total_revenue_per_branch_service,
    get_order_delivery_stats_service,
    get_revenue_by_time_and_branch_service
)

superadmin_dashboard_bp = Blueprint('superadmin_dashboard_bp', __name__)


@superadmin_dashboard_bp.route('/revenue_per_branch', methods=['GET'])
def get_revenue_per_branch():
    """Lấy tổng doanh thu của từng chi nhánh"""
    data = get_total_revenue_per_branch_service()
    return jsonify({"success": True, "data": data}), 200


@superadmin_dashboard_bp.route('/order_stats', methods=['GET'])
def get_order_stats():
    """Lấy thống kê trạng thái các đơn hàng (đang giao, đã giao, hủy...)"""
    data = get_order_delivery_stats_service()
    return jsonify({"success": True, "data": data}), 200


@superadmin_dashboard_bp.route('/revenue_chart', methods=['GET'])
def get_revenue_chart():
    """
    Lấy dữ liệu doanh thu theo thời gian để vẽ biểu đồ
    Param: period (month/week) - mặc định là month
    """
    period = request.args.get('period', 'month')
    if period not in ['month', 'week']:
        return jsonify({"success": False, "message": "Period không hợp lệ"}), 400

    data = get_revenue_by_time_and_branch_service(period)
    return jsonify({"success": True, "data": data}), 200