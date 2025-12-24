from flask import Blueprint, jsonify, request
from backend.hus_bakery_app.services.admin.dashboard_services import  total_order_of_moth, total_amount_of_month

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/total_orders', methods=['GET'])
def api_get_order_stats():
    # Lấy tham số month và year từ query string (ví dụ: /api/stats/orders?month=12&year=2025)
    month = request.args.get('month', type=int)
    year = request.args.get('year', type=int)

    # Kiểm tra nếu thiếu tham số
    if not month or not year:
        return jsonify({"error": "Vui lòng cung cấp cả month và year"}), 400

    total = total_order_of_moth(month, year)

    return jsonify({
        "month": month,
        "year": year,
        "total_orders": total
    }), 200

@dashboard_bp.route('/total_amount_for_month', methods=['POST'])
def api_get_total_amount():
    month = request.args.get('month', type=int)
    year = request.args.get('year', type=int)

    if not month or not year:
        return jsonify({"error": "Thiếu thông tin tháng hoặc năm"}), 400

        # Gọi hàm service đã tối ưu ở trên
    total = total_amount_of_month(month, year)

    return jsonify({
        "month": month,
        "year": year,
        "total_orders": total
    }), 200