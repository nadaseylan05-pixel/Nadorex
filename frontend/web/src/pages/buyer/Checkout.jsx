
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "./context/CartContext";
import { getCsrfToken } from "./utils";
import styles from "../../styles/Cart.module.css"; // تأكد من مسار الستايل الخاص بك
import { useLanguage } from "../../context/LanguageContext";
import useTranslations from "../../hooks/useTranslations";
function Checkout({ lang = "en" }) {
    const navigate = useNavigate();
    const {instagramUsername}= useParams();
    const { cartItems, clearCart } = useCart(); // تفريغ السلة بعد نجاح العملية
    // const { t, loading } = useTranslations("translations/cart", lang);
    const { t, loading: translationsLoading } = useTranslations(
        "translations/cart",
        lang
    );

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: localStorage.getItem("buyer_phone") || "", // جلب الهاتف تلقائياً إن وجد
        email: ""
    });
    // const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // تنظيف البيانات من المسافات الزائدة قبل الفحص والإرسال
        const cleanName = formData.name.trim();
        const cleanAddress = formData.address.trim();
        const cleanPhone = formData.phone.trim();
        const cleanEmail = formData.email.trim();

        if (!cleanName || !cleanAddress || !cleanPhone) {
            setError("الرجاء ملء جميع الحقول الإلزامية.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            console.log("🚀 البيانات المرسلة إلى السيرفر:", {
                name: cleanName,
                phone: cleanPhone,
                address: cleanAddress
            });

            // // استخدام الـ Endpoint الخاص بك لتأكيد الطلب
            // fetch("http://127.0.0.1:8000/api/buyer/order/confirm/", {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/buyer/order/confirm/`, {
                method: "POST",
                credentials: "include", // للسماح بإرسال الـ Cookies وجلسة العمل
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCsrfToken() // حماية Django ضد الـ CSRF
                },
                body: JSON.stringify({
                    name: cleanName,
                    address: cleanAddress,
                    phone: cleanPhone,   // يتم إرساله هنا بشكل صريح ونظيف تماماً
                    email: cleanEmail,
                    
                    // تجهيز بيانات المنتجات من السلة بالشكل الذي يتوقعه السيرفر لديك
                    cart_items: cartItems.map(item => ({
                        id: item.id,
                        variant_id: item.variant_id || null,
                        quantity: item.quantity,
                        color: item.color || null,
                        size: item.size || null,
                        book_language: item.book_language || null,
                    })),
                    lang
                })
            });

            const data = await response.json();

            if (response.ok) {
                // حفظ رقم الهاتف الصافي لتتبع حالة الطلبات لاحقاً في قائمة طلباتي
                localStorage.setItem("buyer_phone", cleanPhone);
                
                // تنظيف السلة بعد الشراء
                if (clearCart) clearCart();

                alert(t.order_confirmed_successfully);
                
                // العودة لصفحة المشتري الرئيسية
                // navigate("/buyer");
                navigate(`/${instagramUsername}`);
            } else {
                setError(data.message || "فشل في تأكيد الطلب.");
            }
        } catch (err) {
            
            setError("حدث خطأ في الاتصال بالخادم.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page} style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", direction: "rtl" }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: "20px", padding: "8px 16px", cursor: "pointer" }}>
                ←{t.back_to_cart}
            </button>
            
            <h2>{t.basic_information}</h2>
            <hr />
            
            {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
                <div>
                    <label style={{ display: "block", marginBottom: "5px" }}>{t.name}</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "5px" }}>{t.address} *</label>
                    <input 
                        type="text" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleChange} 
                        required 
                        style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "5px" }}>{t.phone_number} *</label>
                    <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        required 
                        style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "5px" }}>{t.email} (اختياري)</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading || cartItems.length === 0}
                    style={{ 
                        padding: "12px", 
                        backgroundColor: "#28a745", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "4px", 
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "16px"
                    }}
                >
                    {loading ? "Loading.." : t.confirm_order}
                </button>
            </form>
        </div>
    );
}

export default Checkout;