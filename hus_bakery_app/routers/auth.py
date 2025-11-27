from flask import Blueprint, request, render_template, flash, redirect, url_for, jsonify
from .. import db
from ..forms.signup import SignupForm
from ..models.customer import Customer

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/', methods=['GET', 'POST'])
@auth_bp.route('/index', methods=['GET', 'POST'])
def index():
    return jsonify({"message": "Welcome to Hus Bakery API"})


@auth_bp.route('/signup', methods=['GET', 'POST'])
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