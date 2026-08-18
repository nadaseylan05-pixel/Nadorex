
// import React, { useEffect, useMemo, useState } from "react";
// import styles from "../../styles/ProductDetail.module.css";
// import ImageGallery from "./ImageGallery";
// import PriceBox from "./PriceBox";
// import QuantitySelector from "./QuantitySelector";
// import ProductVariants from "./VariantSelector";
// import { useParams } from "react-router-dom";
// import { useCart } from "./context/CartContext";
// import { useLanguage } from "../../context/LanguageContext";
// function ProductDetail() {
//     // جلب دالة addToCart التي تتوقع استقبال (product, variant, quantity)
//     const { addToCart } = useCart();
//     const { id } = useParams();

//     const [product, setProduct] = useState(null);
//     const [selectedVariant, setSelectedVariant] = useState(null);
//     const {lang} =useLanguage();
//     // اختيار النسخة الأولى تلقائياً عند تحميل بيانات المنتج
//     useEffect(() => {
//         if (product?.variants?.length) {
//             setSelectedVariant(product.variants[0]);
//         }
//     }, [product]);

//     // جلب تفاصيل المنتج من السيرفر
//     useEffect(() => {
//         fetch(`http://127.0.0.1:8000/api/buyer/product/${id}/?lang=${lang}`, {
//             credentials: "include",
//         })
//             .then(res => res.json())
//             .then(data => {
//                 setProduct(data);
//             });
//     }, [id]);

//     // معالجة الصور وحذف المكرر بناءً على النسخة المحددة
//     const mainImage = useMemo(() => {
//         if (!product) return [];
//         let images = [];

//         if (selectedVariant?.images?.length) {
//             images = [...selectedVariant.images];
//         } else if (selectedVariant?.image_url) {
//             images = [{ image_url: selectedVariant.image_url }];
//         }

//         if (product.images?.length) {
//             product.images.forEach((img) => {
//                 const url = img.image_url || img.image;
//                 if (!images.some(i => (i.image_url || i.image) === url)) {
//                     images.push(img);
//                 }
//             });
//         }

//         if (!images.length) {
//             images.push({
//                 image_url: product.image_url || product.base_image,
//             });
//         }

//         return images;
//     }, [product, selectedVariant]);

//     // المعالج الخاص بالإرسال إلى السلة
//     const handleAddToCart = (quantity) => {
//         if (!product) return;

//         // حماية: إذا كان المنتج يحتوي على خيارات (نسخ) ولم يحدد المشتري أي خيار
//         if (product.variants?.length && !selectedVariant) {
//             alert("يرجى اختيار المواصفات المطلوبة أولاً");
//             return;
//         }

//         // إرسال المعاملات الثلاثة منفصلة كما تتوقعها تماماً دالة addToCart في الـ Context
//         addToCart(product, selectedVariant, quantity);
//     };

//     if (!product) return <div>Loading...</div>;

//     return (
//         <div className={styles.page}>
//             <div className={styles.gallerySection}>
//                 <ImageGallery
//                     product={{
//                         ...product,
//                         images: mainImage
//                     }}
//                     variant={selectedVariant}
//                 />
//             </div>

//             <div className={styles.infoSection}>
//                 <h1>{product.name}</h1>
//                 <p className={styles.description}>{product.describtion}</p>

//                 {/* مكون اختيار النسخ */}
//                 {/* <ProductVariants
//                     product={product}
//                     onVariantChange={setSelectedVariant}
//                 /> */}

//                 {/* خصائص المنتج */}
//                 {/* خصائص المنتج الرئيسي */}
//                 {product.attributes?.length > 0 && (
//                     <div className={styles.productAttributes}>

//                         <h3 className={styles.attributesTitle}>
//                             Product details
//                         </h3>

//                         <div className={styles.attributesList}>

//                             {product.attributes.map((attr) => {

//                                 const value = attr.value;

//                                 if (
//                                     value === null ||
//                                     value === undefined ||
//                                     value === ""
//                                 ) {
//                                     return null;
//                                 }

//                                 return (
//                                     <div
//                                         key={attr.id}
//                                         className={styles.attributeItem}
//                                     >

//                                         <span className={styles.attributeName}>
//                                             {attr.attribute_name}
//                                         </span>

//                                         {attr.attribute_type === "color" ? (

//                                             <span
//                                                 className={styles.colorValue}
//                                                 style={{
//                                                     backgroundColor: value,
//                                                 }}
//                                                 title={value}
//                                             />

//                                         ) : (

//                                             <span className={styles.attributeValue}>
//                                                 {value}
//                                             </span>

//                                         )}

//                                     </div>
//                                 );
//                             })}

//                         </div>
//                     </div>
//                 )}
//                 {/* {product.attributes?.length > 0 && (
//                     <div className={styles.attributesSection}>
//                         <h3 className={styles.attributesTitle}>
//                             المواصفات
//                         </h3>

//                         <div className={styles.attributesList}>
//                             {product.attributes.map((attr) => (
//                                 <div
//                                     key={attr.id}
//                                     className={styles.attributeItem}
//                                 >
//                                     <span className={styles.attributeName}>
//                                         {attr.attribute_name}
//                                     </span>

//                                     {attr.attribute_type === "color" ? (
//                                         <span
//                                             className={styles.colorValue}
//                                             style={{
//                                                 backgroundColor: attr.value,
//                                             }}
//                                         />
//                                     ) : (
//                                         <span className={styles.attributeValue}>
//                                             {attr.option_name || attr.value || "-"}
//                                         </span>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )} */}

//                 {/* خصائص النسخة المحددة */}
//                 {/* <ProductVariants
//                     product={product}
//                     onVariantChange={setSelectedVariant}
//                 /> */}
//                 {selectedVariant?.attributes?.length > 0 && (
//                     <div className={styles.variantAttributesSection}>
//                         <h3 className={styles.attributesTitle}>
//                             مواصفات النسخة
//                         </h3>

//                         <div className={styles.attributesList}>
//                             {selectedVariant.attributes.map((attr) => (
//                                 <div
//                                     key={attr.id}
//                                     className={styles.attributeItem}
//                                 >
//                                     <span className={styles.attributeName}>
//                                         {attr.attribute_name}
//                                     </span>

//                                     {attr.attribute_type === "color" ? (
//                                         <span
//                                             className={styles.colorValue}
//                                             style={{
//                                                 backgroundColor: attr.value,
//                                             }}
//                                         />
//                                     ) : (
//                                         <span className={styles.attributeValue}>
//                                             {attr.option_name || attr.value || "-"}
//                                         </span>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 {/* عرض تفاصيل المخزن والـ SKU للنسخة المحددة */}
//                 {selectedVariant && (
//                     <div className={styles.variantBox}>
//                         <div>
//                             Stock: <b>{selectedVariant.stock}</b>
//                         </div>
//                         {selectedVariant.sku && (
//                             <div>
//                                 SKU: <b>{selectedVariant.sku}</b>
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 <PriceBox
//                     product={product}
//                     variant={selectedVariant}
//                 />

//                 {/* محدد الكمية وزر الإضافة */}
//                 <QuantitySelector
//                     product={product}
//                     variant={selectedVariant}
//                     onAddToCart={handleAddToCart} // مررنا المعالج هنا لاستقبال الكمية وربطها بالنسخة
//                 />
//             </div>
//         </div>
//     );
// }

// export default ProductDetail;
import React, { useEffect, useMemo, useState } from "react";
import styles from "../../styles/ProductDetail.module.css";
import ImageGallery from "./ImageGallery";
import PriceBox from "./PriceBox";
import QuantitySelector from "./QuantitySelector";
import { useParams } from "react-router-dom";
import { useCart } from "./context/CartContext";
import { useLanguage } from "../../context/LanguageContext";

function ProductDetail() {
    const { instagramUsername, id } = useParams();
    const { lang } = useLanguage();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);

    // =========================================================
    // FETCH PRODUCT
    // =========================================================

    // useEffect(() => {
    //     const fetchProduct = async () => {
    //         try {
    //             // const response = await fetch(
    //             //     `http://127.0.0.1:8000/api/buyer/product/${id}/?lang=${lang}`,
    //             //     {
    //             //         credentials: "include",
    //             //     }
    //             // );
    //             const response = await fetch(
    //                 `http://127.0.0.1:8000/api/buyer/product/${id}/?lang=${lang}&instagram_username=${encodeURIComponent(instagramUsername)}`,
    //                 {
    //                     credentials: "include",
    //                 }
    //             );
    //             if (!response.ok) {
    //                 throw new Error(
    //                     `Product request failed: ${response.status}`
    //                 );
    //             }

    //             const data = await response.json();

    //             setProduct(data);
    //             setSelectedVariant(null);

    //         } catch (error) {
    //             console.error("PRODUCT FETCH ERROR:", error);
    //         }
    //     };

    //     fetchProduct();
    // }, [id, lang, instagramUsername]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/buyer/product/${id}/?lang=${lang}&instagram_username=${encodeURIComponent(instagramUsername)}`,
                    {
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Product request failed: ${response.status}`
                    );
                }

                const data = await response.json();

                setProduct(data);
                setSelectedVariant(null);

            } catch (error) {
                console.error("PRODUCT FETCH ERROR:", error);
            }
        };

        fetchProduct();
    }, [id, lang, instagramUsername]);
    // =========================================================
    // ACTIVE VARIANTS
    // =========================================================

    const variants = useMemo(() => {
        return (product?.variants || []).filter(
            variant => variant.is_active
        );
    }, [product]);


    // =========================================================
    // MAIN PRODUCT IMAGES
    // =========================================================

    const productImages = useMemo(() => {
        if (!product) return [];

        const images = [];

        const addImage = (url) => {
            if (!url) return;

            if (!images.some(
                image =>
                    (image.image_url || image.image) === url
            )) {
                images.push({
                    image_url: url,
                });
            }
        };

        addImage(product.base_image);
        addImage(product.image_url);

        (product.images || []).forEach(image => {
            addImage(image.image_url || image.image);
        });

        return images;

    }, [product]);


    // =========================================================
    // SELECTED VARIANT IMAGES
    // =========================================================
    // مهم:
    // هذه الصور لا تستخدم إلا عندما يتم اختيار Variant.
    // =========================================================

    const selectedVariantImages = useMemo(() => {

        if (!selectedVariant) {
            return [];
        }

        const images = [];

        const addImage = (url) => {
            if (!url) return;

            if (!images.some(
                image =>
                    (image.image || image.image_url) === url
            )) {
                images.push({
                    image: url,
                });
            }
        };

        // الصورة الرئيسية للـ Variant
        addImage(
            selectedVariant.image ||
            selectedVariant.image_url
        );

        // الصور الإضافية للـ Variant
        (selectedVariant.images || []).forEach(image => {
            addImage(
                image.image ||
                image.image_url
            );
        });

        return images;

    }, [selectedVariant]);


    // =========================================================
    // CURRENT IMAGES
    // =========================================================

    const currentImages = selectedVariant
        ? selectedVariantImages
        : productImages;


    // =========================================================
    // CURRENT TITLE
    // =========================================================

    const currentTitle = selectedVariant
        ? selectedVariant.title || product.name
        : product?.name;


    // =========================================================
    // CURRENT DESCRIPTION
    // =========================================================

    const currentDescription = selectedVariant
        ? (
            selectedVariant.description ||
            selectedVariant.describtion ||
            product?.describtion
        )
        : product?.describtion;


    // =========================================================
    // SELECT VARIANT
    // =========================================================

    const handleVariantSelect = (variant) => {

        setSelectedVariant(variant);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    // =========================================================
    // BACK TO MAIN PRODUCT
    // =========================================================

    const handleBackToProduct = () => {

        setSelectedVariant(null);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    // =========================================================
    // ADD TO CART
    // =========================================================

    // const handleAddToCart = (quantity) => {

    //     if (!product) return;

    //     if (
    //         variants.length > 0 &&
    //         !selectedVariant
    //     ) {
    //         alert("يرجى اختيار النسخة المطلوبة أولاً");
    //         return;
    //     }

    //     addToCart(
    //         product,
    //         selectedVariant,
    //         quantity
    //     );
    // };

    const handleAddToCart = (quantity) => {
        if (!product) return;

        addToCart(
            product,
            selectedVariant,
            quantity
        );
    };
    // =========================================================
    // COLOR
    // =========================================================

    const getVariantColor = (variant) => {

        const colorAttribute =
            (variant.attributes || []).find(
                attr =>
                    attr.attribute_type === "color"
            );

        return (
            colorAttribute?.value ||
            variant.color_hex ||
            null
        );
    };


    // =========================================================
    // ATTRIBUTE VALUE
    // =========================================================

    const getAttributeValue = (attr) => {

        return (
            attr.option_name ||
            attr.value_name ||
            attr.value ||
            attr.option ||
            null
        );
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (!product) {
        return (
            <div className={styles.loading}>
                Loading product...
            </div>
        );
    }


    return (

        <div className={styles.page}>

            {/* =====================================================
                PRODUCT HEADER
            ===================================================== */}

            <div className={styles.productHeader}>

                <div className={styles.breadcrumb}>
                    Home
                    <span>/</span>
                    {product.name}
                </div>

                {selectedVariant && (

                    <button
                        type="button"
                        className={styles.backButton}
                        onClick={handleBackToProduct}
                    >
                        ← Back to product
                    </button>

                )}

            </div>


            {/* =====================================================
                MAIN PRODUCT AREA
            ===================================================== */}

            <div className={styles.productLayout}>

                {/* =================================================
                    GALLERY
                ================================================= */}

                <div className={styles.gallerySection}>

                    <ImageGallery
                        product={{
                            ...product,
                            images: currentImages,
                        }}
                        variant={selectedVariant}
                    />

                </div>


                {/* =================================================
                    PRODUCT INFO
                ================================================= */}

                <div className={styles.infoSection}>

                    {/* ---------------------------------------------
                        Selected variant badge
                    --------------------------------------------- */}

                    {selectedVariant && (

                        <div className={styles.selectedBadge}>
                            Selected option
                        </div>

                    )}


                    {/* ---------------------------------------------
                        TITLE
                    --------------------------------------------- */}

                    <h1 className={styles.productTitle}>
                        {currentTitle}
                    </h1>


                    {/* ---------------------------------------------
                        DESCRIPTION
                    --------------------------------------------- */}

                    {currentDescription && (

                        <p className={styles.description}>
                            {currentDescription}
                        </p>

                    )}


                    {/* =================================================
                        MAIN PRODUCT ATTRIBUTES
                    ================================================= */}

                    {!selectedVariant &&
                        product.attributes?.length > 0 && (

                            <div
                                className={
                                    styles.attributesCard
                                }
                            >

                                <h3>
                                    Product details
                                </h3>

                                <div
                                    className={
                                        styles.attributesList
                                    }
                                >

                                    {product.attributes.map(
                                        attr => {

                                            const value =
                                                attr.value;

                                            if (
                                                value === null ||
                                                value === undefined ||
                                                value === ""
                                            ) {
                                                return null;
                                            }

                                            return (

                                                <div
                                                    key={attr.id}
                                                    className={
                                                        styles.attributeRow
                                                    }
                                                >

                                                    <span
                                                        className={
                                                            styles.attributeName
                                                        }
                                                    >
                                                        {
                                                            attr.attribute_name
                                                        }
                                                    </span>


                                                    {attr.attribute_type ===
                                                    "color" ? (

                                                        <span
                                                            className={
                                                                styles.colorValue
                                                            }
                                                            style={{
                                                                backgroundColor:
                                                                    value,
                                                            }}
                                                            title={value}
                                                        />

                                                    ) : (

                                                        <span
                                                            className={
                                                                styles.attributeValue
                                                            }
                                                        >
                                                            {value}
                                                        </span>

                                                    )}

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            </div>

                        )}


                    {/* =================================================
                        SELECTED VARIANT ATTRIBUTES
                    ================================================= */}

                    {selectedVariant &&
                        selectedVariant.attributes?.length > 0 && (

                            <div
                                className={
                                    styles.attributesCard
                                }
                            >

                                <h3>
                                    Variant details
                                </h3>

                                <div
                                    className={
                                        styles.attributesList
                                    }
                                >

                                    {selectedVariant.attributes.map(
                                        attr => {

                                            const value =
                                                getAttributeValue(
                                                    attr
                                                );

                                            if (
                                                value === null ||
                                                value === undefined ||
                                                value === ""
                                            ) {
                                                return null;
                                            }

                                            return (

                                                <div
                                                    key={attr.id}
                                                    className={
                                                        styles.attributeRow
                                                    }
                                                >

                                                    <span
                                                        className={
                                                            styles.attributeName
                                                        }
                                                    >
                                                        {
                                                            attr.attribute_name
                                                        }
                                                    </span>


                                                    {attr.attribute_type ===
                                                    "color" ? (

                                                        <span
                                                            className={
                                                                styles.colorValue
                                                            }
                                                            style={{
                                                                backgroundColor:
                                                                    attr.value ||
                                                                    "#ddd",
                                                            }}
                                                            title={
                                                                attr.value ||
                                                                ""
                                                            }
                                                        />

                                                    ) : (

                                                        <span
                                                            className={
                                                                styles.attributeValue
                                                            }
                                                        >
                                                            {value}
                                                        </span>

                                                    )}

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            </div>

                        )}


                    {/* =================================================
                        STOCK / SKU
                    ================================================= */}

                    <div className={styles.inventoryCard}>

                        <div>
                            <span>
                                Stock
                            </span>

                            <strong>
                                {selectedVariant
                                    ? selectedVariant.stock
                                    : product.stock}
                            </strong>
                        </div>


                        {selectedVariant?.sku && (

                            <div>
                                <span>
                                    SKU
                                </span>

                                <strong>
                                    {selectedVariant.sku}
                                </strong>
                            </div>

                        )}

                    </div>


                    {/* =================================================
                        PRICE
                    ================================================= */}

                    <PriceBox
                        product={product}
                        variant={selectedVariant}
                    />


                    {/* =================================================
                        QUANTITY
                    ================================================= */}

                    <div className={styles.purchaseBox}>

                        <QuantitySelector
                            product={product}
                            variant={selectedVariant}
                            onAddToCart={handleAddToCart}
                        />

                    </div>

                </div>

            </div>


            {/* =====================================================
                VARIANTS SECTION
            ===================================================== */}

            {variants.length > 0 && (

                <section
                    className={
                        styles.variantsSection
                    }
                >

                    <div
                        className={
                            styles.variantsHeader
                        }
                    >

                        <div>

                            <h2>
                                Choose your option
                            </h2>

                            <p>
                                Select an option to view its
                                photos and details.
                            </p>

                        </div>

                        {selectedVariant && (

                            <button
                                type="button"
                                className={
                                    styles.clearSelection
                                }
                                onClick={
                                    handleBackToProduct
                                }
                            >
                                View main product
                            </button>

                        )}

                    </div>


                    {/* =================================================
                        VARIANT CARDS
                    ================================================= */}

                    <div
                        className={
                            styles.variantsGrid
                        }
                    >

                        {variants.map(variant => {

                            /*
                             * مهم جدًا:
                             * هنا نأخذ الصورة الأولى فقط.
                             *
                             * لا نعرض variant.images
                             * للمستخدم هنا.
                             *
                             * الصور الإضافية تظهر فقط
                             * بعد اختيار الـ Variant.
                             */

                            const primaryImage =
                                variant.image ||
                                variant.image_url ||
                                variant.images?.[0]?.image ||
                                variant.images?.[0]?.image_url ||
                                null;


                            const color =
                                getVariantColor(
                                    variant
                                );


                            const isSelected =
                                selectedVariant?.id ===
                                variant.id;


                            return (

                                <button
                                    key={variant.id}
                                    type="button"
                                    className={`
                                        ${styles.variantCard}
                                        ${
                                            isSelected
                                                ? styles.variantSelected
                                                : ""
                                        }
                                    `}
                                    onClick={() =>
                                        handleVariantSelect(
                                            variant
                                        )
                                    }
                                >

                                    {/* ---------------------------------
                                        IMAGE
                                    --------------------------------- */}

                                    <div
                                        className={
                                            styles.variantImageWrapper
                                        }
                                    >

                                        {primaryImage ? (

                                            <img
                                                src={
                                                    primaryImage.startsWith(
                                                        "http"
                                                    )
                                                        ? primaryImage
                                                        : `http://127.0.0.1:8000${primaryImage}`
                                                }
                                                className={
                                                    styles.variantImage
                                                }
                                                alt={
                                                    variant.title ||
                                                    "Variant"
                                                }
                                            />

                                        ) : (

                                            <div
                                                className={
                                                    styles.noVariantImage
                                                }
                                            >
                                                No image
                                            </div>

                                        )}


                                        {isSelected && (

                                            <div
                                                className={
                                                    styles.selectedOverlay
                                                }
                                            >
                                                ✓
                                            </div>

                                        )}

                                    </div>


                                    {/* ---------------------------------
                                        CARD INFO
                                    --------------------------------- */}

                                    <div
                                        className={
                                            styles.variantContent
                                        }
                                    >

                                        <strong
                                            className={
                                                styles.variantTitle
                                            }
                                        >
                                            {variant.title}
                                        </strong>


                                        {/* COLOR */}

                                        {color && (

                                            <div
                                                className={
                                                    styles.variantColorRow
                                                }
                                            >

                                                <span>
                                                    Color
                                                </span>

                                                <span
                                                    className={
                                                        styles.variantColor
                                                    }
                                                    style={{
                                                        backgroundColor:
                                                            color,
                                                    }}
                                                    title={color}
                                                />

                                            </div>

                                        )}


                                        {/* OTHER ATTRIBUTES */}

                                        <div
                                            className={
                                                styles.variantAttributes
                                            }
                                        >

                                            {(variant.attributes || [])
                                                .filter(
                                                    attr =>
                                                        attr.attribute_type !==
                                                        "color"
                                                )
                                                .map(attr => {

                                                    const value =
                                                        getAttributeValue(
                                                            attr
                                                        );

                                                    if (
                                                        value === null ||
                                                        value === undefined ||
                                                        value === ""
                                                    ) {
                                                        return null;
                                                    }

                                                    return (

                                                        <div
                                                            key={attr.id}
                                                            className={
                                                                styles.variantAttribute
                                                            }
                                                        >

                                                            <span>
                                                                {
                                                                    attr.attribute_name
                                                                }
                                                            </span>

                                                            <strong>
                                                                {value}
                                                            </strong>

                                                        </div>

                                                    );

                                                })}

                                        </div>


                                        {/* STOCK */}

                                        <div
                                            className={
                                                styles.variantStock
                                            }
                                        >

                                            <span>
                                                Stock
                                            </span>

                                            <strong>
                                                {variant.stock}
                                            </strong>

                                        </div>

                                    </div>

                                </button>

                            );

                        })}

                    </div>

                </section>

            )}

        </div>
    );
}

export default ProductDetail;