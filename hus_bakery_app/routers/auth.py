from flask import Blueprint, request, render_template, flash, redirect, url_for, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .. import db
from ..forms.signup import SignupForm
from ..forms.login import LoginForm
from ..models.customer import Customer, Employee, Shipper

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
def lognin():
    data = request.get_json()
    form = LoginForm(data = data)
    if form.validate():
        customer = Customer.query.filter_by(email=form.email.data).first()
        if customer and customer.check_password(form.password.data):
            access_token_customer = create_access_token(identity={
                "id": customer.customer_id,
                "role": "customer"
            })
            return jsonify({
                "status": "success",
                "message": "Đăng nhập thành công!",
                "access_token": access_token_customer,
                "data": {
                    "id": customer.customer_id,
                    "name": customer.name,
                    "email": customer.email,
                    "avatar": customer.avatar,
                    "role": "customer"
                }
            }), 200

        employee = Employee.query.filter_by(email=form.email.data).first()
        if employee and employee.check_password(form.password.data):
            access_token_employee = create_access_token(identity={
                "id": employee.employee_id,
                "role": "employee"
            })

            return jsonify({
                "status": "success",
                "message": "Đăng nhập thành công!",
                "access_token": access_token_employee,
                "data": {
                    "id": employee.employee_id,
                    "name": employee.name,
                    "email": employee.email,
                    "avatar": employee.avatar,
                    "role": "employee"
                }
            }), 200

        shipper = Shipper.query.filter_by(email=form.email.data).first()
        if shipper and shipper.check_password(form.password.data):
            access_token_shipper = create_access_token(identity={
                "id": shipper.shipper_id,
                "role": "shipper"
            })
            return jsonify({
                "status": "success",
                "status": "success",
                "message": "Đăng nhập thành công!",
                "access_token": access_token_shipper,
                "data": {
                    "id": shipper.shipper_id,
                    "name": shipper.name,
                    "email": shipper.email,
                    "avatar": shipper.avatar,
                    "role": "shipper"
                }
            })
        else:
            return jsonify({
                "status": "fail",
                "message": "Sai email hoặc mật khẩu."
            }), 401
    return jsonify({
        "status": "fail",
        "errors": form.errors
    }), 400
