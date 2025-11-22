from .. import db

class CartItem(db.Model):
    __tablename__ = 'cart_items'

    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id', ondelete="CASCADE"), primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id', ondelete="CASCADE"), primary_key=True)

    quantity = db.Column(db.Integer)
    added_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)
