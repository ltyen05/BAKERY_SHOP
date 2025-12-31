from hus_bakery_app.models.employee import Employee

def get_admin_information(e_id):
    admin = Employee.query.get(e_id)

    if not admin:
        return None

    info = {
        "id": admin.employee_id,
        "name": admin.employee_name,
        "role_name": admin.role_name,
        "email": admin.email,
        "salary": float(admin.salary) if admin.salary else 0,
        "status": admin.status,
        "branch_id": admin.branch_id,
    }
    return info