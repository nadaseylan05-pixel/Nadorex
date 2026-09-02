import React, { useEffect, useMemo, useState } from "react";
import styles from "../../styles/ProductDetail.module.css";

import ImageGallery from "./ImageGallery";
import PriceBox from "./PriceBox";
import QuantitySelector from "./QuantitySelector";

import { useParams, useNavigate } from "react-router-dom";

import { useCart } from "./context/CartContext";
import { useLanguage } from "../../context/LanguageContext";


function ProductDetail() {

    const { instagramUsername, id } = useParams();

    const { lang } = useLanguage();

    const { addToCart } = useCart();

    const navigate = useNavigate();


    // =========================================================
    // STATE
    // =========================================================
    const [t, setT] = useState({});
    const [product, setProduct] = useState(null);

    const [selectedVariant, setSelectedVariant] =
        useState(null);


    // =========================================================
    // FETCH PRODUCT
    // =========================================================

    useEffect(() => {

        const fetchProduct = async () => {

            try {

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/buyer/product/${id}/?lang=${lang}&instagram_username=${encodeURIComponent(
                        instagramUsername
                    )}`,
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
                setT(data.translations)
                // عند تحميل المنتج نبدأ دائمًا
                // بالمنتج الرئيسي
                setSelectedVariant(null);


            } catch (error) {

                console.error(
                    "PRODUCT FETCH ERROR:",
                    error
                );

            }

        };


        fetchProduct();

    }, [
        id,
        lang,
        instagramUsername
    ]);


    // =========================================================
    // ACTIVE VARIANTS
    // =========================================================

    const variants = useMemo(() => {

        return (product?.variants || []).filter(
            variant => variant.is_active
        );

    }, [product]);


    // =========================================================
    // CURRENT TITLE
    // =========================================================

    const currentTitle = selectedVariant
        ? (
            selectedVariant.title ||
            product?.name
        )
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


        // نقل المستخدم إلى المنتج الرئيسي
        // بعد اختيار النسخة
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

    const handleAddToCart = (quantity) => {

        if (!product) return;


        addToCart(
            product,
            selectedVariant,
            quantity
        );

    };


    // =========================================================
    // GET VARIANT COLOR
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
    // GET ATTRIBUTE VALUE
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


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div className={styles.page}>


            {/* =====================================================
                BACK TO STORE
            ===================================================== */}

            <button
                type="button"
                onClick={() =>
                    navigate(`/${instagramUsername}`)
                }
            >
                ← {t.back_to_shopping}
            </button>



            {/* =====================================================
                PRODUCT HEADER
            ===================================================== */}

            <div className={styles.productHeader}>




                {/* <div className={styles.breadcrumb}>

                    <span>
                        Home
                    </span>

                    <span>
                        /
                    </span>

                    <span>
                        {product.name}
                    </span>

                </div> */}



                {/* BACK TO MAIN PRODUCT */}

                {selectedVariant && (

                    <button
                        type="button"
                        className={styles.backButton}
                        onClick={
                            handleBackToProduct
                        }
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

                <div
                    className={
                        styles.gallerySection
                    }
                >

                    <ImageGallery
                        product={product}
                        variant={selectedVariant}
                    />

                </div>



                {/* =================================================
                    PRODUCT INFORMATION
                ================================================= */}

                <div
                    className={
                        styles.infoSection
                    }
                >


                    {/* =================================================
                        SELECTED VARIANT BADGE
                    ================================================= */}

                    {selectedVariant && (

                        <div
                            className={
                                styles.selectedBadge
                            }
                        >
                            Selected option
                        </div>

                    )}



                    {/* =================================================
                        TITLE
                    ================================================= */}

                    <h1
                        className={
                            styles.productTitle
                        }
                    >
                        {currentTitle}
                    </h1>



                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    {currentDescription && (

                        <p
                            className={
                                styles.description
                            }
                        >
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
                                                            title={
                                                                value
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

                        )
                    }



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

                        )
                    }



                    {/* =================================================
                        INVENTORY
                    ================================================= */}

                    <div
                        className={
                            styles.inventoryCard
                        }
                    >


                        <div>

                            <span>
                                {t.Stock}
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
                        QUANTITY / ADD TO CART
                    ================================================= */}

                    <div
                        className={
                            styles.purchaseBox
                        }
                    >

                        <QuantitySelector
                            product={product}
                            variant={selectedVariant}
                            onAddToCart={
                                handleAddToCart
                            }
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


                    {/* =================================================
                        VARIANTS HEADER
                    ================================================= */}

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
                                Select an option to view
                                its photos and details.
                            </p>

                        </div>



                        {/* BACK TO MAIN PRODUCT */}

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
                        VARIANT GRID
                    ================================================= */}

                    <div
                        className={
                            styles.variantsGrid
                        }
                    >

                        {variants.map(
                            variant => {

                                // الصورة الرئيسية للنسخة
                                const primaryImage =
                                    variant.image ||
                                    variant.image_url ||
                                    variant.images?.[0]?.image ||
                                    variant.images?.[0]?.image_url ||
                                    null;


                                // اللون
                                const color =
                                    getVariantColor(
                                        variant
                                    );


                                // هل النسخة محددة؟
                                const isSelected =
                                    selectedVariant?.id ===
                                    variant.id;


                                return (

                                    <button
                                        key={variant.id}
                                        type="button"
                                        className={`
                                            ${styles.variantCard}
                                            ${isSelected
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


                                        {/* =================================================
                                            VARIANT IMAGE
                                        ================================================= */}

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
                                                            : `${import.meta.env.VITE_API_URL}${primaryImage}`
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



                                            {/* SELECTED CHECK */}

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



                                        {/* =================================================
                                            VARIANT CONTENT
                                        ================================================= */}

                                        <div
                                            className={
                                                styles.variantContent
                                            }
                                        >


                                            {/* TITLE */}

                                            <strong
                                                className={
                                                    styles.variantTitle
                                                }
                                            >
                                                {variant.title ||
                                                    "Option"}
                                            </strong>



                                            {/* =================================================
                                                COLOR
                                            ================================================= */}

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
                                                        title={
                                                            color
                                                        }
                                                    />

                                                </div>

                                            )}



                                            {/* =================================================
                                                OTHER ATTRIBUTES
                                            ================================================= */}

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
                                                    .map(
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
                                                                    key={
                                                                        attr.id
                                                                    }
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
                                                                        {
                                                                            value
                                                                        }
                                                                    </strong>

                                                                </div>

                                                            );

                                                        }
                                                    )}

                                            </div>



                                            {/* =================================================
                                                STOCK
                                            ================================================= */}

                                            <div
                                                className={
                                                    styles.variantStock
                                                }
                                            >

                                                <span>
                                                    {t.Stock}
                                                </span>


                                                <strong>
                                                    {variant.stock}
                                                </strong>

                                            </div>

                                        </div>

                                    </button>

                                );

                            }
                        )}

                    </div>

                </section>

            )}

        </div>

    );

}

export default ProductDetail;