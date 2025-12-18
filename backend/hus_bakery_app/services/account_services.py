import os
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash
from .. import db
from ..models.customer import Customer

UPLOAD_FOLDER = 'hus_bakery_app/static/avatars'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def change_password_service(customer_id, old_pass, new_pass, confirm_pass):
    user = Customer.query.get(customer_id)

    if not user.check_password(old_pass):
        return False, "Mật khẩu cũ không chính xác"
    if new_pass != confirm_pass:
        return False, "Mật khẩu xác nhận không khớp"
    if len(new_pass) < 6:
        return False, "Mật khẩu mới phải dài hơn 6 kí tự"

    user.password_hash = generate_password_hash(new_pass)
    db.session.commit()

    return True, "Đổi mật khẩu thành công "

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

