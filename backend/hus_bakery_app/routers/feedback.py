from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..forms.feedback import FeedbackForm
from ..services.feedback_services import create_feedback

feedback_bp = Blueprint('feedback', __name__)


@feedback_bp.route('/add', methods=['POST'])
@jwt_required()  # Bắt buộc phải có Token đăng nhập mới được đánh giá
def add_feedback():
    # Lấy ID của người đang đăng nhập từ Token
    current_user = get_jwt_identity()
    user_id = current_user['id']  # Hoặc current_user.get('id') tùy cấu trúc token của bạn

    data = request.get_json()
    form = FeedbackForm(data=data, meta={'csrf': False})

    if form.validate():
        success, message = create_feedback(
            user_id=user_id,
            order_id=form.order_id.data,
            rating=form.rating.data,
            comment=form.comment.data
        )

        if success:
            return jsonify({"status": "success", "message": message}), 201
        else:
            return jsonify({"status": "fail", "message": message}), 400

    return jsonify({"status": "fail", "errors": form.errors}), 400