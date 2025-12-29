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

        # 1. Kiểm tra đơn hàng có tồn tại và thuộc về khách hàng không
        order = Order.query.filter_by(order_id=order_id, customer_id=customer_id).first()
        if not order:
            return {"error": "Không tìm thấy đơn hàng hợp lệ"}, 404

        try:
            if comment_text:
                order.note = comment_text

            # 3. LƯU ĐÁNH GIÁ CỬA HÀNG (Bảng Feedback)
            # Sử dụng order_id làm khóa chính để đảm bảo mỗi đơn hàng chỉ có 1 đánh giá
            existing_feedback = Feedback.query.get(order_id)
            if not existing_feedback:
                new_feedback = Feedback(
                    order_id=order.order_id,
                    branch_id=order.branch_id,
                    customer_id=customer_id,
                    rating=data.get('branch_rating')
                )
                db.session.add(new_feedback)
            else:
                existing_feedback.rating = data.get('branch_rating')

            # 4. LƯU ĐÁNH GIÁ SHIPPER (Bảng ShipperReview)
            if order.shipper_id:
                existing_shipper_rev = ShipperReview.query.get(order_id)
                if not existing_shipper_rev:
                    new_shipper_review = ShipperReview(
                        order_id=order.order_id,
                        shipper_id=order.shipper_id,
                        customer_id=customer_id,
                        rating=data.get('shipper_rating')
                    )
                    db.session.add(new_shipper_review)
                else:
                    existing_shipper_rev.rating = data.get('shipper_rating')

            # 5. LƯU ĐÁNH GIÁ CHO TẤT CẢ SẢN PHẨM TRONG ĐƠN HÀNG
            # Tìm tất cả các món đồ (items) thuộc đơn hàng này
            order_items = OrderItem.query.filter_by(order_id=order_id).all()

            for item in order_items:
                # Kiểm tra đánh giá cũ dựa trên order_item_id
                existing_prod_rev = ProductReview.query.filter_by(
                    order_item_id=item.order_item_id
                ).first()

                if not existing_prod_rev:
                    new_product_review = ProductReview(
                        order_id=order_id,
                        order_item_id=item.order_item_id,
                        product_id=item.product_id,
                        customer_id=customer_id,
                        rating=product_rating,
                        created_at=datetime.now()
                    )
                    db.session.add(new_product_review)
                else:
                    existing_prod_rev.rating = product_rating
                    existing_prod_rev.created_at = datetime.now()

            db.session.commit()
            return {"message": "Đã lưu đánh giá trải nghiệm thành công!"}, 201

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500