from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
from hus_bakery_app.services.shipper.order_notifications import check_new_order_for_shipper,get_current_order
from hus_bakery_app.models.shipper_notificationss import ShipperNotification
from hus_bakery_app.services.shipper.update_status_order import update_status_order
from hus_bakery_app import db

# Tạo Blueprint với tên trùng với folder để dễ quản lý
shipper_notifications_bp = Blueprint("shipper_notifications", __name__)


@shipper_notifications_bp.route("/check-notification", methods=["GET"])
@jwt_required()
def check_notification():
    identity = json.loads(get_jwt_identity())
    shipper_id = identity["id"]

    # Tìm thông báo chưa đọc mới nhất từ bảng shipper_notification
    noti = ShipperNotification.query.filter_by(shipper_id=shipper_id, is_read=False) \
        .order_by(ShipperNotification.created_at.desc()).first()

    if noti:
        # Nhờ liên kết bảng, noti.order sẽ truy cập thẳng vào bảng orders
        return jsonify({
            "is_read": False,
            "id": noti.id,
            "order_id": noti.order_id,
            "note": noti.order.note,
            "address": noti.order.shipping_address
        }), 200

    return jsonify({"is_read": True}), 200


@shipper_notifications_bp.route("/mark-read/<int:noti_id>", methods=["POST"])
@jwt_required()
def mark_read(noti_id):
    noti = ShipperNotification.query.get(noti_id)
    if noti:
        noti.is_read = True
        db.session.commit()
    return jsonify({"success": True}), 200


@shipper_notifications_bp.route("/update_order_status", methods=["POST"])
@jwt_required()
def update_order_status():
    data = request.get_json()
    order_id = data.get("order_id")
    status = data.get("status")

    if not order_id or not status:
        return jsonify({"success": False, "message": "Thiếu thông tin order_id hoặc status"}), 400

    success, message = update_status_order(order_id, status)

    if success:
        return jsonify({"success": True, "message": message}), 200
    else:
        return jsonify({"success": False, "message": message}), 500
    
@shipper_notifications_bp.route("/current-order", methods=["GET"])
@jwt_required()
def current_order():
    identity = json.loads(get_jwt_identity())
    shipper_id = identity["id"]

    order , error = get_current_order(shipper_id)

    if error:
        return jsonify({"message": error}), 500
    if not order:
        return "", 204
        
    result = {
        "order_id": order[0],
        "status": order[1]
    }

    return jsonify(result), 200