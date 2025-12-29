from sqlalchemy import func, desc
from hus_bakery_app import db
from hus_bakery_app.models.categories import Category
from hus_bakery_app.models.order_item import OrderItem
from hus_bakery_app.models.products import Product


def get_top_3_products_service():
    results = db.session.query(
        Product,
        func.sum(OrderItem.quantity).label('total_sold')
    ).join(OrderItem, Product.product_id == OrderItem.product_id) \
        .group_by(Product.product_id) \
        .order_by(desc('total_sold')) \
        .limit(3).all()

    top_3 = []
    for product, total in results:
        top_3.append({
            "product_id": product.product_id,
            "name": product.name,
            "price": float(product.unit_price),
            "total_sold": int(total),
            "image": product.image_url,
        })

    return top_3


def get_products_by_category_service(cat_id):
    results = db.session.query(Product, Category.name).join(
        Category, Product.category_id == Category.category_id
    ).filter(Product.category_id == cat_id).all()

    return results

def get_product_details_service(p_id):
    result = db.session.query(Product, Category.name).join(
        Category, Product.category_id == Category.category_id
    ).filter(Product.product_id == p_id).first()

    return result