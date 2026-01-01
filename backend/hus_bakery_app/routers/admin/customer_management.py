from flask import Blueprint, jsonify, request
from hus_bakery_app.models.customer import Customer
from hus_bakery_app.services.admin.customer_management_services import get_all_customers_with_stats_service, delete_customer_service
from hus_bakery_app.services.customer.account_services import total_amount_of_customer, get_customer_rank_service

customer_admin_bp = Blueprint('customer_admin_bp', __name__)

@customer_admin_bp.route("/customer", methods=['GET'])
def get_all_customers():
    filter_rank = request.args.get('rank')
    raw_data = get_all_customers_with_stats_service()

    customer_list = []
    for customer, total_spent in raw_data:
        amount = float(total_spent) if total_spent else 0.0
        rank = get_customer_rank_service(amount)

        if filter_rank and rank.lower() != filter_rank.lower():
            continue

        customer_list.append({
            "id": customer.customer_id,
            "name": customer.name,
            "email": customer.email,
            "phone": customer.phone,
            "total_amount": amount,
            "rank": rank
        })

    return jsonify(customer_list), 200

@customer_admin_bp.route("/customer/<int:customer_id>", methods=['DELETE'])
def delete_customer(customer_id):
    if delete_customer_service(customer_id):
        return jsonify({"message": "Đã xóa khách hàng thành công"}), 200
    return jsonify({"error": "Không tìm thấy khách hàng"}), 404


