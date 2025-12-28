from sqlalchemy import desc
from hus_bakery_app import db
from hus_bakery_app.models.products import Product

def get_all_products_admin_service():
    # Sắp xếp giảm dần theo ngày tạo để hiện sản phẩm mới nhất lên đầu
    products = Product.query.order_by(desc(Product.created_at)).all()

    return [{
        "product_id": p.product_id,
        "name": p.name,
        "category": p.category_id,  # Hoặc join bảng Category để lấy tên
        "price": float(p.unit_price),
        "description": p.description,
        "rating": getattr(p, 'rating', 5.0),  # Giả sử mặc định 5.0
        "image": p.image_url
    } for p in products]

def add_product_service(data):
    new_product = Product(
        name=data.get('name'),
        unit_price=data.get('unit_price'),
        description=data.get('description'),
        category_id=data.get('category_id'),
    )
    db.session.add(new_product)
    db.session.commit() # Lưu vào database
    return new_product


def edit_product_service(product_id, data):
    product = Product.query.get(product_id)
    if not product:
        return None

    product.name = data.get('name', product.name)
    product.price = data.get('price', product.unit_price)
    product.description = data.get('description', product.description)
    product.image_url = data.get('image', product.image_url)

    db.session.commit()
    return product

def delete_product_service(product_id):
    product = Product.query.get(product_id)
    if product:
        db.session.delete(product) # Xóa bản ghi
        db.session.commit()
        return True
    return False