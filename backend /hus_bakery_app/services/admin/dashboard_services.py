from hus_bakery_app import db
from hus_bakery_app.models.order import Order
from sqlalchemy import extract, func


def total_order_of_moth(month, year):
    orders_count= Order.query.filter(
        extract('month', Order.created_at) == month,
        extract('year', Order.created_at) == year,
    ).count()
    return orders_count

def total_amount_of_month(month, year):
    result = db.session.query(func.sum(Order.total_amount)).filter(
        extract('month', Order.created_at) == month,
        extract('year', Order.created_at) == year
    ).scalar()

    return float(result) if result else 0.0
