from .. import db

class Shipper(db.Model):
    __tablename__ = 'shippers'

    shipper_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200))
    phone = db.Column(db.String(20))
    email = db.Column(db.String(150))
    status = db.Column(db.String(50))
    salary = db.Column(db.Numeric(10,2))
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.branch_id', ondelete='SET NULL'))
