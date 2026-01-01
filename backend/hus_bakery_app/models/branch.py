from .. import db

class Branch(db.Model):
    __tablename__ = 'branches'

    branch_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    address = db.Column(db.String(255))
    phone = db.Column(db.String(20))
    email = db.Column(db.String(150))

    manager_id = db.Column(db.Integer, db.ForeignKey('employees.employee_id', ondelete='SET NULL'), unique=True)

    employees = db.relationship("Employee", backref="branch", foreign_keys='Employee.branch_id')
    shippers = db.relationship("Shipper", backref="branch", foreign_keys='Shipper.branch_id')
