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
    # 1. Tìm user (Giữ nguyên code cũ của bạn)
    user, role = find_user_instance(email)
    if not user:
        return False, "Email này chưa được đăng ký trong hệ thống."

    # 2. Tạo Token (Giữ nguyên code cũ)
    reset_token = create_access_token(
        identity={"id": user.get_id(), "role": role, "type": "reset"},
        expires_delta=timedelta(minutes=15)
    )

    # 3. Tạo Link (Sửa localhost:3000 thành domain thật nếu có)
    link = f"http://localhost:3000/reset-password?token={reset_token}"

    # 4. GỬI EMAIL THẬT (Sửa đoạn này)
    try:
        msg = Message(
            subject="[Hus Bakery] Yêu cầu đặt lại mật khẩu",
            recipients=[email],  # Gửi đến email khách hàng nhập
            body=f"Chào bạn,\n\nBạn vừa yêu cầu đặt lại mật khẩu. Vui lòng bấm vào link dưới đây (Hết hạn sau 15 phút):\n\n{link}\n\nNếu không phải bạn, vui lòng bỏ qua email này."
        )

        mail.send(msg)  # <--- Lệnh gửi quan trọng nhất

        return True, "Email hướng dẫn đã được gửi. Vui lòng kiểm tra hộp thư."

    except Exception as e:
        print(f"Lỗi gửi mail: {str(e)}")
        return False, "Gửi email thất bại. Vui lòng thử lại sau."


def reset_password_with_token(token, new_password):
    try:
        # 1. Giải mã token
        decoded = decode_token(token)
        identity = decoded['sub']  # Lấy phần identity đã lưu lúc tạo token

        # Check an toàn: đảm bảo đây là token reset chứ không phải token đăng nhập
        if identity.get('type') != 'reset':
            return False, "Token không hợp lệ cho việc đổi mật khẩu."

        user_id = identity['id']
        role = identity['role']

        # 2. Tìm lại User trong DB để sửa pass
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

        # 3. Cập nhật mật khẩu mới (Mã hóa)
        # Giả sử trong model bạn đặt tên cột là password_hash
        # Nếu model bạn dùng hàm set_password() thì gọi user.set_password(new_password)
        user.password_hash = generate_password_hash(new_password)

        db.session.commit()
        return True, "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay."

    except Exception as e:
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