from flask import Blueprint, request, jsonify
from hus_bakery_app.services.admin.coupon_management_services import (
    get_all_coupons_service, add_coupon_service,
    edit_coupon_service, delete_coupon_service
)

coupon_admin_bp = Blueprint('coupon_admin_bp', __name__)

@coupon_admin_bp.route('/coupon', methods=['GET'])
def get_coupons():
    status_filter = request.args.get('status')
    raw_coupons = get_all_coupons_service()

    coupon_list = []
    for c in raw_coupons:
        if status_filter and c.status != status_filter:
            continue

        coupon_list.append({
            'coupon_id': c.coupon_id,
            'discount_value': float(c.discount_value) if c.discount_value else 0,
            'begin_date': c.begin_date.strftime('%Y-%m-%d') if c.begin_date else None,
            'end_date': c.end_date.strftime('%Y-%m-%d') if c.end_date else None,
            'status': c.status,
        })

    return jsonify(coupon_list), 200


@coupon_admin_bp.route('/coupon', methods=['POST'])
def add_coupon():
    data = request.json
    try:
        new_coupon = add_coupon_service(data)
        return jsonify({"message": "Thêm mã giảm giá thành công", "id": new_coupon.coupon_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@coupon_admin_bp.route('/coupon/<int:coupon_id>', methods=['PUT'])
def update_coupon(coupon_id):
    data = request.json
    if edit_coupon_service(coupon_id, data):
        return jsonify({"message": "Cập nhật thành công"}), 200
    return jsonify({"error": "Không tìm thấy mã giảm giá"}), 404


@coupon_admin_bp.route('/coupon/<int:coupon_id>', methods=['DELETE'])
def delete_coupon(coupon_id):
    if delete_coupon_service(coupon_id):
        return jsonify({"message": "Xóa mã giảm giá thành công"}), 200
    return jsonify({"error": "Không tìm thấy mã giảm giá"}), 404