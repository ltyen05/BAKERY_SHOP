from flask_jwt_extended import create_access_token
from ..models.customer import Customer
from ..models.employee import Employee
from ..models.shipper import Shipper
from werkzeug.security import check_password_hash
from flask_mail import Message
from datetime import timedelta
from flask_jwt_extended import decode_token
from werkzeug.security import generate_password_hash
# Import db và mail (Giả sử bạn đã khởi tạo mail ở __init__.py cùng chỗ với db)
from .. import db, mail


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
    # 1. Tìm user
    user, role = find_user_instance(email)
    if not user:
        return False, "Email này chưa được đăng ký trong hệ thống."

    # 2. Tạo Token Reset (Hết hạn sau 15 phút)
    # Token này chứa ID và Role để lát sau biết đường tìm lại User
    reset_token = create_access_token(
        identity={"id": user.get_id(), "role": role, "type": "reset"},
        expires_delta=timedelta(minutes=15)
    )

    # 3. Tạo Link Reset (Giả sử Frontend chạy ở localhost:3000)
    # Bạn thay localhost:3000 bằng domain thật của bạn sau này
    link = f"http://localhost:3000/reset-password?token={reset_token}"

    # 4. Gửi Email
    try:
        msg = Message(
            subject="[Bakery App] Yêu cầu đặt lại mật khẩu",
            sender="noreply@bakeryapp.com",  # Email gửi đi (cần khớp config)
            recipients=[email]
        )
        msg.body = f"Chào bạn,\n\nBạn vừa yêu cầu đặt lại mật khẩu. Vui lòng bấm vào link dưới đây để đổi mật khẩu (Link hết hạn sau 15 phút):\n\n{link}\n\nNếu bạn không yêu cầu, vui lòng bỏ qua email này."

        mail.send(msg)
        return True, "Email hướng dẫn đã được gửi. Vui lòng kiểm tra hộp thư."
    except Exception as e:
        print(f"Lỗi gửi mail: {str(e)}")
        # Mẹo: Khi đang test ở máy (chưa cấu hình mail server), bạn in link ra terminal để click
        print(f"DEBUG LINK RESET: {link}")
        return True, "Đã tạo link reset (kiểm tra Terminal vì chưa config mail server)."


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
    return create_access_token(identity={
        "id": user.get_id(),
        "role": role,
        "email": user.email
    })

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