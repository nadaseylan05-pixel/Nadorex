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

    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);

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
                setSelectedVariant(null);

            } catch (error) {
                console.error("PRODUCT FETCH ERROR:", error);
            }
        };

        fetchProduct();
    }, [id, lang, instagramUsername]);

    const variants = useMemo(() => {
        return (product?.variants || []).filter(
            (variant) => variant.is_active
        );
    }, [product]);

    const currentTitle =
        selectedVariant?.title ||
        product?.name;

    const currentDescription =
        selectedVariant?.describtion ||
        product?.describtion;

    const getVariantColor = (variant) => {
        const colorAttribute =
            (variant.attributes || []).find(
                (attr) =>
                    attr.attribute_type === "color"
            );

        return (
            colorAttribute?.value ||
            variant.color_hex ||
            null
        );
    };

    const getAttributeValue = (attr) => {
        return (
            attr.option_name ||
            attr.value_name ||
            attr.value ||
            attr.option ||
            null
        );
    };

    const handleVariantSelect = (variant) => {
        setSelectedVariant(variant);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleBackToProduct = () => {
        setSelectedVariant(null);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleAddToCart = (quantity) => {
        if (!product) return;

        addToCart(
            product,
            selectedVariant,
            quantity
        );
    };

    if (!product) {
        return (
            <div className={styles.loadingPage}>
                <div className={styles.loadingCard}>
                    <div className={styles.loadingSpinner} />
                    <span>Loading product...</span>
                </div>
            </div>
        );
    }

    const stock =
        selectedVariant?.stock ??
        product.stock ??
        0;

    return (
        <main className={styles.page}>

            {/* BACK */}

            <div className={styles.topBar}>
                <button
                    type="button"
                    className={styles.storeBackButton}
                    onClick={() =>
                        navigate(`/${instagramUsername}`)
                    }
                >
                    <span className={styles.backIcon}>
                        ←
                    </span>

                    <span>
                        Back to store
                    </span>
                </button>
            </div>

            {/* BREADCRUMB */}

            <div className={styles.breadcrumb}>
                <button
                    type="button"
                    onClick={() =>
                        navigate(`/${instagramUsername}`)
                    }
                >
                    Home
                </button>

                <span>/</span>

                <span className={styles.breadcrumbCurrent}>
                    {currentTitle}
                </span>
            </div>

            {/* PRODUCT */}

            <section className={styles.productCard}>

                {/* GALLERY */}

                <div className={styles.gallerySection}>

                    <div className={styles.galleryFrame}>

                        <ImageGallery
                            product={product}
                            variant={selectedVariant}
                            onVariantChange={
                                handleVariantSelect
                            }
                        />

                    </div>

                </div>

                {/* INFORMATION */}

                <div className={styles.infoSection}>

                    {selectedVariant && (
                        <div className={styles.selectedBadge}>
                            <span className={styles.badgeCheck}>
                                ✓
                            </span>

                            Selected option
                        </div>
                    )}

                    <h1 className={styles.productTitle}>
                        {currentTitle}
                    </h1>

                    {currentDescription && (
                        <div className={styles.descriptionBox}>
                            <p className={styles.description}>
                                {currentDescription}
                            </p>
                        </div>
                    )}

                    {/* PRODUCT DETAILS */}

                    {!selectedVariant &&
                        product.attributes?.length > 0 && (

                            <div className={styles.detailsCard}>

                                <div className={styles.sectionHeading}>
                                    <h2>
                                        Product details
                                    </h2>
                                </div>

                                <div className={styles.attributesList}>

                                    {product.attributes.map((attr) => {

                                        const value = attr.value;

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
                                                    {attr.attribute_name}
                                                </span>

                                                {attr.attribute_type ===
                                                    "color" ? (

                                                    <div
                                                        className={
                                                            styles.colorValueWrapper
                                                        }
                                                    >
                                                        <span
                                                            className={
                                                                styles.colorValue
                                                            }
                                                            style={{
                                                                backgroundColor:
                                                                    value,
                                                            }}
                                                        />

                                                        <span
                                                            className={
                                                                styles.colorCode
                                                            }
                                                        >
                                                            {value}
                                                        </span>
                                                    </div>

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
                                    })}

                                </div>
                            </div>
                        )}

                    {/* VARIANT DETAILS */}

                    {selectedVariant &&
                        selectedVariant.attributes?.length > 0 && (

                            <div className={styles.detailsCard}>

                                <div className={styles.sectionHeading}>
                                    <h2>
                                        Variant details
                                    </h2>
                                </div>

                                <div className={styles.attributesList}>

                                    {selectedVariant.attributes.map(
                                        (attr) => {

                                            const value =
                                                getAttributeValue(attr);

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

                                                        <div
                                                            className={
                                                                styles.colorValueWrapper
                                                            }
                                                        >
                                                            <span
                                                                className={
                                                                    styles.colorValue
                                                                }
                                                                style={{
                                                                    backgroundColor:
                                                                        attr.value ||
                                                                        "#ddd",
                                                                }}
                                                            />

                                                            <span
                                                                className={
                                                                    styles.colorCode
                                                                }
                                                            >
                                                                {
                                                                    attr.value
                                                                }
                                                            </span>
                                                        </div>

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

                    {/* INVENTORY */}

                    <div className={styles.inventoryCard}>

                        <div className={styles.inventoryItem}>
                            <span>
                                Stock
                            </span>

                            <strong>
                                {stock}
                            </strong>
                        </div>

                        {selectedVariant?.sku && (
                            <div className={styles.inventoryItem}>
                                <span>
                                    SKU
                                </span>

                                <strong>
                                    {selectedVariant.sku}
                                </strong>
                            </div>
                        )}

                    </div>

                    {/* PRICE */}

                    <div className={styles.priceSection}>

                        <PriceBox
                            product={product}
                            variant={selectedVariant}
                        />

                    </div>

                    {/* QUANTITY */}

                    <div className={styles.purchaseBox}>

                        <QuantitySelector
                            product={product}
                            variant={selectedVariant}
                            onAddToCart={handleAddToCart}
                        />

                    </div>

                </div>

            </section>

            {/* VARIANTS */}

            {variants.length > 0 && (

                <section className={styles.variantsSection}>

                    <div className={styles.variantsHeader}>

                        <div>
                            <span className={styles.eyebrow}>
                                Available options
                            </span>

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

                    <div className={styles.variantsGrid}>

                        {variants.map((variant) => {

                            const primaryImage =
                                variant.image ||
                                variant.image_url ||
                                variant.images?.[0]?.image ||
                                variant.images?.[0]?.image_url ||
                                null;

                            const color =
                                getVariantColor(variant);

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
                                            {variant.title ||
                                                "Option"}
                                        </strong>

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
                                                />
                                            </div>
                                        )}

                                        <div
                                            className={
                                                styles.variantAttributes
                                            }
                                        >

                                            {(variant.attributes || [])
                                                .filter(
                                                    (attr) =>
                                                        attr.attribute_type !==
                                                        "color"
                                                )
                                                .map((attr) => {

                                                    const value =
                                                        getAttributeValue(
                                                            attr
                                                        );

                                                    if (
                                                        !value
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

        </main>
    );
}

export default ProductDetail;