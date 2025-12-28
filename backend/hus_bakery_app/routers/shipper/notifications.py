
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
from hus_bakery_app.services.shipper.order_notifications import check_new_order_for_shipper
from hus_bakery_app.models.shipper_notificationss import ShipperNotification
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
            "has_new": True,
            "noti_id": noti.id,
            "order_id": noti.order_id,
            "note": noti.order.note,  # Cột note bạn đã chuyển sang bảng orders
            "address": noti.order.shipping_address
        }), 200

    return jsonify({"has_new": False}), 200


@shipper_notifications_bp.route("/mark-read/<int:noti_id>", methods=["POST"])
@jwt_required()
def mark_read(noti_id):
    noti = ShipperNotification.query.get(noti_id)
    if noti:
        noti.is_read = True
        db.session.commit()
    return jsonify({"success": True}), 200