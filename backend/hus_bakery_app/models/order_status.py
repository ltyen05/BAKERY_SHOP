from hus_bakery_app import db
from datetime import datetime


class OrderStatus(db.Model):
    __tablename__ = 'order_status'

    # Khóa chính id giúp SQLAlchemy quản lý được object
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    # order_id không phải primary_key nên nó có thể lặp lại (1 order nhiều status)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)

    status = db.Column(db.String(50), nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Quan hệ này giúp bạn lấy trạng thái mới nhất dễ dàng
    order = db.relationship('Order', backref=db.backref('status_history', lazy=True))