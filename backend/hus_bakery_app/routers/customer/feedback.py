from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from hus_bakery_app.forms.feedback import FeedbackForm
from hus_bakery_app.services.customer.feedback_services import create_feedback

feedback_bp = Blueprint('feedback', __name__)


@feedback_bp.route('/add', methods=['POST'])
@jwt_required()
def add_feedback():
    current_user = get_jwt_identity()
    user_id = current_user['id']

    data = request.get_json()
    form = FeedbackForm(data=data, meta={'csrf': False})

    if form.validate():
        # Gọi hàm service đã sửa (chỉ truyền user_id, order_id, rating)
        success, message = create_feedback(
            user_id=user_id,
            order_id=form.order_id.data,
            rating=form.rating.data
            # Đã xóa dòng comment=form.comment.data
        )

        if success:
            return jsonify({"status": "success", "message": message}), 201
        else:
            return jsonify({"status": "fail", "message": message}), 400

    return jsonify({"status": "fail", "errors": form.errors}), 400