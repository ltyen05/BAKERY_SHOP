from hus_bakery_app.models.branches import Branch
from hus_bakery_app.models.employee import Employee
from hus_bakery_app.models.products import Product
from hus_bakery_app.models.coupon import Coupon
from datetime import datetime
from hus_bakery_app import db

def add_branch_service(data):
    # Tạo đối tượng Branch mới với đầy đủ các trường từ file branches.py
    new_branch = Branch(
        name=data.get('name'),
        address=data.get('address'),
        phone=data.get('phone'),
        email=data.get('email'),
        mapSrc=data.get('mapSrc'),
        lat=data.get('lat'),
        lng=data.get('lng'), # Lưu ý: Model dùng 'lng', không phải 'lon'
        manager_id=data.get('manager_id')
    )

    db.session.add(new_branch)
    db.session.commit()
    return new_branch

def update_branch_service(branch_id, data):
    branch = Branch.query.get(branch_id)
    if not branch:
        return None

    # Cập nhật các trường thông tin
    branch.name = data.get('name', branch.name)
    branch.address = data.get('address', branch.address)
    branch.phone = data.get('phone', branch.phone)
    branch.email = data.get('email', branch.email)
    branch.mapSrc = data.get('mapSrc', branch.mapSrc)
    branch.lat = data.get('lat', branch.lat)
    branch.lng = data.get('lng', branch.lng)
    branch.manager_id = data.get('manager_id', branch.manager_id)

    db.session.commit()
    return branch

def create_employee_service(data):
    # Khởi tạo theo đúng __init__ của model Employee
    new_emp = Employee(
        employee_id=data.get('employee_id'),
        employee_name=data.get('employee_name'),
        role_name=data.get('role_name'),
        email=data.get('email'),
        password=None,  # Sẽ set qua set_password
        salary=data.get('salary'),
        branch_id=data.get('branch_id')
    )
    # Gán trạng thái (không có trong init nhưng có trong columns)
    new_emp.status = data.get('status', 'Active')

    # Hash mật khẩu
    if data.get('password'):
        new_emp.set_password(data.get('password'))

    db.session.add(new_emp)
    db.session.commit()
    return new_emp


def update_employee_service(emp_id, data):
    emp = Employee.query.get(emp_id)
    if not emp: return None

    emp.employee_name = data.get('employee_name', emp.employee_name)
    emp.role_name = data.get('role_name', emp.role_name)
    emp.email = data.get('email', emp.email)
    emp.salary = data.get('salary', emp.salary)
    emp.status = data.get('status', emp.status)
    emp.branch_id = data.get('branch_id', emp.branch_id)

    if data.get('password'):
        emp.set_password(data.get('password'))

    db.session.commit()
    return emp


def add_product_service(data):
    new_product = Product(
        name=data.get('name'),
        description=data.get('description'),
        image_url=data.get('image_url'),
        unit_price=data.get('unit_price'),
        category_id=data.get('category_id'),
        updated_at=datetime.now().date()
    )
    db.session.add(new_product)
    db.session.commit()
    return new_product


def update_product_service(product_id, data):
    product = Product.query.get(product_id)
    if not product: return None

    product.name = data.get('name', product.name)
    product.description = data.get('description', product.description)
    product.image_url = data.get('image_url', product.image_url)
    product.unit_price = data.get('unit_price', product.unit_price)
    product.category_id = data.get('category_id', product.category_id)
    product.updated_at = datetime.now().date()  # Cập nhật ngày chỉnh sửa

    db.session.commit()
    return product


def create_coupon_service(data):
    new_coupon = Coupon()
    new_coupon.description = data.get('description')
    new_coupon.discount_percent = data.get('discount_percent')
    new_coupon.discount_value = data.get('discount_value')
    new_coupon.discount_type = data.get('discount_type')  # 'Fixed' hoặc 'Percent'
    new_coupon.min_purchase = data.get('min_purchase', 0)
    new_coupon.max_discount = data.get('max_discount')
    new_coupon.begin_date = data.get('begin_date')  # Format YYYY-MM-DD
    new_coupon.end_date = data.get('end_date')
    new_coupon.status = data.get('status', 'Active')
    new_coupon.used_count = 0
    new_coupon.created_at = datetime.now()

    db.session.add(new_coupon)
    db.session.commit()
    return new_coupon


def update_coupon_service(coupon_id, data):
    coupon = Coupon.query.get(coupon_id)
    if not coupon: return None

    coupon.description = data.get('description', coupon.description)
    coupon.discount_percent = data.get('discount_percent', coupon.discount_percent)
    coupon.discount_value = data.get('discount_value', coupon.discount_value)
    coupon.discount_type = data.get('discount_type', coupon.discount_type)
    coupon.min_purchase = data.get('min_purchase', coupon.min_purchase)
    coupon.max_discount = data.get('max_discount', coupon.max_discount)
    coupon.begin_date = data.get('begin_date', coupon.begin_date)
    coupon.end_date = data.get('end_date', coupon.end_date)
    coupon.status = data.get('status', coupon.status)
    coupon.updated_at = datetime.now()

    db.session.commit()
    return coupon


def get_branch_detail_service(branch_id):
    # Lấy thông tin chi tiết chi nhánh theo ID
    branch = Branch.query.get(branch_id)
    if not branch:
        return None

    return {
        "branch_id": branch.branch_id,
        "name": branch.name,
        "address": branch.address,
        "phone": branch.phone,
        "email": branch.email,
        "mapSrc": branch.mapSrc,
        "lat": float(branch.lat) if branch.lat else None,
        "lng": float(branch.lng) if branch.lng else None,
        "manager_id": branch.manager_id
    }

def get_branch_manager_info_service(branch_id):
    result = db.session.query(
        Branch.name.label('branch_name'),
        Employee.employee_id,
        Employee.employee_name,
        Employee.email,
        Employee.role_name,
        Employee.phone,
        Employee.status
    ).join(Employee, Branch.manager_id == Employee.employee_id)\
     .filter(Branch.branch_id == branch_id).first()

    if not result:
        return None

    return {
        "branch_name": result.branch_name,
        "manager_id": result.employee_id,
        "manager_name": result.employee_name,
        "email": result.email,
        "role": result.role_name,
        "status": result.status
    }


def get_all_products_service():
    products = Product.query.order_by(Product.product_id.desc()).all()

    result = []
    for product in products:
        result.append({
            "product_id": product.product_id,
            "name": product.name,
            "description": product.description,
            "image_url": product.image_url,
            "unit_price": float(product.unit_price) if product.unit_price else 0,
            "category_id": product.category_id,
            "created_at": product.created_at.strftime('%Y-%m-%d %H:%M:%S') if product.created_at else None,
            "updated_at": product.updated_at.isoformat() if product.updated_at else None
        })
    return result