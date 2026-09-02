import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCsrfToken } from "./utils";
import OrderCard from "./OrderCard";
import styles from "../../styles/Buyer.module.css";
import { useCart } from "./context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
// تم التعديل لتعريف الدالة بشكل صحيح باستخدام function بدلاً من def الخاصة ببايثون
function BuyerOrders() {
    const [confirmedOrders, setConfirmedOrders] = useState([]);
    const navigate = useNavigate();
    const { lang } = useLanguage();
    const [t, testT] = useState({});


    // const { t, loading } = useTranslations("translations/cart", lang);
    const fetchOrders = () => {
        console.log("BuyerOrder RENDERED");
        // const phone = localStorage.getItem("buyer_phone");
        // داخل ملف BuyerOrders.jsx تأكدي من تعديل سطر جلب رقم الهاتف ليكون نظيفاً:
        const phone = localStorage.getItem("buyer_phone") ? localStorage.getItem("buyer_phone").trim() : "";

        if (!phone) {
            console.warn("⚠️ [BuyerOrders] لم يتم العثور على رقم هاتف العميل في الـ localStorage.");
            return;
        }
        fetch(`${import.meta.env.VITE_API_URL}/api/buyer/orders/confirmed/?phone=${phone}&lang=${lang}`, {
            // fetch(`http://127.0.0.1:8000/api/buyer/orders/confirmed/?phone=${phone}&lang=${lang}`, {
            credentials: "include"
        })
            .then((res) => {
                if (!res.ok) throw new Error(`سيرفر Django أرجع خطأ بحالة: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                console.log(data);
                // التحقق من أن البيانات قادمة على شكل مصفوفة داخل orders أو تعيين مصفوفة فارغة
                setConfirmedOrders(data.orders || []);
                setT(data.translations || {});

            })

            .catch((error) => {
                console.error("❌ [BuyerOrders Error]:", error);
            });
    };

    useEffect(() => {
        console.log("t =", t);
        fetchOrders();
        const interval = setInterval(() => {
            fetchOrders();
        }, 5000);

        return () => clearInterval(interval);
    }, [t]);

    const orderAction = async (action, id) => {
        try {
            // fetch("http://127.0.0.1:8000/api/orders/action/", {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/action/`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCsrfToken()
                },
                body: JSON.stringify({
                    order_id: id,
                    action
                })
            });

            const data = await response.json();
            // تم تصحيح الـ OR البرمجية هنا لتكون || بدلاً من word-based or
            if (!response.ok) throw new Error(data.message || "فشلت العملية");

            fetchOrders();
        } catch (error) {
            console.error(`❌ [Action Error]:`, error);
            alert("عذراً، فشل تنفيذ الإجراء.");
        }
    };
    console.log("t in BuyerOrders :", t);
    return (
        <div className={styles.ordersPageContainer} style={{ direction: "rtl", padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <div className={styles.pageHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2>{t.orders_list} ({confirmedOrders.length})</h2>
                <button
                    className={styles.backButton}
                    onClick={() => navigate("/buyer")}
                    style={{ padding: "8px 16px", cursor: "pointer", borderRadius: "5px" }}
                >
                    ⬅ {t.back_to_home}
                </button>
            </div>

            <hr style={{ borderColor: "#eee", marginBottom: "20px" }} />

            <div className={styles.pageContent}>
                {confirmedOrders.length === 0 ? (
                    <p className={styles.emptyMessage} style={{ textAlign: "center", color: "#666" }}>
                        لا توجد لديك أي طلبات مؤكدة حالياً برقم الهاتف هذا.
                    </p>
                ) : (
                    confirmedOrders.map((order) => (
                        <OrderCard
                            key={order.order_id}
                            order={order}
                            onAction={orderAction}
                            t={t}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default BuyerOrders;