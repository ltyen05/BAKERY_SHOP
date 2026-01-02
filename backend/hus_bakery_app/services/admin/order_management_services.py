from sqlalchemy import desc

from hus_bakery_app import db
from hus_bakery_app.models.order import Order
from hus_bakery_app.models.order_item import OrderItem
from hus_bakery_app.models.order_status import OrderStatus
from hus_bakery_app.models.products import Product
from hus_bakery_app.models.customer import Customer
from hus_bakery_app.models.shipper_notifications import ShipperNotification


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
            "branch": order.branch_id,
            "image": product.image_url
        })

    return {
        "shipping_address": order.shipping_address,  # Đây là phần bạn cần
        "order_items": order_items_list,
        "total_amount": float(order.total_amount)
    }


def delete_order(order_id):
    order = Order.query.get(order_id)
    if order:
        try:
            # 1. Xóa tất cả các thông báo liên quan đến đơn hàng này trước
            ShipperNotification.query.filter_by(order_id=order_id).delete()

            # 2. Xóa đơn hàng chính
            db.session.delete(order)

            # 3. Commit để thực hiện thay đổi
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()  # Hoàn tác nếu có lỗi
            print(f"Error deleting order: {e}")
            return False
    return False


def get_all_orders_service(branch_id):
    # 1. Lấy tất cả đơn hàng của chi nhánh
    orders = Order.query.filter_by(branch_id=branch_id).order_by(desc(Order.created_at)).all()

    orders_list = []
    for order in orders:
        # 2. Với mỗi đơn hàng, tìm các sản phẩm thông qua OrderItem và Product
        items = db.session.query(OrderItem, Product) \
            .join(Product, OrderItem.product_id == Product.product_id) \
            .filter(OrderItem.order_id == order.order_id).all()

        status = OrderStatus.query.get(order.order_id)
        # 3. Danh sách sản phẩm của đơn hàng này
        products_in_order = []
        for item_obj, product_obj in items:
            products_in_order.append({
                "product_id": product_obj.product_id,
                "name": product_obj.name,
                "image": product_obj.image_url,
                "quantity": item_obj.quantity,
                "price": float(item_obj.price) if item_obj.price else 0
            })

        # 4. Gom tất cả vào thông tin đơn hàng
        orders_list.append({
            "order_id": order.order_id,
            "customer_id": order.customer_id,
            "recipient_name": order.recipient_name,
            "total_amount": float(order.total_amount) if order.total_amount else 0,
            "created_at": order.created_at,
            "status": status.status,
            "items": products_in_order  # Đây là danh sách sản phẩm đã lấy ở trên
        })

    return orders_list