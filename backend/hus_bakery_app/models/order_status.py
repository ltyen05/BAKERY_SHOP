from .. import db

class OrderStatus(db.Model):
    __tablename__ = 'order_status'

    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id', ondelete="CASCADE"), primary_key=True)
    status = db.Column(db.String(50), nullable=False)
    updated_at = db.Column(db.DateTime)
    note = db.Column(db.Text, nullable=False)
