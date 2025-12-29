from hus_bakery_app import db
from hus_bakery_app.models.product_review import ProductReview
from hus_bakery_app.models.shipper_review import ShipperReview
from hus_bakery_app.models.feedback import Feedback
from hus_bakery_app.models.order import Order
from hus_bakery_app.models.order_item import OrderItem
from datetime import datetime


class IntegratedFeedbackService:
    @staticmethod
    def submit_full_experience(data, customer_id):
        order_id = data.get('order_id')
        comment_text = data.get('comment')
        product_rating = data.get('product_rating')
        branch_rating = data.get('branch_rating')
        shipper_rating = data.get('shipper_rating')

        order = Order.query.filter_by(order_id=order_id, customer_id=customer_id).first()
        if not order:
            return {"error": "Không tìm thấy đơn hàng"}, 404

        try:
            if comment_text:
                order.note = comment_text

            new_feedback = Feedback(
                order_id=order.order_id,
                branch_id=order.branch_id,
                customer_id=customer_id,
                rating=branch_rating
            )
            db.session.add(new_feedback)

            if order.shipper_id:
                new_shipper_review = ShipperReview(
                    order_id=order.order_id,
                    shipper_id=order.shipper_id,
                    customer_id=customer_id,
                    rating=shipper_rating
                )
                db.session.add(new_shipper_review)

            order_items = OrderItem.query.filter_by(order_id=order_id).all()
            for item in order_items:
                new_product_review = ProductReview(
                    order_id=order_id,
                    order_item_id=item.order_item_id,
                    product_id=item.product_id,
                    customer_id=customer_id,
                    rating=product_rating,
                    created_at=datetime.now()
                )
                db.session.add(new_product_review)

            db.session.commit()
            return {"message": "Đã gửi tất cả đánh giá thành công!"}, 201

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500