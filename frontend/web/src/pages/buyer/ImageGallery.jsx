// import React, { useMemo, useState, useEffect } from "react";

// import styles from "../../styles/ImageGallery.module.css";

// function ImageGallery({

//     product,
//     variant,

// }) {

//     const images = useMemo(() => {

//         if (
//             variant &&
//             variant.images &&
//             variant.images.length
//         ) {

//             return variant.images.map(img => ({
//                 image_url: img.image_url || img.image
//             }));

//         }

//         if (variant?.image_url)
//             return [{ image_url: variant.image_url }];

//         if (variant?.image)
//             return [{ image_url: variant.image }];

//         if (product.images?.length)
//             return product.images;

//         if (product.image_url)
//             return [{ image_url: product.image_url }];

//         if (product.base_image)
//             return [{ image_url: product.base_image }];

//         return [];

//     }, [product, variant]);

//     const [activeImage, setActiveImage] = useState(0);

//     useEffect(() => {

//         setActiveImage(0);

//     }, [variant]);

//     if (!images.length)
//         return null;

//     return (

//         <div className={styles.wrapper}>

//             <div className={styles.mainImage}>

//                 <img
//                     src={images[activeImage].image_url}
//                     alt={product.name}
//                 />

//             </div>

//             {images.length > 1 && (

//                 <div className={styles.thumbnails}>

//                     {images.map((img, index) => (

//                         <img
//                             key={index}
//                             src={img.image_url}
//                             alt=""
//                             onClick={() => setActiveImage(index)}
//                             className={
//                                 activeImage === index
//                                     ? styles.active
//                                     : ""
//                             }
//                         />

//                     ))}

//                 </div>

//             )}

//         </div>

//     );

// }

// export default ImageGallery;
import React, { useMemo, useState, useEffect } from "react";
import styles from "../../styles/ImageGallery.module.css";

function ImageGallery({ product, variant, onVariantChange }) {
    
    // 1. تجميع كافة الصور: صور المنتج الأساسية + صور كل النسخ النشطة
    const images = useMemo(() => {
        const list = [];

        // أ) إضافة الصور الأساسية للمنتج أولاً
        if (product.images?.length) {
            product.images.forEach(img => {
                list.push({
                    image_url: img.image_url || img.image,
                    associatedVariant: null // ليست تابعة لنسخة معينة
                });
            });
        } else {
            if (product.image_url) list.push({ image_url: product.image_url, associatedVariant: null });
            if (product.base_image) list.push({ image_url: product.base_image, associatedVariant: null });
        }

        // ب) إضافة صور النسخ (Variants) النشطة لتظهر كلها في التحديد
        if (product.variants?.length) {
            product.variants.forEach(v => {
                if (v.is_active) {
                    // إذا كانت النسخة تحتوي على مصفوفة صور
                    if (v.images?.length) {
                        v.images.forEach(img => {
                            const url = img.image_url || img.image;
                            // منع تكرار نفس رابط الصورة
                            if (!list.some(item => item.image_url === url)) {
                                list.push({ image_url: url, associatedVariant: v });
                            }
                        });
                    } 
                    // إذا كانت النسخة تحتوي على صورة واحدة مباشرة
                    else if (v.image_url || v.image) {
                        const url = v.image_url || v.image;
                        if (!list.some(item => item.image_url === url)) {
                            list.push({ image_url: url, associatedVariant: v });
                        }
                    }
                }
            });
        }

        return list;
    }, [product]);

    const [activeImage, setActiveImage] = useState(0);

    // 2. مراقبة التغيير القادم من الخارج (مثلاً لو تغيرت النسخة من مكان آخر)
    // لجعل الصورة الكبيرة تتحول تلقائياً لصورة النسخة المختارة
    useEffect(() => {
        if (variant) {
            const variantUrl = variant.image_url || variant.image || (variant.images?.[0]?.image_url || variant.images?.[0]?.image);
            if (variantUrl) {
                const targetIndex = images.findIndex(img => img.image_url === variantUrl);
                if (targetIndex !== -1) {
                    setActiveImage(targetIndex);
                }
            }
        }
    }, [variant, images]);

    if (!images.length) return null;

    // 3. عند الضغط على الصورة المصغرة
    const handleThumbnailClick = (index, imgItem) => {
        setActiveImage(index);

        // إذا كانت هذه الصورة مرتبطة بنسخة معينة ولها كمية في المخزن، قم بتحديدها فوراً
        if (imgItem.associatedVariant && onVariantChange) {
            if (imgItem.associatedVariant.stock > 0) {
                onVariantChange(imgItem.associatedVariant);
            }
        }
    };

    return (
        <div className={styles.wrapper}>
            {/* الصورة الرئيسية الكبيرة */}
            <div className={styles.mainImage}>
                <img
                    src={images[activeImage]?.image_url}
                    alt={product.name}
                />
            </div>

            {/* شريط الصور المصغرة للتحديد */}
            {images.length > 1 && (
                <div className={styles.thumbnails}>
                    {images.map((img, index) => {
                        const isSelected = activeImage === index;
                        const isOutOfStock = img.associatedVariant && img.associatedVariant.stock <= 0;

                        return (
                            <div 
                                key={index}
                                style={{ position: "relative", display: "inline-block" }}
                                className={`${activeImage === index ? styles.active : ""} ${isOutOfStock ? styles.disabled : ""}`}
                            >
                                <img
                                    src={img.image_url}
                                    alt=""
                                    onClick={() => handleThumbnailClick(index, img)}
                                    style={{
                                        cursor: isOutOfStock ? "not-allowed" : "pointer",
                                        opacity: isOutOfStock ? 0.4 : 1,
                                        border: isSelected ? "2px solid #4f46e5" : "1px solid #e5e7eb",
                                        transition: "all 0.2s ease"
                                    }}
                                />
                                {/* شارة صغيرة جداً تدل على نفاد الكمية فوق الصورة المصغرة */}
                                {isOutOfStock && (
                                    <span style={{
                                        position: "absolute",
                                        bottom: "2px",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        background: "#ef4444",
                                        color: "#fff",
                                        fontSize: "9px",
                                        padding: "1px 4px",
                                        borderRadius: "3px",
                                        whiteSpace: "nowrap",
                                        pointerEvents: "none"
                                    }}>
                                        منتهي
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ImageGallery;