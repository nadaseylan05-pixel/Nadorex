import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import styles from "../../styles/seller/SellerOrderDetails.module.css";

function SellerOrderDetails() {

    // ==================================================
    // orderNumber بدل orderId
    // ==================================================

    const { orderNumber } = useParams();

    const navigate = useNavigate();
    const { lang } = useLanguage();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [t, setT] = useState({});
    const [returnDays, setReturnDays] = useState({});
    const [selectedStatus, setSelectedStatus] = useState({});
    // ==================================================
    // جلب الطلب
    // ==================================================

    const fetchOrder = async () => {

        const token =
            localStorage.getItem("access_token");

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/seller/orders/${encodeURIComponent(orderNumber)}/?lang=${lang}`,
                // `http://localhost:8000/api/seller/orders/${encodeURIComponent(orderNumber)}/?lang=${lang}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();
            setT(data.translations || {});
            console.log("PRODUCT DETAILS RESPONSE:", data);
            console.log("TRANSLATIONS:", data.translations);
            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Failed to load order"
                );
            }

            setOrder(data.order);

        } catch (err) {

            console.error(
                "Seller order details error:",
                err
            );

            setError(
                err.message ||
                "حدث خطأ أثناء تحميل الطلب"
            );

        } finally {

            setLoading(false);
        }
    };

    // ==================================================
    // تحميل الطلب عند تغيير رقم الطلب أو اللغة
    // ==================================================
    // const handleUpdateStatus = async (orderItemId, status) => {
    //     const token = localStorage.getItem("access_token");

    //     try {
    //         const res = await fetch(
    //             `http://localhost:8000/api/seller/orders/${orderItemId}/update-status/?lang=${lang}`,
    //             {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //                 body: JSON.stringify({
    //                     status: status,
    //                 }),
    //             }
    //         );

    //         const data = await res.json();

    //         if (!res.ok || !data.success) {
    //             alert(
    //                 data.error ||
    //                 data.message ||
    //                 t.update_order_status_failed ||
    //                 "فشل تحديث حالة المنتج"
    //             );
    //             return;
    //         }

    //         alert(
    //             t.order_status_updated ||
    //             "تم تحديث حالة المنتج بنجاح ✅"
    //         );

    //         // إعادة جلب تفاصيل الطلب
    //         await fetchOrder();

    //     } catch (err) {
    //         console.error(
    //             "Error updating order status:",
    //             err
    //         );

    //         alert(
    //             t.update_order_status_error ||
    //             "حدث خطأ أثناء تحديث حالة المنتج"
    //         );
    //     }
    // };
    const handleUpdateStatus = async (orderItemId, status) => {
        const token = localStorage.getItem("access_token");

        // إذا اختار البائع الشحن، نطلب منه مدة الإرجاع أولاً
        if (status === "shipped") {
            const days = returnDays[orderItemId];

            if (days === undefined || days === "") {
                setSelectedStatus((prev) => ({
                    ...prev,
                    [orderItemId]: "shipped",
                }));

                return;
            }
        }

        try {
            const body = {
                status: status,
            };

            // نرسل مدة الإرجاع فقط عند الشحن
            if (status === "shipped") {
                body.return_days = Number(returnDays[orderItemId]);
            }

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/seller/orders/${orderItemId}/update-status/?lang=${lang}`,
                // `http://localhost:8000/api/seller/orders/${orderItemId}/update-status/?lang=${lang}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(body),
                }
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                alert(
                    data.error ||
                    data.message ||
                    t.update_order_status_failed ||
                    "فشل تحديث حالة المنتج"
                );
                return;
            }

            alert(
                t.order_status_updated ||
                "تم تحديث حالة المنتج بنجاح ✅"
            );

            // إخفاء حالة الاختيار المؤقتة
            setSelectedStatus((prev) => {
                const updated = { ...prev };
                delete updated[orderItemId];
                return updated;
            });

            await fetchOrder();

        } catch (err) {
            console.error(
                "Error updating order status:",
                err
            );

            alert(
                t.update_order_status_error ||
                "حدث خطأ أثناء تحديث حالة المنتج"
            );
        }
    };
    useEffect(() => {

        if (orderNumber) {
            fetchOrder();
        }

    }, [orderNumber, lang]);


    // ==================================================
    // Loading
    // ==================================================

    if (loading) {

        return (
            <div className={styles.page}>

                <div className={styles.loading}>
                    {t.loading_order_details}
                </div>

            </div>
        );
    }


    // ==================================================
    // Error
    // ==================================================

    if (error || !order) {

        return (
            <div className={styles.page}>

                <button
                    className={styles.backButton}
                    onClick={() => navigate(-1)}
                >
                    ← العودة
                </button>

                <div className={styles.error}>
                    {error || "الطلب غير موجود"}
                </div>

            </div>
        );
    }


    // ==================================================
    // المنتجات
    // ==================================================

    const items = order.items || [];


    // ==================================================
    // الصفحة
    // ==================================================

    return (

        <div className={styles.page}>

            {/* ==========================================
                Header
            ========================================== */}

            <div className={styles.header}>

                <button
                    className={styles.backButton}
                    onClick={() => navigate(-1)}
                >
                    ← {t.back_to_orders}
                </button>

                <div>

                    <h1>
                        {t.order_id}
                    </h1>

                    <span className={styles.orderNumber}>
                        #{order.order_number}
                    </span>

                </div>

            </div>


            {/* ==========================================
                Buyer
            ========================================== */}

            <section className={styles.card}>

                <h2>
                    {t.customer_information}
                </h2>

                <div className={styles.infoGrid}>

                    <Info
                        label={t.name}
                        value={order.buyer?.name}
                    />

                    {/* <Info
                        label="الهاتف"
                        value={order.buyer?.phone}
                    />

                    <Info
                        label="البريد الإلكتروني"
                        value={order.buyer?.email}
                    /> */}
                    {/* <Info
                        label={t.phone_number}
                        value={order.buyer?.phone}
                        type="phone"
                    /> */}
                    <Info
                        label={t.phone_number && t.phone_number !== "phone_number" ? t.phone_number : "رقم الهاتف"}
                        value={order?.buyer?.phone || "-"}
                        type="phone"
                    />
                    <Info
                        label={t.email}
                        value={order.buyer?.email}
                        type="email"
                    />
                    <Info
                        label="الدولة"
                        value={order.buyer?.country}
                    />

                    <Info
                        label="المدينة"
                        value={order.buyer?.city}
                    />

                    <Info
                        label="المنطقة"
                        value={order.buyer?.region}
                    />

                    <Info
                        label="الشارع"
                        value={order.buyer?.street}
                    />

                    <Info
                        label="البناء"
                        value={order.buyer?.building}
                    />

                    <Info
                        label="الشقة"
                        value={order.buyer?.apartment}
                    />

                </div>

                {order.buyer?.address && (

                    <div className={styles.address}>

                        <strong>
                            {t.address}:
                        </strong>

                        <span>
                            {order.buyer.address}
                        </span>

                    </div>

                )}

            </section>


            {/* ==========================================
                Products
            ========================================== */}

            <section className={styles.card}>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px"
                    }}
                >

                    <h2 style={{ margin: 0 }}>
                        {t.products}
                    </h2>

                    <span>
                        {order.products_count} {t.product}
                    </span>

                </div>


                {items.length === 0 ? (

                    <p className={styles.empty}>
                        لا توجد منتجات داخل هذا الطلب.
                    </p>

                ) : (

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "25px"
                        }}
                    >

                        {items.map((item, index) => (

                            <div
                                key={item.id || index}
                                className={styles.card}
                                style={{
                                    margin: 0,
                                    border: "1px solid #eee"
                                }}
                            >

                                {/* ==================================
                                    Product Header
                                ================================== */}

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "15px"
                                    }}
                                >

                                    <h3 style={{ margin: 0 }}>
                                        {t.product} #{index + 1}
                                    </h3>

                                    <span
                                        className={`${styles.status} ${styles[item.status]
                                            }`}
                                    >
                                        {item.status_display ||
                                            item.status}
                                    </span>

                                </div>

                                <div className={styles.statusSection}>

                                    <span className={styles.statusLabel}>
                                        {t.status}
                                    </span>

                                    <select
                                        value={item.status}
                                        onChange={(e) =>
                                            handleUpdateStatus(
                                                item.id,
                                                e.target.value
                                            )
                                        }
                                        style={{
                                            padding: "8px 12px",
                                            borderRadius: "6px",
                                            border: "1px solid #ddd",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <option value="processing">
                                            {t.processing || "قيد المعالجة"}
                                        </option>

                                        <option value="shipped">
                                            {t.shipped || "تم الشحن"}

                                        </option>

                                        <option value="delivered">
                                            {t.mark_as_delivered || "تم التسليم"}
                                        </option>

                                        <option value="return_requested">
                                            {t.return_processing || "طلب إرجاع"}
                                        </option>

                                        <option value="return_processing">
                                            {t.send_pickup_courier || "إرسال مندوب الاستلام"}
                                        </option>

                                        <option value="cancelled">
                                            {t.cancelled || "ملغى"}
                                        </option>


                                    </select>
                                    {/* عند اختيار الشحن لأول مرة: إدخال مدة الإرجاع */}
                                    {item.status === "processing" &&
                                        selectedStatus[item.id] === "shipped" && (

                                            <div className={styles.returnDaysBox}>

                                                <label>
                                                    {t.return_period_allowed ||
                                                        "مدة الإرجاع المسموح بها"}
                                                </label>

                                                <div className={styles.returnDaysInput}>

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={returnDays[item.id] ?? ""}
                                                        onChange={(e) =>
                                                            setReturnDays((prev) => ({
                                                                ...prev,
                                                                [item.id]: e.target.value,
                                                            }))
                                                        }
                                                    />

                                                    <span>
                                                        {t.day || "يوم"}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleUpdateStatus(
                                                                item.id,
                                                                "shipped"
                                                            )
                                                        }
                                                    >
                                                        {t.confirm_shipping ||
                                                            "تأكيد الشحن"}
                                                    </button>

                                                </div>

                                            </div>

                                        )}
                                    {/* بعد تأكيد الشحن: عرض مدة الإرجاع كنص */}
                                    {item.status === "shipped" &&
                                        item.return_days !== null &&
                                        item.return_days !== undefined && (

                                            <div className={styles.returnDaysInfo}>

                                                <span>
                                                    {t.return_period_allowed ||
                                                        "مدة الإرجاع المسموح بها"}:
                                                </span>

                                                <strong>
                                                    {item.return_days} {t.day || "يوم"}
                                                </strong>

                                            </div>

                                        )}
                                    {item.status === "delivered" &&
                                        item.return_days_remaining !== null && (

                                            <div className={styles.returnDaysInfo}>

                                                <span>
                                                    {t.return_days_remaining ||
                                                        "المتبقي من مدة الإرجاع"}:
                                                </span>

                                                <strong>
                                                    {item.return_days_remaining} {t.day || "يوم"}
                                                </strong>

                                            </div>

                                        )}

                                </div>
                                {/* ==================================
                                    Product
                                ================================== */}

                                <div className={styles.product}>

                                    {item.image_url && (

                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className={
                                                styles.productImage
                                            }
                                        />

                                    )}


                                    <div
                                        className={
                                            styles.productInfo
                                        }
                                    >

                                        <h3>
                                            {item.name}
                                        </h3>

                                        <Info
                                            label="الكمية"
                                            value={item.quantity}
                                        />

                                        <Info
                                            label="سعر الوحدة"
                                            value={`${item.price} ${item.variant?.currency ||
                                                "$"
                                                }`}
                                        />

                                        <Info
                                            label="إجمالي المنتج"
                                            value={`${item.total_price} ${item.variant?.currency ||
                                                "$"
                                                }`}
                                        />

                                    </div>

                                </div>


                                {/* ==================================
                                    Product Attributes
                                ================================== */}

                                {item.product_attributes?.length > 0 && (

                                    <div style={{ marginTop: "20px" }}>

                                        <h4>
                                            خصائص المنتج
                                        </h4>

                                        <div
                                            className={
                                                styles.attributesGrid
                                            }
                                        >

                                            {item.product_attributes.map(
                                                (attribute, attributeIndex) => (

                                                    <Attribute
                                                        key={attributeIndex}
                                                        attribute={attribute}
                                                    />

                                                )
                                            )}

                                        </div>

                                    </div>

                                )}


                                {/* ==================================
                                    Variant
                                ================================== */}

                                {item.variant && (

                                    <div style={{ marginTop: "20px" }}>

                                        <h4>
                                            {t.selected_variant}
                                        </h4>

                                        <div
                                            className={
                                                styles.infoGrid
                                            }
                                        >

                                            <Info
                                                label="عنوان النسخة"
                                                value={
                                                    item.variant.title
                                                }
                                            />

                                            <Info
                                                label="SKU"
                                                value={
                                                    item.variant.sku
                                                }
                                            />

                                            <Info
                                                label="Barcode"
                                                value={
                                                    item.variant.barcode
                                                }
                                            />

                                            <Info
                                                label="السعر"
                                                value={
                                                    item.variant.price
                                                }
                                            />

                                            <Info
                                                label="السعر السابق"
                                                value={
                                                    item.variant.old_price
                                                }
                                            />

                                            <Info
                                                label="الوزن"
                                                value={
                                                    item.variant.weight
                                                }
                                            />

                                        </div>

                                    </div>

                                )}


                                {/* ==================================
                                    Variant Attributes
                                ================================== */}

                                {item.variant &&
                                    item.variant_attributes?.length > 0 && (

                                        <div style={{ marginTop: "20px" }}>

                                            <h4>
                                                {t.variant_properties}
                                            </h4>

                                            <div
                                                className={
                                                    styles.attributesGrid
                                                }
                                            >

                                                {item.variant_attributes.map(
                                                    (attribute, attributeIndex) => (

                                                        <Attribute
                                                            key={attributeIndex}
                                                            attribute={attribute}
                                                        />

                                                    )
                                                )}

                                            </div>

                                        </div>

                                    )}

                            </div>

                        ))}

                    </div>

                )}

            </section>


            {/* ==========================================
                Order Summary
            ========================================== */}

            <section
                className={`${styles.card} ${styles.summary}`}
            >

                <div>

                    <span>
                        {t.total_products}
                    </span>

                    <strong>
                        {order.products_count}
                    </strong>

                </div>

                <div>

                    <span>
                        {t.total_quantity}
                    </span>

                    <strong>
                        {order.total_quantity}
                    </strong>

                </div>

                <div>

                    <span>
                        {t.order_total}
                    </span>

                    <strong>
                        {order.total_price} $
                    </strong>

                </div>

            </section>

        </div>
    );
}


/* ================================= */
/* Info Component */
/* ================================= */

// function Info({ label, value }) {

//     if (
//         value === null ||
//         value === undefined ||
//         value === ""
//     ) {
//         return null;
//     }

//     return (

//         <div className={styles.infoItem}>

//             <span>
//                 {label}
//             </span>

//             <strong>
//                 {value}
//             </strong>

//         </div>
//     );
// }

function Info({ label, value, type }) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    let content = value;

    if (type === "phone") {
        content = (
            <a
                href={`tel:${value}`}
                className={styles.contactLink}
            >
                {value}
            </a>
        );
    }

    if (type === "email") {
        content = (
            <a
                href={`mailto:${value}`}
                className={styles.contactLink}
            >
                {value}
            </a>
        );
    }

    return (
        <div className={styles.infoItem}>
            <span>{label}</span>
            <strong>{content}</strong>
        </div>
    );
}
/* ================================= */
/* Attribute Component */
/* ================================= */

function Attribute({ attribute }) {

    let value = attribute.value;

    if (attribute.option_name) {
        value = attribute.option_name;
    }

    return (

        <div
            className={
                styles.attributeItem
            }
        >

            <span>
                {attribute.attribute_name}
            </span>

            <strong>
                {value || "—"}
            </strong>

        </div>
    );
}


export default SellerOrderDetails;