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
        "user_id": user.customer_id,
        "full_name": user.name,
        "email": user.email,
        "phone": user.phone,
        "role": "shipper"
    }


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
        return False, "Email này chưa được đăng ký."

    # Tạo Token reset
    reset_token = create_access_token(
        identity={"id": user.get_id(), "role": role, "type": "reset"},
        expires_delta=timedelta(minutes=15)
    )

    # Link này FE sẽ hứng token từ URL param và hiển thị form nhập pass mới
    # Ví dụ: http://localhost:3000/auth/reset-password?token=...
    frontend_url = "http://localhost:3000/reset-password"
    link = f"{frontend_url}?token={reset_token}"

    try:
        msg = Message(
            subject="[Hus Bakery] Đặt lại mật khẩu của bạn",
            recipients=[email],
            # Bạn có thể dùng html thay vì body để nút bấm đẹp hơn
            html=f"""
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                    <h3>Yêu cầu đặt lại mật khẩu</h3>
                    <p>Chào bạn, chúng tôi nhận được yêu cầu đổi mật khẩu cho tài khoản <b>{email}</b>.</p>
                    <p>Vui lòng nhấn vào nút bên dưới để tiến hành thay đổi mật khẩu (Hiệu lực trong 15 phút):</p>
                    <a href="{link}" style="background-color: #ff4d4f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Đặt lại mật khẩu</a>
                    <p>Nếu không phải là bạn, hãy bỏ qua email này.</p>
                </div>
            """
        )
        mail.send(msg)
        return True, "Email hướng dẫn đã được gửi."
    except Exception as e:
        return False, f"Lỗi gửi mail: {str(e)}"


def reset_password_with_token(token, new_password):
    try:
        # 1. Giải mã token
        decoded = decode_token(token)
        identity = decoded['sub']

        if identity.get('type') != 'reset':
            return False, "Token không hợp lệ cho việc đổi mật khẩu."

        user_id = identity['id']
        role = identity['role']

        # 2. Tìm lại User
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

        # 3. Cập nhật mật khẩu mới sử dụng hàm set_password đã có trong Model
        if hasattr(user, 'set_password'):
            user.set_password(new_password)
        else:
            # Nếu các bảng khác (Employee, Shipper) chưa có hàm set_password
            from werkzeug.security import generate_password_hash
            user.password = generate_password_hash(new_password)

        db.session.commit()
        return True, "Đặt lại mật khẩu thành công!"

    except Exception as e:
        print(f"Lỗi: {e}")
        return False, "Link đã hết hạn hoặc không hợp lệ."


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