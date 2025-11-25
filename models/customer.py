from .. import db

class Customer(db.Model):
    __tablename__ = 'customers'

    customer_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200))
    email = db.Column(db.String(150), unique=True)
    phone = db.Column(db.String(20))
    avatar = db.Column(db.String(500))
    password = db.Column(db.String(200))
    created_at = db.Column(db.DateTime)

    def __init__(self, username, email, phone, password):
        self.username = username
        self.name = username
        self.email = email.lower()
        self.set_password(password)
