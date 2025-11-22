from .. import db

class Employee(db.Model):
    __tablename__ = 'employees'

    employee_id = db.Column(db.Integer, primary_key=True)
    employee_name = db.Column(db.String(200))
    role_name = db.Column(db.String(100))
    email = db.Column(db.String(150))
    password = db.Column(db.String(200))
    salary = db.Column(db.Numeric(10,2))
    status = db.Column(db.String(50))
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.branch_id', ondelete='SET NULL'))
