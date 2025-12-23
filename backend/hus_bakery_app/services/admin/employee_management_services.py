from backend.hus_bakery_app import db
from backend.hus_bakery_app.models.employee import Employee

def get_employee():
    employee = db.session.query(Employee).all()
    return employee

def add_employee_service(data):
    new_emp = Employee(
        employee_name=data.get('name'),
        employee_phone=data.get('phone'),
        employee_email=data.get('email'),
        employee_status=data.get('status', 'active'),
        role_id=data.get('role_id')
    )
    db.session.add(new_emp)
    db.session.commit()
    return new_emp

def edit_employee_service(emp_id, data):
    emp = Employee.query.get(emp_id)
    if emp:
        emp.employee_name = data.get('name', emp.employee_name)
        emp.employee_status = data.get('status', emp.employee_status)
        emp.role_id = data.get('role_id')
        emp.employee_phone = data.get('phone', emp.employee_phone)
        emp.employee_email = data.get('email', emp.employee_email)
        db.session.commit()
        return emp
    return None

def delete_employee_service(emp_id):
    emp = Employee.query.get(emp_id)
    if emp:
        db.session.delete(emp)
        db.session.commit()
        return True
    return False


