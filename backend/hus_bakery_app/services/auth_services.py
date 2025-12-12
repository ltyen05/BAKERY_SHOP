from flask_jwt_extended import create_access_token
from ..models.customer import Customer
from ..models.employee import Employee
from ..models.shipper import Shipper
from werkzeug.security import check_password_hash


def generate_token(user, role):
    return create_access_token(identity={
        "id": user.get_id(),
        "role": role,
        "email": user.email
    })


def login_user(email, password):
    # Try Customer
    user = Customer.query.filter_by(email=email).first()
    if user:
        if user.check_password(password):
            return user, "customer", None  # Thành công (Error = None)
        else:
            return None, None, "Mật khẩu không đúng!"

    # Try Employee
    user = Employee.query.filter_by(email=email).first()
    if user:
        if user.check_password(password):
            return user, "employee", None
        else:
            return None, None, "Mật khẩu nhân viên không đúng!"

    # Try Shipper
    user = Shipper.query.filter_by(email=email).first()
    if user:
        if user.check_password(password):
            return user, "shipper", None
        else:
            return None, None, "Mật khẩu shipper không đúng!"

    return None, None, "Email không tồn tại"