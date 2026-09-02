
import React from "react";
import styles from "../../styles/CartDrawer.module.css";
import CartItem from "./CartItem";
import { useLanguage } from "../../context/LanguageContext";
import useTranslations from "../../hooks/useTranslations";
function CartDrawer({
    open,
    onClose,
    cartItems = [], // وضع مصفوفة فارغة كقيمة افتراضية للحماية
    cartCount,
    activeTab,
    setActiveTab,
    confirmedOrders = [], // وضع مصفوفة فارغة كقيمة افتراضية للحماية
    onIncrease,
    onDecrease,
    onRemove,
    onCheckout,
}) {

    const { t, loading } = useTranslations("translations/cart", lang);
    if (!open)
        return null;

    return (
        <div className={styles.overlay}>
            <div
                className={styles.background}
                onClick={onClose}
            />

            <div className={styles.drawer}>
                <div className={styles.header}>
                    <h2>Shopping</h2>
                    <button onClick={onClose}>✕</button>
                </div>

                <div className={styles.tabs}>
                    <button
                        onClick={() => setActiveTab("cart")}
                        style={{ fontWeight: activeTab === "cart" ? "bold" : "normal" }}
                    >
                        Cart ({cartCount})
                    </button>

                    <button
                        onClick={() => setActiveTab("orders")}
                        style={{ fontWeight: activeTab === "orders" ? "bold" : "normal" }}
                    >
                        {/* هنا نقرأ طول الطلبات المؤكدة بشكل آمن وبدون خطوط حمراء */}
                        Orders ({(confirmedOrders?.length || 0)})
                    </button>
                </div>

                <div className={styles.content}>
                    {/* {activeTab === "cart" && (
                        cartItems && cartItems.length
                        ?
                        cartItems.map((item, index) => (
                            <CartItem
                                // تم تعديل الـ key هنا ليعتمد على الـ item والـ index لضمان عدم حدوث أخطاء
                                key={item.cart_id || `${item.id}-${index}`}
                                item={item}
                                onIncrease={() => onIncrease(index)}
                                onDecrease={() => onDecrease(index)}
                                onRemove={() => onRemove(index)}
                                onCheckout={() => onCheckout(item, index)}
                            />
                        ))
                        :
                        <p>Cart Empty</p>
                    )} */}
                    {activeTab === "cart" && (
                        cartItems && cartItems.length > 0 ? (
                            cartItems.map((item, index) => {
                                // 🔴 1. طباعة البيانات لمعرفة أين تذهب الخواص
                                console.log(`CartDrawer - Item at [${index}]:`, item);

                                // 🔴 2. فحص ما إذا كانت البيانات مخزنة داخل كائن فرعي مثل item.product
                                const actualItem = item?.product || item;

                                // 🔴 3. إذا كان العنصر فارغاً تماماً ومستحيلاً رسمه، يتجاوزه بأمان
                                if (!actualItem || (!actualItem.id && !actualItem.name)) {
                                    return (
                                        <div key={index} style={{ padding: "10px", color: "red", fontSize: "12px" }}>
                                            ⚠️ عنصر غير صالح في السلة (Index: {index})
                                        </div>
                                    );
                                }

                                return (
                                    <CartItem
                                        key={actualItem.cart_id || actualItem.id || index}
                                        item={actualItem}
                                        onIncrease={() => onIncrease(index)}
                                        onDecrease={() => onDecrease(index)}
                                        onRemove={() => onRemove(index)}
                                        onCheckout={() => onCheckout(actualItem, index)}
                                    />
                                );
                            })
                        ) : (
                            <p>Cart Empty</p>
                        )
                    )}

                    {/* عرض الطلبات المؤكدة عند الضغط على تبويب orders */}
                    {activeTab === "orders" && (
                        confirmedOrders && confirmedOrders.length > 0
                            ?
                            <div className={styles.ordersList}>
                                {confirmedOrders.map((order, idx) => (
                                    <div key={order.order_id || order.id || idx} style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                                        <p>طلب رقم: #{order.order_id || order.id}</p>
                                        <p>الحالة: {order.status || "قيد المعالجة"}</p>
                                    </div>
                                ))}
                            </div>
                            :
                            <p>No confirmed orders</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CartDrawer;