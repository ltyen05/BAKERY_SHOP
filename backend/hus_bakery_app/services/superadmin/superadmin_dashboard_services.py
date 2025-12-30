from sqlalchemy import func, extract
from hus_bakery_app import db
from hus_bakery_app.models.order import Order
from hus_bakery_app.models.branches import Branch
from hus_bakery_app.models.order_status import OrderStatus


def get_total_revenue_per_branch_service():
    results = db.session.query(
        Branch.name,
        func.sum(Order.total_amount).label('total_revenue')
    ).join(Order, Branch.branch_id == Order.branch_id)\
     .group_by(Branch.branch_id).all()

    return [
        {"branch_name": row[0], "total_revenue": float(row[1] or 0)} 
        for row in results
    ]

def get_order_delivery_stats_service():
    subquery = db.session.query(
        OrderStatus.order_id,
        func.max(OrderStatus.id).label('latest_status_id')
    ).group_by(OrderStatus.order_id).subquery()

    results = db.session.query(
        OrderStatus.status,
        func.count(OrderStatus.order_id)
    ).join(subquery, OrderStatus.id == subquery.c.latest_status_id)\
     .group_by(OrderStatus.status).all()

    return [{"status": row[0], "count": row[1]} for row in results]


def get_revenue_by_time_and_branch_service(period='month'):
    time_filter = extract('month', Order.created_at) if period == 'month' else extract('week', Order.created_at)

    results = db.session.query(
        time_filter.label('time_unit'),
        Branch.name,
        func.sum(Order.total_amount)
    ).join(Order, Branch.branch_id == Order.branch_id) \
        .group_by('time_unit', Branch.name) \
        .order_by('time_unit').all()

    # Định dạng lại dữ liệu để Frontend dễ vẽ biểu đồ cột chồng
    chart_data = {}
    for time_unit, branch_name, total in results:
        if time_unit not in chart_data:
            chart_data[time_unit] = {"time": time_unit}
        chart_data[time_unit][branch_name] = float(total or 0)

    return list(chart_data.values())