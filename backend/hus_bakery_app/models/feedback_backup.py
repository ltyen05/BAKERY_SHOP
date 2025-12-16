from .. import db

class Feedback(db.Model):
    __tablename__ = 'feedback'

    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id', ondelete="CASCADE"), primary_key=True)
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.branch_id', ondelete="CASCADE"))

    rating = db.Column(db.Integer)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime)
