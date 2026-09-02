import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import { toggleFavoriteApi } from "./favoriteService";
import styles from "../../styles/ProductCard.module.css";

function ProductCard({ product, onFavoriteToggle, instagramUsername }) {
    const navigate = useNavigate();

    // 1. مزامنة حالة القلب مع بيانات المنتج مباشرةً
    const [isFavorite, setIsFavorite] = useState(Boolean(product.is_favorite));
    const [loading, setLoading] = useState(false);

    // تحديث الحالة محلية إذا تغيرت الخصائص (props) القادمة من الأب
    useEffect(() => {
        setIsFavorite(Boolean(product.is_favorite));
    }, [product.is_favorite]);

    const image =
        product.image_url ||
        product.base_image ||
        "/placeholder.png";

    // دالة الضغط على زر المفضلة
    const handleFavoriteClick = async (e) => {
        // منع الانتقال لصفحة التفاصيل
        e.stopPropagation();

        const buyerPhone = localStorage.getItem("buyer_phone");

        if (!buyerPhone) {
            alert("يرجى إدخال رقم الهاتف أولاً لإضافة المنتج للمفضلة");
            return;
        }

        // حفظ الحالة القديمة للاسترجاع عند حدوث خطأ
        const previousState = isFavorite;
        const newState = !previousState;

        // تحديث بصر الفوري فور الضغط مباشرةً
        setIsFavorite(newState);

        try {
            setLoading(true);

            // إرسال الطلب للـ Backend
            const res = await toggleFavoriteApi(buyerPhone, product.id);

            // اعتماد النتيجة النهائية المؤكدة من السيرفر
            setIsFavorite(res.is_favorite);

            // إذا كان المنتج في صفحة المفضلات وتم إزالتة، نبلغ المكون الأب ليحذفه من القائمة
            if (onFavoriteToggle && !res.is_favorite) {
                onFavoriteToggle(product.id);
            }
        } catch (error) {
            console.error("خطأ أثناء تحديث المفضلة:", error);
            // التراجع عن التغيير في حال فشل الاتصال بالشبكة
            setIsFavorite(previousState);
        } finally {
            setLoading(false);
        }
    };
    const handleShareClick = async (e) => {
        e.stopPropagation();

        const productUrl = `${window.location.origin}/${instagramUsername}/product/detail/${product.id}`;

        const shareData = {
            title: product.name,
            text: product.name,
            url: productUrl,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(productUrl);
                alert("تم نسخ رابط المنتج");
            }
        } catch (error) {
            // المستخدم أغلق نافذة المشاركة
            if (error.name !== "AbortError") {
                console.error("Share error:", error);
            }
        }
    };
    console.log(product);
    console.log("image_url =", product.image_url);
    console.log("base_image =", product.base_image);

    return (
        <div
            className={styles.card}
            // onClick={() => navigate(`/buyer/product/detail/${product.id}`)}
            onClick={() => navigate(`/${instagramUsername}/product/detail/${product.id}`)}
        >
            <div className={styles.imageWrapper}>
                <img
                    src={image}
                    alt={product.name}
                    className={styles.image}
                />
                {/* { <img
                src={
                    product.image_url && !product.image_url.includes(":8080")
                    ? product.image_url
                    : "https://via.placeholder.com/200?text=No+Image"
                } } */}
                {/* alt={product.name || "Product"}
                className={styles.productImage}
                onError={(e) => {
                    // التعامل مع فشل تحميل الصورة واستبدالها بصورة افتراضية لمنع توقف الصفحة
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/200?text=No+Image";
                }}
                / */}

                <button
                    type="button"
                    className={`${styles.favorite} ${isFavorite ? styles.favorited : ""}`}
                    onClick={handleFavoriteClick}
                    disabled={loading}
                    style={{
                        color: isFavorite ? "#ef4444" : "#6b7280",
                        fontSize: "20px",
                        background: "rgba(255, 255, 255, 0.8)",
                        border: "none",
                        borderRadius: "50%",
                        width: "35px",
                        height: "35px",
                        cursor: loading ? "wait" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "transform 0.2s"
                    }}
                >
                    {isFavorite ? "❤️" : "♡"}
                </button>
                <button
                    type="button"
                    className={styles.shareButton}
                    onClick={handleShareClick}
                    title="مشاركة المنتج"
                >
                    🔗
                </button>
            </div>

            <div className={styles.content}>
                <div className={styles.store}>
                    {product.store_name}
                </div>

                <div className={styles.title}>
                    {product.name}
                </div>

                {/* <div className={styles.rating}>
                    ⭐ 4.8
                    <span>(125)</span>
                </div> */}

                <div className={styles.priceRow}>
                    {product.old_price && (
                        <span className={styles.oldPrice}>
                            {product.old_price} $
                        </span>
                    )}

                    <span className={styles.price}>
                        {product.price} $
                    </span>
                </div>

                {/* <div className={styles.shipping}>
                    🚚 Free Shipping
                </div> */}
            </div>
        </div>
    );
}

export default ProductCard;