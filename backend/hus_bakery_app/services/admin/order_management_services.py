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


def get_all_orders_service(branch_id):
    orders = Order.query.filter_by(branch_id=branch_id).order_by(desc(Order.created_at)).all()

    orders_list = []
    for order in orders:
        orders_list.append({
            "order_id": order.order_id,
            "customer_id": order.customer_id,
            "branch_id": order.branch_id,
            "shipper_id": order.shipper_id,
            "coupon_id": order.coupon_id,
            "shipping_address": order.shipping_address,
            "phone": order.phone,
            "payment_method": order.payment_method,
            "recipient_name": order.recipient_name,
            "total_amount": float(order.total_amount) if order.total_amount else 0,
            "note": getattr(order, 'note', ""), # Lấy ghi chú nếu có
            "created_at": order.created_at
        })
    return orders_list