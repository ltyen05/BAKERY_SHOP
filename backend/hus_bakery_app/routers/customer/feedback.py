from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from hus_bakery_app.services.customer.feedback_services import IntegratedFeedbackService

feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route('/submit-experience', methods=['POST'])
@jwt_required()
def post_experience():
    data = request.get_json()
    customer_id = get_jwt_identity()

    # Yêu cầu truyền order_id thay vì order_item_id đơn lẻ
    required_fields = ['order_id', 'branch_rating', 'shipper_rating', 'product_rating']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Vui lòng hoàn tất đủ thông tin đánh giá"}), 400

    # Thực hiện xử lý thông qua Service tích hợp
    result, status_code = IntegratedFeedbackService.submit_full_experience(data, customer_id)
    return jsonify(result), status_code