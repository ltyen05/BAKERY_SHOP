from .. import db
from datetime import datetime
from decimal import Decimal

class Product(db.Model):
    __tablename__ = 'products'
    
    product_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    unit_price = db.Column(db.Numeric(10, 2), nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.category_id', ondelete='SET NULL'), nullable=True)

    def __init__(self, name, description=None, short_desc=None, image_url=None, unit_price=None, category_id=None):
        self.name = name
        self.description = description
        self.short_desc = short_desc
        self.image_url = image_url
        self.unit_price = unit_price
        self.category_id = category_id