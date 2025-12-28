from sqlalchemy import func, desc
from hus_bakery_app import db
from hus_bakery_app.models.categories import Category
from hus_bakery_app.models.order_item import OrderItem
from hus_bakery_app.models.products import Product


def get_top_3_products_service():
    from sqlalchemy import func, desc
    try:
        # Dòng này sẽ in ra tên Database mà Flask đang kết nối trong Terminal
        print(f"DEBUG: Đang kết nối tới Database: {db.engine.url.database}")
<<<<<<< HEAD
        
        # Kiểm tra xem bảng products có bao nhiêu dòng
        p_count = db.session.query(Product).count()
        print(f"DEBUG: Số lượng sản phẩm trong DB: {p_count}")

        results = db.session.query(
            Product,
            func.sum(OrderItem.quantity).label('total_sold')
        ).join(OrderItem, Product.product_id == OrderItem.product_id) \
         .group_by(Product.product_id) \
         .order_by(desc('total_sold')) \
         .limit(3).all()
         
        if not results:
            return []

=======

        # Kiểm tra xem bảng products có bao nhiêu dòng
        p_count = db.session.query(Product).count()
        print(f"DEBUG: Số lượng sản phẩm trong DB: {p_count}")

        results = db.session.query(
            Product,
            func.sum(OrderItem.quantity).label('total_sold')
        ).join(OrderItem, Product.product_id == OrderItem.product_id) \
            .group_by(Product.product_id) \
            .order_by(desc('total_sold')) \
            .limit(3).all()

        if not results:
            return []

>>>>>>> backend
        top_3 = []
        for product, total in results:
            top_3.append({
                "product_id": product.product_id,
                "name": product.name,
                "price": float(product.unit_price) if product.unit_price else 0,
                "total_sold": int(total),
                "image_url": product.image_url
            })
        return top_3
    except Exception as e:
        # In lỗi chi tiết ra Terminal để biết cột nào bị sai (ví dụ: No such column...)
        print(f"LỖI SQLALCHEMY: {str(e)}")
        return None


def get_products_by_category_service(cat_id):
    results = db.session.query(Product, Category.name).join(
        Category, Product.category_id == Category.category_id
    ).filter(Product.category_id == cat_id).all()

    return results


def get_product_details_service(p_id):
    # Thực hiện join bảng products và categories dựa trên category_id
    result = db.session.query(Product, Category.name).join(
        Category, Product.category_id == Category.category_id
    ).filter(Product.product_id == p_id).first()

    return result