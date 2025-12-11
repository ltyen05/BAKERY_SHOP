from flask import Blueprint, request, render_template, flash, redirect, url_for, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .. import db
from ..forms.signup import SignupForm
from ..forms.login import LoginForm
from ..models.customer import Customer
from ..services.auth_services import login_user, generate_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/', methods=['GET', 'POST'])
@auth_bp.route('/index', methods=['GET', 'POST'])
def index():
    return jsonify({"message": "Welcome to Hus Bakery API"})


@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    form = SignupForm(data = data)
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
            #Thành công
            return jsonify({
                "status": "success",
                "message": "Đăng ký thành công!",
                "user": {"name": new_customer.name, "email": new_customer.email}
            }), 201
        except Exception as e:
            db.session.rollback()
            # Lỗi server
            return jsonify({"status": "error", "message": str(e)}), 500

    #Nếu dữ liệu sai
    return jsonify({
        "status": "fail",
        "errors": form.errors
    }), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    form = LoginForm(data=data)

    if not form.validate():
        return jsonify({"status": "fail", "errors": form.errors}), 400

    user, role = login_user(form.email.data, form.password.data)

    if not user:
        return jsonify({
            "status": "fail",
            "message": "Sai email hoặc mật khẩu."
        }), 401

    token = generate_token(user, role)

    return jsonify({
        "status": "success",
        "message": "Đăng nhập thành công!",
        "access_token": token,
        "data": {
            "id": user.get_id(),
            "name": user.name,
            "email": user.email,
            "avatar": user.avatar,
            "role": role
        }
    }), 200