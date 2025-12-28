from .. import db
import datetime

class OrderStatus(db.Model):
    __tablename__ = 'order_status'

    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id', ondelete="CASCADE"), primary_key=True)
    status = db.Column(db.String(50), nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow())
