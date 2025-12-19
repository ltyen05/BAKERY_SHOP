import os
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash
from .. import db
from ..models.customer import Customer

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, '..', 'static', 'avatars')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def update_profile(customer_id, profile):
    user = Customer.query.get(customer_id)
    if not user:
        return False, "Người dùng không tồn tại"

    if "full_name" in profile:
        user.full_name = profile["full_name"]
    if "phone" in profile:
        user.phone = profile["phone"]
    if "address" in profile:
        user.address = profile["address"]

    db.session.commit()
    return True, "Cập nhật thông tin thành công"


def update_avatar(customer_id, file):
    user = Customer.query.get(customer_id)
    if not user:
        return False, "Người dùng không tồn tại"

    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    if file and allowed_file(file.filename):
        filename = secure_filename(f"user_{customer_id}_{file.filename}")
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        user.avatar = filename
        db.session.commit()
        return True, filename

    return False, "File không hợp lệ"


def change_password(customer_id, old_pass, new_pass, confirm_pass):
    user = Customer.query.get(customer_id)

    if not user or not user.check_password(old_pass):
        return False, "Mật khẩu cũ không chính xác"
    if new_pass != confirm_pass:
        return False, "Mật khẩu xác nhận không khớp"
    if len(new_pass) < 6:
        return False, "Mật khẩu mới phải ≥ 6 ký tự"

    user.password_hash = generate_password_hash(new_pass)
    db.session.commit()
    return True, "Đổi mật khẩu thành công"
