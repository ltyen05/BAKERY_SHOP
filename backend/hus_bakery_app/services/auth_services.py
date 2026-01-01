from flask_jwt_extended import create_access_token
from ..models.customer import Customer
from ..models.employee import Employee
from ..models.shipper import Shipper
from werkzeug.security import check_password_hash
from flask_mail import Message
from datetime import timedelta
from flask_jwt_extended import decode_token
from werkzeug.security import generate_password_hash
import json
# Import db và mail (Giả sử bạn đã khởi tạo mail ở __init__.py cùng chỗ với db)
from .. import db, mail

def get_current_customer_service(customer_id):
    # Chỉ tìm kiếm trong bảng Customer
    user = Customer.query.get(customer_id)

    if not user:
        return None

    return {
        "user_id": user.customer_id,
        "full_name": user.name,
        "email": user.email,
        "phone": user.phone,
        "avatar": user.avatar,
        "created_at": user.created_at.strftime('%Y-%m-%d %H:%M:%S') if user.created_at else None,
        "role": "customer"
    }


def get_current_shipper_service(shipper_id):
    user = Shipper.query.get(shipper_id)

    if not user:
        return None

    return {
        "user_id": user.shipper_id,
        "full_name": user.name,
        "email": user.email,
        "phone": user.phone,
        "role": "shipper"
    }

def get_current_admin_service(employee_id):
    employee = Employee.query.get(employee_id)

    if not employee:
        return None

    info = {
        "id": employee.employee_id,
        "full_name": employee.employee_name,
        "role": employee.role_name,
        "email": employee.email,
        "salary": float(employee.salary) if employee.salary else 0,
        "status": employee.status,
        "branch_id": employee.branch_id,
    }
    return info

def get_user_by_id_and_role(user_id, role):
    if role == 'customer': return Customer.query.get(user_id)
    if role == 'employee': return Employee.query.get(user_id)
    if role == 'shipper': return Shipper.query.get(user_id)
    return None


def find_user_instance(email):
    """Tìm user trong 3 bảng và trả về (user_object, role)"""
    user = Customer.query.filter_by(email=email).first()
    if user: return user, 'customer'

    user = Employee.query.filter_by(email=email).first()
    if user: return user, 'employee'

    user = Shipper.query.filter_by(email=email).first()
    if user: return user, 'shipper'

    return None, None


def request_password_reset(email):
    user, role = find_user_instance(email)
    if not user:
        return False, "Email này chưa được đăng ký trong hệ thống."

    # 🔥 FIX: identity PHẢI là string
    identity_data = json.dumps({
        "id": user.get_id(),
        "role": role,
        "type": "reset"
    })

    reset_token = create_access_token(
        identity=identity_data,
        expires_delta=timedelta(minutes=15)
    )

    link = f"http://localhost:3000/resetPassword?token={reset_token}"

    try:
        msg = Message(
            subject="[Hus Bakery] Yêu cầu đặt lại mật khẩu",
            recipients=[email],
            body=f"Chào bạn,\n\n"
                 f"Bạn vừa yêu cầu đặt lại mật khẩu.\n"
                 f"Link có hiệu lực 15 phút:\n\n{link}\n\n"
                 f"Nếu không phải bạn, vui lòng bỏ qua email này."
        )
        mail.send(msg)
        return True, "Email hướng dẫn đã được gửi. Vui lòng kiểm tra hộp thư."

    except Exception as e:
        print("MAIL ERROR >>>", repr(e))
        return False, "Gửi email thất bại. Vui lòng thử lại sau."



import json
import jwt
from flask import current_app
from werkzeug.security import generate_password_hash

def reset_password_with_token(token, new_password):
    try:
        # 1. Giải mã bằng thư viện jwt gốc để tránh lỗi "Subject must be a string"
        secret_key = current_app.config['JWT_SECRET_KEY']
        # Không dùng decode_token của flask-jwt-extended ở đây
        decoded = jwt.decode(token, secret_key, algorithms=["HS256"])
        
        # 2. Lấy dữ liệu identity từ trường 'sub'
        identity_raw = decoded.get('sub')

        # 3. Xử lý linh hoạt: Nếu là chuỗi JSON thì loads, nếu là dict thì dùng luôn
        if isinstance(identity_raw, str):
            try:
                identity = json.loads(identity_raw)
            except:
                identity = identity_raw
        else:
            identity = identity_raw

        # 4. Kiểm tra ID và Role (Xử lý cả trường hợp identity là dict hoặc giá trị đơn)
        if isinstance(identity, dict):
            user_id = identity.get('id')
            role = identity.get('role')
            token_type = identity.get('type')
        else:
            # Trường hợp identity chỉ chứa ID đơn thuần
            user_id = identity
            role = 'customer' # Mặc định hoặc xử lý thêm
            token_type = 'reset'

        # Kiểm tra an toàn
        if not user_id:
            return False, "Token không chứa ID người dùng."

        # 5. Truy vấn Database
        if role == 'customer':
            user = Customer.query.get(user_id)
        elif role == 'employee':
            user = Employee.query.get(user_id)
        elif role == 'shipper':
            user = Shipper.query.get(user_id)
        else:
            return False, "Role không hợp lệ."

        if not user:
            return False, "Người dùng không tồn tại."

        # 6. Cập nhật mật khẩu
        user.password_hash = generate_password_hash(new_password)
        db.session.commit()
        
        return True, "Đặt lại mật khẩu thành công!"

    except jwt.ExpiredSignatureError:
        return False, "Link đặt lại mật khẩu đã hết hạn."
    except Exception as e:
        if db: db.session.rollback()
        print(f"CRITICAL RESET ERROR: {str(e)}")
        return False, "Link không hợp lệ hoặc lỗi hệ thống."


def generate_token(user, role):
    # Chuyển Dictionary thành chuỗi String để tránh lỗi "Subject must be a string"
    identity_data = json.dumps({"id": user.get_id(), "role": role})

    return create_access_token(
        identity=identity_data,
        expires_delta=timedelta(days=1)
    )


# Thêm vào services/auth_services.py

def check_email_exist(email):
    # Kiểm tra lần lượt trong 3 bảng
    if Customer.query.filter_by(email=email).first():
        return True
    if Employee.query.filter_by(email=email).first():
        return True
    if Shipper.query.filter_by(email=email).first():
        return True
    return False


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