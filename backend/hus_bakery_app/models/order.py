from .. import db

class Order(db.Model):
    __tablename__ = 'orders'

    order_id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id', ondelete="SET NULL"))
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.branch_id', ondelete="SET NULL"))
    shipper_id = db.Column(db.Integer, db.ForeignKey('shippers.shipper_id', ondelete="SET NULL"))
    coupon_id = db.Column(db.Integer, db.ForeignKey('coupons.coupon_id', ondelete="SET NULL"))

    total_amount = db.Column(db.Numeric(10,2))
    recipient_name = db.Column(db.String(200))
    shipping_address = db.Column(db.Text)
    payment_method = db.Column(db.String(50))
    created_at = db.Column(db.DateTime)
    status_entry = db.relationship('OrderStatus', backref='order', uselist=False)
    customer = db.relationship('Customer', backref='orders')

    def to_dict(self):
        return {
            "order_id": self.order_id,
            "total_amount": float(self.total_amount) if self.total_amount else 0,
            "recipient_name": self.recipient_name,
            "shipping_address": self.shipping_address,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None,

            # Lấy SĐT từ bảng Customer
            "customer_phone": self.customer.phone if self.customer else None,

            # Lấy Status và Note từ bảng OrderStatus
            "status": self.status_entry.status if self.status_entry else "N/A",
            "status_note": self.status_entry.note if self.status_entry else ""
        }
