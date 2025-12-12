from .. import db

class ShipperReview(db.Model):
    __tablename__ = 'shipper_reviews'

    shipper_id = db.Column(db.Integer, db.ForeignKey('shippers.shipper_id', ondelete="CASCADE"), primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id', ondelete="CASCADE"), primary_key=True)

    rating = db.Column(db.Integer)
    created_at = db.Column(db.DateTime)
