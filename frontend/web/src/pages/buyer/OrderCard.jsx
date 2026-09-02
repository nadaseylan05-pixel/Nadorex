import React, { useState } from "react";
import OrderDetailsModal from "./OrderDetailsModal";
import styles from "../../styles/Buyer.module.css";
import { useLanguage } from "../../context/LanguageContext";
function OrderCard({ order, onAction, t }) {
    console.log("OrderCarcd t =", t);
    const [showModal, setShowModal] = useState(false);
    const [loadingAction, setLoadingAction] = useState(null); // لتحديد الزر الذي يتم تحميله حالياً
    const { lang } = useLanguage();
    const orderId = order.order_id || order.id;
    const currentStatus = order.status;

    const returnDaysAllowed = order.return_days_allowed || 0;
    const isReturnPeriodValid = order.is_return_period_valid !== false;

    // دالة التعامل مع الأزرار لإضافة تأثير التحميل (Loading) أثناء معالجة الطلب
    const handleActionClick = async (actionType, id) => {
        setLoadingAction(actionType);
        try {
            await onAction(actionType, id); // نفترض أن onAction ترجع Promise
        } catch (error) {
            console.error("Action failed:", error);
        } finally {
            setLoadingAction(null);
        }
    };

    return (
        <div
            className={styles.orderCard}
            style={{
                border: "1px solid #f0f0f0",
                padding: "20px",
                margin: "15px 0",
                borderRadius: "12px",
                background: "#fff",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
                transition: "all 0.3s ease"
            }}
        >
            {/* الهيدر: رقم الطلب والحالة */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", color: "#1f2937" }}>
                    {lang === "ar" ? "رقمق الطلب" : "Order ID"}: <span style={{ color: "#4f46e5" }}>#{orderId}</span>
                </h3>
                <span
                    className={`${styles.statusBadge} ${styles[currentStatus]}`}
                    style={{
                        fontWeight: "600",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "13px"
                    }}
                >
                    {order.status_display || currentStatus}
                </span>
            </div>

            {/* تفاصيل السعر */}
            <p style={{ color: "#4b5563", fontSize: "15px", marginBottom: "15px" }}>
                {lang === "ar" ? "السعر الإجمالي:" : "total_price"}{" "}
                <strong style={{ color: "#111827", fontSize: "18px" }}>{order.total_price} $</strong>
            </p>

            {/* قسم الأزرار التفاعلية */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", borderTop: "1px solid #f3f4f6", paddingTop: "15px" }}>

                {/* زر التفاصيل الأساسي */}
                <button
                    className={styles.detailsButton}
                    onClick={() => setShowModal(true)}
                    style={{
                        padding: "8px 16px",
                        cursor: "pointer",
                        borderRadius: "6px",
                        border: "1px solid #e5e7eb",
                        background: "#f9fafb",
                        color: "#374151",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "background 0.2s"
                    }}
                >
                    <span>🔍</span>
                    {lang === "ar" ? "عرض التفاصيل والمنتجات" : "View Details"}
                </button>

                {/* 1. زر إلغاء الطلب (Pending / Processing) */}
                {(currentStatus === "pending" || currentStatus === "processing") && (
                    <button
                        className={styles.cancelButton}
                        disabled={loadingAction !== null}
                        onClick={() => handleActionClick("cancel", orderId)}
                        style={{
                            color: "#dc2626",
                            padding: "8px 16px",
                            cursor: "pointer",
                            border: "1px solid #fca5a5",
                            borderRadius: "6px",
                            background: "#fef2f2",
                            fontWeight: "600",
                            opacity: loadingAction ? 0.6 : 1,
                            transition: "all 0.2s"
                        }}
                    >
                        {loadingAction === "cancel"
                            ? (lang === "ar" ? "جاري الإلغاء..." : "Canceling...")
                            : (lang === "ar" ? "إلغاء الطلب" : "Cancel Order")}
                    </button>
                )}

                {/* 2. زر تأكيد الاستلام (Shipped) */}
                {currentStatus === "shipped" && (
                    <button
                        disabled={loadingAction !== null}
                        onClick={() => handleActionClick("delivered", orderId)}
                        style={{
                            padding: "8px 16px",
                            background: "#10b981",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                            boxShadow: "0 2px 4px rgba(16, 185, 129, 0.2)",
                            opacity: loadingAction ? 0.6 : 1,
                            transition: "all 0.2s"
                        }}
                    >
                        {loadingAction === "delivered"
                            ? (lang === "ar" ? "جاري التأكيد..." : "Updating...")
                            : (lang === "ar" ? "تأكيد الاستلام" : "Mark as Delivered")}
                    </button>
                )}

                {/* 3. زر طلب إرجاع (Delivered) */}
                {currentStatus === "delivered" && returnDaysAllowed > 0 && isReturnPeriodValid && (
                    <button
                        disabled={loadingAction !== null}
                        onClick={() => handleActionClick("return", orderId)}
                        style={{
                            padding: "8px 16px",
                            background: "#d97706",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                            boxShadow: "0 2px 4px rgba(217, 119, 6, 0.2)",
                            opacity: loadingAction ? 0.6 : 1,
                            transition: "all 0.2s"
                        }}
                    >
                        {loadingAction === "return"
                            ? (lang === "ar" ? "جاري الطلب..." : "Requesting...")
                            : (lang === "ar" ? "طلب إرجاع" : "Request Return")}
                    </button>
                )}

                {/* 4. زر إلغاء طلب الإرجاع (Return Requested) */}
                {currentStatus === "return_requested" && (
                    <button
                        disabled={loadingAction !== null}
                        onClick={() => handleActionClick("cancel_return", orderId)}
                        style={{
                            padding: "8px 16px",
                            background: "#4b5563",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                            opacity: loadingAction ? 0.6 : 1,
                            transition: "all 0.2s"
                        }}
                    >
                        {loadingAction === "cancel_return"
                            ? (lang === "ar" ? "جاري الإلغاء..." : "Canceling...")
                            : (lang === "ar" ? "إلغاء طلب الإرجاع" : "Cancel Return Request")}
                    </button>
                )}
            </div>

            {/* المودال الخاص بالتفاصيل */}
            {showModal && (
                <OrderDetailsModal
                    order={order}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}

export default OrderCard;