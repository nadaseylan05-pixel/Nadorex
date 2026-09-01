// import React from "react";
// import styles from "../../styles/Buyer.module.css";

// function OrderDetailsModal({ order, onClose }) {
//     return (
//         <div className={styles.modalOverlay} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1100, direction: "rtl" }}>
//             <div className={styles.modalContent} style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", maxWidth: "500px", width: "90%", maxHeight: "85vh", overflowY: "auto" }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
//                     <h3>تفاصيل المنتجات للطلب #{order.id}</h3>
//                     <button onClick={onClose} style={{ fontSize: "24px", background: "none", border: "none", cursor: "pointer" }}>×</button>
//                 </div>

//                 <div className={styles.buyerInfo} style={{ marginBottom: "15px", fontSize: "14px" }}>
//                     <p><strong>الاسم:</strong> {order.name}</p>
//                     <p><strong>العنوان:</strong> {order.address}</p>
//                     <p><strong>الهاتف:</strong> {order.phone}</p>
//                 </div>

//                 <h4 style={{ borderBottom: "1px solid #eee", paddingBottom: "5px" }}>المنتجات:</h4>
//                 <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
//                     {order.items && order.items.map((item, index) => (
//                         <div key={index} style={{ display: "flex", gap: "15px", alignItems: "center", padding: "10px", border: "1px solid #f5f5f5", borderRadius: "6px" }}>
//                             {item.image_url && (
//                                 <img src={item.image_url} alt={item.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
//                             )}
//                             <div style={{ flex: 1 }}>
//                                 <h4 style={{ margin: "0 0 5px 0" }}>{item.name}</h4>
//                                 <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
//                                     الكمية: {item.quantity} | السعر: {item.price} $
//                                 </p>
                                
//                                 {/* التحقق من المتغيرات الفرعية وعرضها في حال وجودها */}
//                                 <div style={{ display: "flex", gap: "8px", marginTop: "4px", fontSize: "11px", color: "#999" }}>
//                                     {item.color && <span>اللون: {item.color}</span>}
//                                     {item.size && <span>المقاس: {item.size}</span>}
//                                     {item.book_language && <span>اللغة: {item.book_language}</span>}
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 <div style={{ marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "10px", textAlign: "left" }}>
//                     <h3>إجمالي الطلب: {order.total_price} $</h3>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default OrderDetailsModal;
import React from "react";
import styles from "../../styles/Buyer.module.css";

function OrderDetailsModal({ order, onClose }) {

    const snapshot = order?.attributes_snapshot || {};

    const variant = snapshot?.variant || null;

    const productAttributes =
        snapshot?.product_attributes || [];

    const variantAttributes =
        snapshot?.variant_attributes || [];

    // =========================================================
    // ترجمة نوع الخاصية للعرض
    // =========================================================

    const renderAttributeValue = (attr) => {

        const value =
            attr?.value ??
            attr?.option_name ??
            "-";

        if (
            attr?.attribute_type === "color"
        ) {
            return (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <span
                        style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "50%",
                            backgroundColor:
                                value || "#ddd",
                            border:
                                "1px solid #ddd",
                            display: "inline-block",
                        }}
                        title={value}
                    />

                    <span
                        style={{
                            fontSize: "13px",
                            color: "#666",
                        }}
                    >
                        {value}
                    </span>
                </div>
            );
        }

        return (
            <span
                style={{
                    color: "#333",
                    fontWeight: "500",
                }}
            >
                {value}
            </span>
        );
    };


    // =========================================================
    // عرض مجموعة الخصائص
    // =========================================================

    const renderAttributes = (
        attributes,
        emptyMessage = "لا توجد خصائص"
    ) => {

        const validAttributes =
            attributes.filter(
                (attr) =>
                    attr &&
                    attr.value !== null &&
                    attr.value !== undefined &&
                    attr.value !== ""
            );

        if (!validAttributes.length) {
            return (
                <p
                    style={{
                        margin: 0,
                        color: "#999",
                        fontSize: "13px",
                    }}
                >
                    {emptyMessage}
                </p>
            );
        }

        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    border:
                        "1px solid #eee",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#fff",
                }}
            >
                {validAttributes.map(
                    (attr, index) => (
                        <div
                            key={
                                attr.attribute_id ??
                                index
                            }
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center",
                                gap: "20px",
                                padding:
                                    "11px 13px",
                                borderBottom:
                                    index !==
                                    validAttributes.length -
                                        1
                                        ? "1px solid #f1f1f1"
                                        : "none",
                            }}
                        >

                            <span
                                style={{
                                    color: "#777",
                                    fontSize:
                                        "13px",
                                    flexShrink: 0,
                                }}
                            >
                                {
                                    attr.attribute_name
                                }
                            </span>

                            {renderAttributeValue(
                                attr
                            )}

                        </div>
                    )
                )}
            </div>
        );
    };


    return (
        <div
            className={styles.modalOverlay}
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor:
                    "rgba(0,0,0,0.55)",
                display: "flex",
                justifyContent:
                    "center",
                alignItems: "center",
                zIndex: 1100,
                direction: "rtl",
                padding: "20px",
            }}
            onClick={onClose}
        >

            <div
                className={styles.modalContent}
                style={{
                    backgroundColor:
                        "#fff",
                    borderRadius: "16px",
                    maxWidth: "560px",
                    width: "100%",
                    maxHeight: "90vh",
                    overflowY:
                        "auto",
                    boxShadow:
                        "0 20px 50px rgba(0,0,0,0.18)",
                }}
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                {/* =================================================
                    Header
                ================================================= */}

                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "center",
                        padding:
                            "18px 20px",
                        borderBottom:
                            "1px solid #eee",
                    }}
                >

                    <div>

                        <h3
                            style={{
                                margin: 0,
                                fontSize:
                                    "18px",
                                color:
                                    "#222",
                            }}
                        >
                           {t.order_id}
                        </h3>

                        <span
                            style={{
                                display:
                                    "block",
                                marginTop:
                                    "4px",
                                fontSize:
                                    "12px",
                                color:
                                    "#999",
                            }}
                        >
                            رقم الطلب #
                            {
                                order?.order_number ||
                                order?.order_id ||
                                order?.id
                            }
                        </span>

                    </div>

                    <button
                        onClick={
                            onClose
                        }
                        style={{
                            width: "34px",
                            height: "34px",
                            borderRadius:
                                "50%",
                            border:
                                "none",
                            background:
                                "#f5f5f5",
                            fontSize:
                                "22px",
                            cursor:
                                "pointer",
                            color:
                                "#555",
                        }}
                    >
                        ×
                    </button>

                </div>


                {/* =================================================
                    Buyer information
                ================================================= */}

                <div
                    style={{
                        padding:
                            "18px 20px",
                        borderBottom:
                            "1px solid #eee",
                    }}
                >

                    <h4
                        style={{
                            margin:
                                "0 0 12px",
                            fontSize:
                                "15px",
                        }}
                    >
                        معلومات الاستلام
                    </h4>

                    <div
                        style={{
                            display:
                                "grid",
                            gap: "7px",
                            fontSize:
                                "13px",
                            color:
                                "#555",
                        }}
                    >

                        <div>
                            <strong>
                                الاسم:
                            </strong>{" "}
                            {order?.receiver_name ||
                                order?.name ||
                                "-"}
                        </div>

                        <div>
                            <strong>
                                العنوان:
                            </strong>{" "}
                            {order?.address ||
                                "-"}
                        </div>

                        <div>
                            <strong>
                                الهاتف:
                            </strong>{" "}
                            {order?.phone ||
                                "-"}
                        </div>

                    </div>

                </div>


                {/* =================================================
                    Product
                ================================================= */}

                <div
                    style={{
                        padding:
                            "18px 20px",
                    }}
                >

                    <h4
                        style={{
                            margin:
                                "0 0 12px",
                            fontSize:
                                "15px",
                        }}
                    >
                        المنتج
                    </h4>


                    <div
                        style={{
                            padding:
                                "14px",
                            border:
                                "1px solid #eee",
                            borderRadius:
                                "12px",
                            background:
                                "#fafafa",
                        }}
                    >

                        <div
                            style={{
                                display:
                                    "flex",
                                gap:
                                    "14px",
                                alignItems:
                                    "center",
                            }}
                        >

                            {order?.image_url && (
                                <img
                                    src={
                                        order.image_url
                                    }
                                    alt={
                                        order.name
                                    }
                                    style={{
                                        width:
                                            "75px",
                                        height:
                                            "75px",
                                        objectFit:
                                            "cover",
                                        borderRadius:
                                            "10px",
                                        background:
                                            "#eee",
                                    }}
                                />
                            )}

                            <div
                                style={{
                                    flex: 1,
                                }}
                            >

                                <h4
                                    style={{
                                        margin:
                                            "0 0 7px",
                                        fontSize:
                                            "15px",
                                        color:
                                            "#222",
                                    }}
                                >
                                    {
                                        order?.name ||
                                        "Product"
                                    }
                                </h4>

                                <div
                                    style={{
                                        display:
                                            "flex",
                                        gap:
                                            "12px",
                                        flexWrap:
                                            "wrap",
                                        fontSize:
                                            "13px",
                                        color:
                                            "#666",
                                    }}
                                >

                                    <span>
                                        الكمية:{" "}
                                        <strong>
                                            {
                                                order.quantity
                                            }
                                        </strong>
                                    </span>

                                    <span>
                                        السعر:{" "}
                                        <strong>
                                            {
                                                order.price
                                            }{" "}
                                            $
                                        </strong>
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        Product attributes
                    ================================================= */}

                    {productAttributes.length >
                        0 && (

                        <div
                            style={{
                                marginTop:
                                    "20px",
                            }}
                        >

                            <h4
                                style={{
                                    margin:
                                        "0 0 10px",
                                    fontSize:
                                        "15px",
                                }}
                            >
                                خصائص المنتج
                            </h4>

                            {renderAttributes(
                                productAttributes
                            )}

                        </div>
                    )}


                    {/* =================================================
                        Selected Variant
                    ================================================= */}

                    {variant && (

                        <div
                            style={{
                                marginTop:
                                    "20px",
                            }}
                        >

                            <h4
                                style={{
                                    margin:
                                        "0 0 10px",
                                    fontSize:
                                        "15px",
                                }}
                            >
                                النسخة المختارة
                            </h4>


                            <div
                                style={{
                                    border:
                                        "1px solid #e5e7eb",
                                    borderRadius:
                                        "12px",
                                    padding:
                                        "14px",
                                    background:
                                        "#fafafa",
                                }}
                            >

                                {variant.title && (
                                    <div
                                        style={{
                                            marginBottom:
                                                "10px",
                                            fontWeight:
                                                "600",
                                            fontSize:
                                                "15px",
                                        }}
                                    >
                                        {
                                            variant.title
                                        }
                                    </div>
                                )}


                                <div
                                    style={{
                                        display:
                                            "grid",
                                        gap:
                                            "6px",
                                        fontSize:
                                            "13px",
                                        color:
                                            "#666",
                                    }}
                                >

                                    {variant.sku && (
                                        <div>
                                            <strong>
                                                SKU:
                                            </strong>{" "}
                                            {
                                                variant.sku
                                            }
                                        </div>
                                    )}

                                    {variant.barcode && (
                                        <div>
                                            <strong>
                                                Barcode:
                                            </strong>{" "}
                                            {
                                                variant.barcode
                                            }
                                        </div>
                                    )}

                                    {variant.price && (
                                        <div>
                                            <strong>
                                                سعر النسخة:
                                            </strong>{" "}
                                            {
                                                variant.price
                                            }{" "}
                                            {
                                                variant.currency ||
                                                "$"
                                            }
                                        </div>
                                    )}

                                </div>

                            </div>

                        </div>
                    )}


                    {/* =================================================
                        Variant attributes
                    ================================================= */}

                    {variantAttributes.length >
                        0 && (

                        <div
                            style={{
                                marginTop:
                                    "20px",
                            }}
                        >

                            <h4
                                style={{
                                    margin:
                                        "0 0 10px",
                                    fontSize:
                                        "15px",
                                }}
                            >
                                {t.variant_properties}
                            </h4>

                            {renderAttributes(
                                variantAttributes
                            )}

                        </div>
                    )}


                    {/* =================================================
                        Total
                    ================================================= */}

                    <div
                        style={{
                            marginTop:
                                "22px",
                            paddingTop:
                                "15px",
                            borderTop:
                                "1px solid #eee",
                            display:
                                "flex",
                            justifyContent:
                                "space-between",
                            alignItems:
                                "center",
                        }}
                    >

                        <span
                            style={{
                                fontSize:
                                    "14px",
                                color:
                                    "#666",
                            }}
                        >
                            إجمالي الطلب
                        </span>

                        <strong
                            style={{
                                fontSize:
                                    "21px",
                                color:
                                    "#111",
                            }}
                        >
                            {
                                order?.total_price ??
                                0
                            }{" "}
                            $
                        </strong>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default OrderDetailsModal;