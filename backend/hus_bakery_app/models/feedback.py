from .. import db
from datetime import datetime

class Feedback(db.Model):
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id', ondelete="CASCADE"), primary_key=True)
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.branch_id', ondelete="CASCADE"))
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id', ondelete="CASCADE")) # Đã thêm customer_id

    rating = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)

    # Hàm khởi tạo đã bỏ comment, nội dung text sẽ được xử lý lưu vào bảng Orders.note trong Service
    def __init__(self, order_id, branch_id, customer_id, rating):
        self.order_id = order_id
        self.branch_id = branch_id
        self.customer_id = customer_id
        self.rating = rating