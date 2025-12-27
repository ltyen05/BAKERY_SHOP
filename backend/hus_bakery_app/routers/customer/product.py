from flask import Blueprint, jsonify, request
from hus_bakery_app.services.customer.product_services import (
    get_top_3_products_service,
    get_products_by_category_service,
    get_product_details_service
)

product_bp = Blueprint('product_bp', __name__)


# Route nhận product_id trực tiếp từ đường dẫn URL
@product_bp.route("/<int:product_id>", methods=["GET"])
def get_product_details(product_id):
    # Gọi service xử lý logic
    data = get_product_details_service(product_id)

    if not data:
        return jsonify({"error": "Sản phẩm không tồn tại"}), 404

    # Giải nén kết quả (Product object và tên Category từ join query)
    product, category_name = data

    # Trả về JSON với tên cột khớp chính xác với file init.sql của bạn
    return jsonify({
        "product_id": product.product_id,
        "name": product.name,
        "price": float(product.unit_price) if product.unit_price else 0, # unit_price từ SQL
        "description": product.description,
        "image": product.image_url, # image_url từ SQL
        "category_name": category_name,
        "created_at": product.created_at.strftime('%Y-%m-%d %H:%M:%S') if hasattr(product, 'created_at') and product.created_at else None
    }), 200

@product_bp.route("/top-selling", methods=["GET"])
def api_get_top_products():
    # Dòng này PHẢI xuất hiện trong log Docker khi bạn bấm Send ở Postman
    print(">>> Kiem tra Router: Co chay vao day!") 
    try:
        top_products = get_top_3_products_service()
        if not top_products:
            print(">>> Kiem tra Service: Tra ve danh sach rong []")
            return jsonify({"message": "Chưa có dữ liệu bán hàng"}), 200
        return jsonify(top_products), 200
    except Exception as e:
        print(f">>> Kiem tra Loi: {str(e)}")
        return jsonify({"error": str(e)}), 500

@product_bp.route("/filter", methods=["GET"])
def api_filter_products_by_type():
    cat_id = request.args.get('category_id', type=int)

    if not cat_id:
        return jsonify({"error": "Vui lòng cung cấp category_id"}), 400

    try:
        products = get_products_by_category_service(cat_id)

        result = []
        for p, cat_name in products:
            result.append({
                "product_id": p.product_id,
                "price": p.unit_price,
                "name": p.name,
            })

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
