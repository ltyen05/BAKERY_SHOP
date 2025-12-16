from .. import db
from datetime import datetime

class Feedback(db.Model):
    __tablename__ = 'feedback'

    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id', ondelete="CASCADE"), primary_key=True)
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.branch_id', ondelete="CASCADE"))

    rating = db.Column(db.Integer)
    created_at = db.Column(db.DateTime)

    def __init__(self, order_id, branch_id, rating, comment):
        self.order_id = order_id
        self.branch_id = branch_id
        self.rating = rating
        self.comment = comment
        self.created_at = datetime.now()