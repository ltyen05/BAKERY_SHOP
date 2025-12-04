from ..models.product import Product
from ..models.coupon import Coupon
from ..models.coupon_custom import CouponCustomer
from ..models.cart_item import CartItem
from .. import db
from datetime import date

def add_to_cart(customer_id, product_id, quantity = 1):
    item = CartItem.query.filter_by(customer_id = customer_id, product_id = product_id).first()
    if item:
        item.quantity += quantity
    else:
        item = CartItem(
            customer_id = customer_id,
            product_id = product_id,
            quantity = quantity,
        )
        db.session.add(item)

    db.session.commit()
    return item

def update_selected(customer_id, product_id, selected: bool):
    item = CartItem.query.filter_by(
        customer_id=customer_id,
        product_id=product_id
    ).first()

    if not item:
        return None

    item.selected = selected
    db.session.commit()
    return item

def get_cart(customer_id):
    items = CartItem.query.filter_by(customer_id=customer_id).all()
    result = []

    for item in items:
        product = Product.query.get(item.product_id)
        result.append({
            "product_id": item.product_id,
            "quantity": item.quantity,
            "selected": item.selected,
            "product_name": product.name,
            "price": float(product.price)
        })

    return result

def coupon_of_customer(customer_id):
    coupons = CouponCustomer.query.filter_by(customer_id=customer_id, status="unused").all()

    result = []
    for cc in coupons:
        coupon = Coupon.query.get(cc.coupon_id)
        if coupon is None:
            continue

        # kiểm tra hạn sử dụng
        today = date.today()
        if coupon.begin_date and today < coupon.begin_date:
            continue
        if coupon.end_date and today > coupon.end_date:
            continue
        if coupon.status != "active":
            continue

        result.append({
            "coupon_id": coupon.coupon_id,
            "description": coupon.description,
            "discount_type": coupon.discount_type,
            "discount_percent": coupon.discount_percent,
            "discount_value": float(coupon.discount_value) if coupon.discount_value else None,
            "min_purchase": float(coupon.min_purchase) if coupon.min_purchase else None,
            "max_discount": float(coupon.max_discount) if coupon.max_discount else None,
            "begin_date": coupon.begin_date,
            "end_date": coupon.end_date
        })

    return result

def coupon_info(customer_id, coupon_id):
    cc = CouponCustomer.query.filter_by(
        customer_id=customer_id,
        coupon_id=coupon_id,
        status="unused"
    ).first()

    if not cc:
        return None

    coupon = Coupon.query.get(coupon_id)
    if not coupon:
        return None

    today = date.today()
    if coupon.begin_date and today < coupon.begin_date:
        return None
    if coupon.end_date and today > coupon.end_date:
        return None
    if coupon.status != "active":
        return None

    return {
        "coupon_id": coupon_id,
        "description": coupon.description,
        "discount_type": coupon.discount_type,
        "discount_percent": coupon.discount_percent,
        "discount_value": float(coupon.discount_value) if coupon.discount_value else None,
        "min_purchase": float(coupon.min_purchase) if coupon.min_purchase else None,
        "max_discount": float(coupon.max_discount) if coupon.max_discount else None,
    }


