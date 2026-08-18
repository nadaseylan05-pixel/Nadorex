from django.db import transaction

from ..models import Notifications


def create_new_order_notifications(orders):
    """
    إنشاء إشعار new_order لكل بائع لديه منتج
    داخل الطلب.

    إذا كان الطلب يحتوي على 3 منتجات لنفس البائع:
        → إشعار واحد فقط.

    إذا كان يحتوي على منتجات لبائعين مختلفين:
        → إشعار لكل بائع.
    """

    if not orders:
        return []

    notifications = []

    # --------------------------------------------------
    # تجميع الطلبات حسب البائع
    # --------------------------------------------------

    merchants = {}

    for order in orders:

        if not order.merchant_id:
            continue

        if order.merchant_id not in merchants:
            merchants[order.merchant_id] = order

    # --------------------------------------------------
    # إنشاء إشعار لكل بائع
    # --------------------------------------------------

    for merchant_id, order in merchants.items():

        notification = Notifications.objects.create(
            merchant_id=merchant_id,
            order=order,
            notification_type="new_order",
            is_read=False,
        )

        notifications.append(notification)

    return notifications

def get_merchant_notifications(merchant, limit=30):
    """
    جلب آخر إشعارات البائع.
    """

    notifications = (
        Notification.objects
        .filter(merchant=merchant)
        .select_related("order")
        .order_by("-created_at")[:limit]
    )

    unread_count = (
        Notification.objects
        .filter(
            merchant=merchant,
            is_read=False
        )
        .count()
    )

    data = []

    for notification in notifications:

        data.append({
            "id": notification.id,

            "type": notification.notification_type,

            "is_read": notification.is_read,

            "created_at": (
                notification.created_at.isoformat()
                if notification.created_at
                else None
            ),

            "order_id": (
                notification.order_id
                if notification.order_id
                else None
            ),

            "order_number": (
                notification.order.order_number
                if notification.order
                else None
            ),
        })

    return {
        "notifications": data,
        "unread_count": unread_count,
    }