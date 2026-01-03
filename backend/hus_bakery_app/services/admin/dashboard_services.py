from hus_bakery_app import db
from hus_bakery_app.models.order import Order
from hus_bakery_app.models.order_item import OrderItem
from hus_bakery_app.models.order_status import OrderStatus
from hus_bakery_app.models.products import Product
from hus_bakery_app.models.customer import Customer
from sqlalchemy import func, extract, desc
from datetime import datetime, timedelta


def get_time_filters(year, month=None, day=None, branch_id=None):
    """Hàm bổ trợ để tạo list các điều kiện lọc thời gian"""
    filters = [extract('year', Order.created_at) == year]
    if month:
        filters.append(extract('month', Order.created_at) == month)
    if day:
        filters.append(extract('day', Order.created_at) == day)
    if branch_id:
        filters.append(Order.branch_id == branch_id)
    return filters

def get_total_orders(year, month=None, day=None):
    filters = get_time_filters(year, month, day)
    return Order.query.filter(*filters).count()

def get_total_amount(year, month=None, day=None):
    filters = get_time_filters(year, month, day)
    result = db.session.query(func.sum(Order.total_amount)).filter(*filters).scalar()
    return float(result) if result else 0.0

def get_total_customers(year, month=None, day=None):
    filters = get_time_filters(year, month, day)
    res = db.session.query(func.count(Order.customer_id.distinct())).filter(*filters).scalar()
    return res if res else 0

def get_total_products(year, month=None, day=None):
    filters = get_time_filters(year, month, day)
    res = db.session.query(func.sum(OrderItem.quantity)) \
        .join(Order, Order.order_id == OrderItem.order_id) \
        .filter(*filters).scalar()
    return int(res) if res else 0

def get_weekly_revenue_overview(branch_id=None):
    # 1. Xác định ngày bắt đầu của tuần hiện tại (Thứ 2)
    today = datetime.now()
    start_of_week = today - timedelta(days=today.weekday())
    start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)

    query = db.session.query(
        func.date(Order.created_at).label('date'),
        func.sum(Order.total_amount).label('daily_total')
    ).filter(Order.created_at >= start_of_week)

    if branch_id:
        query = query.filter(Order.branch_id == branch_id)

    weekly_data = query.group_by(func.date(Order.created_at)).all()

    # 3. Chuẩn bị danh sách nhãn (Thứ) và giá trị mặc định là 0
    days_map = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    revenue_dict = {(start_of_week + timedelta(days=i)).date(): 0 for i in range(7)}

    # 4. Đổ dữ liệu từ Database vào dictionary
    for row in weekly_data:
        if row.date in revenue_dict:
            revenue_dict[row.date] = float(row.daily_total)

    # 5. Định dạng lại dữ liệu để trả về cho Frontend (như biểu đồ yêu cầu)
    chart_data = []
    total_week = 0
    for i, (date, amount) in enumerate(sorted(revenue_dict.items())):
        chart_data.append({
            "label": days_map[i],
            "amount": amount,
            "display": f"{amount / 1000000:.1f}M" if amount > 0 else "0"
        })
        total_week += amount

    return {
        "total_revenue": total_week,
        "total_display": f"{total_week / 1000000:.1f}Mđ",
        "details": chart_data
    }


def get_order_status_distribution(branch_id=None):
    # 1. Tìm ID mới nhất cho mỗi đơn hàng để lấy trạng thái hiện tại
    latest_status_ids = db.session.query(func.max(OrderStatus.id)).group_by(OrderStatus.order_id)

    # 2. Query chính
    query = db.session.query(
        OrderStatus.status,
        func.count(OrderStatus.id)
    ).join(Order, Order.order_id == OrderStatus.order_id) \
        .filter(OrderStatus.id.in_(latest_status_ids))

    if branch_id:
        query = query.filter(Order.branch_id == branch_id)

    status_counts = query.group_by(OrderStatus.status).all()

    # 3. Chuẩn hóa dữ liệu theo format ảnh thiết kế
    # Định nghĩa các nhóm hiển thị
    stats = {
        "Completed": 0,  # Tương ứng "Đã giao"
        "Pending": 0,  # Tương ứng "Đang xử lý"
        "Shipping": 0,  # Tương ứng "Đang giao"
        "Cancelled": 0  # Tương ứng "Đã hủy" (nếu có)
    }

    total = 0
    for status_name, count in status_counts:
        if status_name == "Đã giao":
            stats["Completed"] += count
        elif status_name == "Đang xử lý":
            stats["Pending"] += count
        elif status_name == "Đang giao":
            stats["Shipping"] += count
        elif status_name == "Đã hủy":
            stats["Cancelled"] += count
        total += count

    # 4. Tính toán phần trăm cho thanh progress bar (tùy chọn)
    result = []
    for key, value in stats.items():
        percentage = (value / total * 100) if total > 0 else 0
        result.append({
            "name": key,
            "value": value,
            "percentage": round(percentage, 1)
        })

    return {
        "total_orders": total,
        "distribution": result
    }


def get_top_selling_products(limit=5, branch_id=None):
    query = db.session.query(
        Product.name,
        Product.image_url,
        func.sum(OrderItem.quantity).label('total_quantity'),
        func.sum(OrderItem.quantity * OrderItem.price).label('total_revenue')
    ).join(OrderItem, Product.product_id == OrderItem.product_id) \
     .join(Order, OrderItem.order_id == Order.order_id)

    if branch_id:
        query = query.filter(Order.branch_id == branch_id)

    results = query.group_by(Product.product_id).order_by(desc('total_quantity')).limit(limit).all()

    # Tính toán % so với sản phẩm bán chạy nhất để hiển thị thanh progress bar
    max_qty = results[0].total_quantity if results else 1

    top_products = []
    for row in results:
        top_products.append({
            "name": row.name,
            "image": row.image_url,
            "orders": int(row.total_quantity),
            "revenue": f"{float(row.total_revenue) / 1000000:.1f}Mđ",
            "percentage": round((row.total_quantity / max_qty) * 100)
        })
    return top_products


def get_customer_growth_service(branch_id=None):
    current_year = datetime.now().year

    # Lưu ý: Nếu Customer không có branch_id, ta phải join qua Order để biết khách đó thuộc chi nhánh nào
    query = db.session.query(
        extract('month', Order.created_at).label('month'),
        func.count(Order.customer_id.distinct()).label('count')
    ).filter(extract('year', Order.created_at) == current_year)

    if branch_id:
        query = query.filter(Order.branch_id == branch_id)

    growth_data = query.group_by('month').order_by('month').all()

    # 3. Danh sách nhãn tháng (Khớp với biểu đồ Jan -> Jun)
    month_labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    # Khởi tạo dictionary với giá trị mặc định là 0 cho 12 tháng
    full_year_stats = {i: 0 for i in range(1, 13)}

    # 4. Cập nhật dữ liệu từ Database vào dictionary
    for row in growth_data:
        full_year_stats[int(row.month)] = row.count

    # 5. Định dạng dữ liệu trả về cho Frontend (Lấy 6 tháng đầu năm theo ảnh thiết kế)
    final_data = []
    for month_num in range(1, 7):
        final_data.append({
            "month": month_labels[month_num - 1],
            "customers": full_year_stats[month_num]
        })

    return final_data