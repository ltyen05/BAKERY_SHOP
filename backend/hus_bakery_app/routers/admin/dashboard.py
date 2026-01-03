from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from hus_bakery_app.models.branches import Branch
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


# --- HÀM BỔ TRỢ ĐỂ LẤY CHI NHÁNH TỪ TOKEN ---

def get_branch_info_from_token():
    try:
        identity = get_jwt_identity()

        # Nếu identity là string (do sub chứa JSON string), hãy parse nó
        if isinstance(identity, str):
            import json
            identity = json.loads(identity)

        # 1. Kiểm tra Role từ identity
        if identity.get("role") != "employee":
            return None, "Quyền truy cập bị từ chối. Chỉ dành cho Employee."

        employee_id = identity.get("id")
        if not employee_id:
            return None, "Token không chứa ID nhân viên hợp lệ."

        # 2. Truy vấn lấy chi nhánh
        branch = Branch.query.filter_by(manager_id=employee_id).first()
        if not branch:
            return None, f"Tài khoản (ID: {employee_id}) không quản lý chi nhánh nào."

        return branch.branch_id, None
    except Exception as e:
        return None, f"Lỗi xác thực: {str(e)}"


# --- CÁC ROUTE VỚI URL GIỮ NGUYÊN ---

@dashboard_bp.route('/total_orders', methods=['GET'])
@jwt_required()
def api_get_order_stats():
    branch_id, error = get_branch_info_from_token()
    if error:
        return jsonify({"success": False, "message": error}), 403

    # Lấy linh hoạt year, month, day từ URL (có thể thiếu bất kỳ trường nào)
    year = request.args.get('year', type=int)
    month = request.args.get('month', type=int)
    day = request.args.get('day', type=int)

    # Chỉ bắt buộc year để đảm bảo tính hợp lệ của query thời gian
    if not year:
        return jsonify({"success": False, "message": "Tham số 'year' là bắt buộc"}), 400

    total = get_total_orders(year=year, month=month, day=day, branch_id=branch_id)
    return jsonify({
        "status": "success",
        "data": total,
        "filters": {"year": year, "month": month, "day": day, "branch_id": branch_id}
    }), 200


@dashboard_bp.route('/total_amount', methods=['GET'])
@jwt_required()
def api_get_total_amount():
    branch_id, error = get_branch_info_from_token()
    if error:
        return jsonify({"success": False, "message": error}), 403

    year = request.args.get('year', type=int)
    month = request.args.get('month', type=int)
    day = request.args.get('day', type=int)

    if not year:
        return jsonify({"success": False, "message": "Tham số 'year' là bắt buộc"}), 400

    total = get_total_amount(year=year, month=month, day=day, branch_id=branch_id)
    return jsonify({
        "status": "success",
        "data": total,
        "filters": {"year": year, "month": month, "day": day, "branch_id": branch_id}
    }), 200


@dashboard_bp.route('/total_customer', methods=['GET'])
@jwt_required()
def api_get_total_customer():
    branch_id, error = get_branch_info_from_token()
    if error:
        return jsonify({"success": False, "message": error}), 403

    year = request.args.get('year', type=int)
    month = request.args.get('month', type=int)
    day = request.args.get('day', type=int)

    if not year:
        return jsonify({"success": False, "message": "Tham số 'year' là bắt buộc"}), 400

    total = get_total_customers(year=year, month=month, day=day, branch_id=branch_id)
    return jsonify({
        "status": "success",
        "data": total,
        "filters": {"year": year, "month": month, "day": day, "branch_id": branch_id}
    }), 200


@dashboard_bp.route('/total_product', methods=['GET'])
@jwt_required()
def api_get_total_product():
    branch_id, error = get_branch_info_from_token()
    if error:
        return jsonify({"success": False, "message": error}), 403

    year = request.args.get('year', type=int)
    month = request.args.get('month', type=int)
    day = request.args.get('day', type=int)

    if not year:
        return jsonify({"success": False, "message": "Tham số 'year' là bắt buộc"}), 400

    total = get_total_products(year=year, month=month, day=day, branch_id=branch_id)
    return jsonify({
        "status": "success",
        "data": total,
        "filters": {"year": year, "month": month, "day": day, "branch_id": branch_id}
    }), 200


@dashboard_bp.route('/order-status-distribution', methods=['GET'])
@jwt_required()
def api_order_status_distribution():
    branch_id, error = get_branch_info_from_token()
    if error:
        return jsonify({"success": False, "message": error}), 403

    try:
        data = get_order_status_distribution(branch_id=branch_id)
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@dashboard_bp.route('/top-products', methods=['GET'])
@jwt_required()
def api_top_products():
    branch_id, error = get_branch_info_from_token()
    if error:
        return jsonify({"success": False, "message": error}), 403

    limit = request.args.get('limit', default=5, type=int)
    data = get_top_selling_products(limit=limit, branch_id=branch_id)
    return jsonify({"success": True, "data": data}), 200


@dashboard_bp.route('/customer-growth', methods=['GET'])
@jwt_required()
def api_customer_growth():
    branch_id, error = get_branch_info_from_token()
    if error:
        return jsonify({"success": False, "message": error}), 403

    try:
        data = get_customer_growth_service(branch_id=branch_id)
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "message": f"Lỗi hệ thống: {str(e)}"}), 500