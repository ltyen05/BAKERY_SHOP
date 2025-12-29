from sqlalchemy import desc

from hus_bakery_app import db
from hus_bakery_app.models.order import Order
from hus_bakery_app.models.order_item import OrderItem
from hus_bakery_app.models.products import Product
from hus_bakery_app.models.customer import Customer


def order_detail(order_id):
    results = (db.session.query(OrderItem, Product)
               .join(Product, OrderItem.product_id == Product.product_id)
               .filter(OrderItem.order_id == order_id)).all()

    order = Order.query.get(order_id)

    order_items_list = []
    for item, product in results:
        order_items_list.append({
            "product_name": product.name,
            "quantity": item.quantity,
            "price_at_purchase": float(item.price),
            "total_item_price": float(item.price * item.quantity),
            "branch": order.branch,
            "image": product.avatar
        })

    return order_items_list


def delete_order(order_id):
    order = Order.query.get(order_id)
    if order:
        db.session.delete(order)
        db.session.commit()
        return True
    return False


def get_all_orders_service():
    results = db.session.query(Order, Customer.name).join(
        Customer, Order.customer_id == Customer.customer_id
    ).order_by(desc(Order.created_at)).all()

    orders_list = []
    for order, customer_id in results:
        orders_list.append({
            "order_id": order.order_id,
            "customer_id": customer_id,
            "total_amount": float(order.total_amount),
            "order_address": order.shipping_address,
            "created_at": order.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            "shipper_id": order.shipper_id,
            "branch":order.branch_id,
            "status": getattr(order, 'status', 'Pending'),
        })
    return orders_list
