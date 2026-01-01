import json

from flask import Blueprint, request, render_template, flash, redirect, url_for, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .. import db
from ..forms.signup import SignupForm
from ..forms.login import LoginForm
from ..models.customer import Customer
from ..models.employee import Employee
from ..models.shipper import Shipper
from ..services.auth_services import login_user, generate_token, check_email_exist
from ..services.auth_services import request_password_reset, reset_password_with_token, login_user, generate_token, check_email_exist, get_user_by_id_and_role, get_current_customer_service, get_current_shipper_service, get_current_admin_service

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/', methods=['GET', 'POST'])
@auth_bp.route('/index', methods=['GET', 'POST'])
def index():
    return jsonify({"message": "Welcome to Hus Bakery API"})

# @auth_bp.route("/me", methods=["GET"])
# @jwt_required()
# def api_get_me():
#     identity_str = get_jwt_identity()
#     indetity = json.loads(identity_str)
#     current_user_id = indetity["id"]
#     customer_data = get_current_customer_service(current_user_id)
#     if not customer_data:
#         return jsonify({"error": "Customer not found"}), 404

#     return jsonify(customer_data), 200

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def api_get_me():
    identity = json.loads(get_jwt_identity())

    user_id = identity["id"]
    role = identity["role"]

    if role == "customer":
        user_data = get_current_customer_service(user_id)
    elif role == "shipper":
        user_data = get_current_shipper_service(user_id)
    elif role == "employee":
        user_data = get_current_admin_service(user_id)
    else:
        return jsonify({"error": "Invalid role"}), 403

    if not user_data:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user_data), 200

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    form = SignupForm(data=data, meta={'csrf': False})
    if form.validate():
        new_customer = Customer(
            name=form.name.data,
            email=form.email.data,
            phone=form.phone.data,
            password=form.password.data
        )

        try:
            db.session.add(new_customer)
            db.session.commit()
            # Thành công
            return jsonify({
                "status": "success",
                "message": "Đăng ký thành công!",
                "user": {"name": new_customer.name, "email": new_customer.email}
            }), 201
        except Exception as e:
            db.session.rollback()
            # Lỗi server
            return jsonify({"status": "error", "message": str(e)}), 500

    # Nếu dữ liệu sai
    return jsonify({
        "status": "fail",
        "errors": form.errors
    }), 400

@auth_bp.route('/check-email', methods=['POST'])
def check_email():
    try:
        data = request.get_json()
        email = data.get('email')

        # Validate đầu vào
        if not email:
            return jsonify({"status": "fail", "message": "Vui lòng cung cấp email!"}), 400

        # Gọi Service kiểm tra
        exists = check_email_exist(email)

        return jsonify({
            "status": "success",
            "exists": exists, # Frontend sẽ dựa vào biến này (True/False)
            "message": "Email đã tồn tại" if exists else "Email chưa tồn tại"
        }), 200

    except Exception as e:
        print("Lỗi Check Email:", str(e))
        return jsonify({"status": "error", "message": "Lỗi Server"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        form = LoginForm(data=data, meta={'csrf': False})

        if not form.validate():
            return jsonify({"status": "fail", "errors": form.errors}), 400

        user, role, error_message = login_user(form.email.data, form.password.data)

        # Nếu có tin nhắn lỗi (tức là đăng nhập thất bại)
        if error_message:
            return jsonify({
                "status": "fail",
                "message": error_message  # Trả về đúng câu: "Mật khẩu không đúng" hoặc "Email ko tồn tại"
            }), 401

        # Nếu không có lỗi -> Tạo token
        token = generate_token(user, role)


        return jsonify({
            "status": "success",
            "message": "Đăng nhập thành công!",
            "access_token": token,
            "data": {
                "id": user.get_id(),
                "name": user.name,
                "role": role
            }
        }), 200

    except Exception as e:
        print("Lỗi Server:", str(e))
        return jsonify({"status": "error", "message": "Lỗi Server: " + str(e)}), 500
        print("LỖI SERVER (500):", str(e))
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": "Lỗi Server: " + str(e)}), 500
        return jsonify({"status": "error", "message": "Lỗi Server: " + str(e)}), 500


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"message": "Vui lòng nhập email"}), 400

    success, message = request_password_reset(email)

    if success:
        return jsonify({"status": "success", "message": message}), 200
    else:
        # Lưu ý bảo mật: Đôi khi nên luôn trả về success để tránh hacker dò email
        return jsonify({"status": "fail", "message": message}), 400


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')  # Token lấy từ URL (Frontend cắt ra gửi xuống)
    new_password = data.get('new_password')

    if not token or not new_password:
        return jsonify({"message": "Thiếu thông tin"}), 400

    success, message = reset_password_with_token(token, new_password)

    if success:
        return jsonify({"status": "success", "message": message}), 200
    else:
        return jsonify({"status": "fail", "message": message}), 400