
// import React, { useEffect, useMemo, useState } from "react";
// import styles from "../../styles/ProductVariants.module.css";

// function ProductVariants({ product, onVariantChange }) {
//     // تصفية النسخ النشطة فقط
//     const variants = useMemo(() => {
//         return (product?.variants || []).filter(v => v.is_active);
//     }, [product]);

//     const [selectedColor, setSelectedColor] = useState("");
//     const [selectedSize, setSelectedSize] = useState("");
//     const [selectedLanguage, setSelectedLanguage] = useState("");

//     // 1. استخراج الألوان الفريدة المتاحة في جميع النسخ
//     const colors = useMemo(() => {
//         return variants
//             .filter(v => v.color)
//             .reduce((arr, v) => {
//                 if (!arr.find(c => c.name === v.color)) {
//                     arr.push({
//                         name: v.color,
//                         // hex: v.color, // يمكنك استبدالها بـ v.color_hex إذا كان السيرفر يدعمها
//                         hex: v.attributes,
//                     });
//                 }
//                 return arr;
//             }, []);
//     }, [variants]);

//     // 2. استخراج المقاسات المتوافقة مع اللون المحدد فقط
//     const sizes = useMemo(() => {
//         return [...new Set(
//             variants
//                 .filter(v => !selectedColor || v.color === selectedColor)
//                 .map(v => v.size)
//                 .filter(Boolean)
//         )];
//     }, [variants, selectedColor]);

//     // 3. استخراج اللغات المتوافقة مع اللون والمقاس المحددين
//     const languages = useMemo(() => {
//         return [...new Set(
//             variants
//                 .filter(v => {
//                     if (selectedColor && v.color !== selectedColor) return false;
//                     if (selectedSize && v.size !== selectedSize) return false;
//                     return true;
//                 })
//                 .map(v => v.book_language)
//                 .filter(Boolean)
//         )];
//     }, [variants, selectedColor, selectedSize]);

//     // تعيين الخيارات الافتراضية عند تحميل المنتج لأول مرة فقط
//     useEffect(() => {
//         if (!variants.length) return;
//         const first = variants[0];
//         setSelectedColor(first.color || "");
//         setSelectedSize(first.size || "");
//         setSelectedLanguage(first.book_language || "");
//     }, [variants]);

//     // تصحيح المقاس المختار إذا أصبح غير متوافق مع اللون الجديد
//     useEffect(() => {
//         if (sizes.length > 0 && !sizes.includes(selectedSize)) {
//             setSelectedSize(sizes[0]);
//         } else if (sizes.length === 0) {
//             setSelectedSize("");
//         }
//     }, [sizes, selectedSize]);

//     // تصحيح اللغة المختارة إذا أصبحت غير متوافقة مع التوليفة الجديدة
//     useEffect(() => {
//         if (languages.length > 0 && !languages.includes(selectedLanguage)) {
//             setSelectedLanguage(languages[0]);
//         } else if (languages.length === 0) {
//             setSelectedLanguage("");
//         }
//     }, [languages, selectedLanguage]);

//     // 4. البحث عن النسخة المطابقة تماماً للمواصفات المختارة حالياً
//     const selectedVariant = useMemo(() => {
//         return variants.find(v => {
//             const matchColor = !colors.length || v.color === selectedColor;
//             const matchSize = !sizes.length || v.size === selectedSize;
//             const matchLang = !languages.length || v.book_language === selectedLanguage;
//             return matchColor && matchSize && matchLang;
//         }) || null;
//     }, [variants, selectedColor, selectedSize, selectedLanguage, colors.length, sizes.length, languages.length]);

//     // إرسال التحديث للمكون الأب فور العثور على النسخة الصحيحة
//     useEffect(() => {
//         if (onVariantChange) {
//             onVariantChange(selectedVariant);
//         }
//     }, [selectedVariant, onVariantChange]);

//     if (!variants.length) return null;
//     console.log(
//         "VARIANTS FULL:",
//         JSON.stringify(product?.variants, null, 2)
//     );
//     return (
//         <div className={styles.wrapper}>
//             {/* خيار الألوان */}
//             {colors.length > 0 && (
//                 <div className={styles.group}>
//                     <div className={styles.title}>Color</div>
//                     <div className={styles.options}>
//                         {colors.map((color) => {
//                             // التحقق من وجود مخزن للون المحدد
//                             const hasStock = variants.some(v => v.color === color.name && v.stock > 0);
//                             const isSelected = selectedColor === color.name;

//                             return (
//                                 <div
//                                     key={color.name}
//                                     onClick={() => hasStock && setSelectedColor(color.name)}
//                                     className={`${styles.colorCircle} ${isSelected ? styles.colorActive : ""} ${!hasStock ? styles.disabled : ""}`}
//                                     style={{
//                                         backgroundColor: color.hex,
//                                         cursor: hasStock ? "pointer" : "not-allowed",
//                                         opacity: hasStock ? 1 : 0.3,
//                                         border: isSelected ? "3px solid #4f46e5" : "1px solid #ccc",
//                                         borderRadius: "50%",
//                                         width: "30px",
//                                         height: "30px",
//                                         display: "inline-block",
//                                         margin: "0 5px",
//                                         transition: "all 0.2s"
//                                     }}
//                                 />
//                             );
//                         })}
//                     </div>
//                 </div>
//             )}

//             {/* خيار المقاسات */}
//             {sizes.length > 0 && (
//                 <div className={styles.group}>
//                     <div className={styles.title}>Size</div>
//                     <div className={styles.options}>
//                         {sizes.map(size => {
//                             // التحقق مما إذا كان هذا المقاس متوفر للبيع
//                             const hasStock = variants.some(v => 
//                                 (!selectedColor || v.color === selectedColor) && 
//                                 v.size === size && 
//                                 v.stock > 0
//                             );

//                             return (
//                                 <button
//                                     key={size}
//                                     type="button"
//                                     disabled={!hasStock}
//                                     className={selectedSize === size ? styles.active : styles.option}
//                                     onClick={() => setSelectedSize(size)}
//                                     style={{
//                                         opacity: hasStock ? 1 : 0.4,
//                                         cursor: hasStock ? "pointer" : "not-allowed"
//                                     }}
//                                 >
//                                     {size}
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </div>
//             )}

//             {/* خيار اللغات */}
//             {languages.length > 0 && (
//                 <div className={styles.group}>
//                     <div className={styles.title}>Language</div>
//                     <div className={styles.options}>
//                         {languages.map(lang => {
//                             const hasStock = variants.some(v => 
//                                 (!selectedColor || v.color === selectedColor) &&
//                                 (!selectedSize || v.size === selectedSize) &&
//                                 v.book_language === lang &&
//                                 v.stock > 0
//                             );

//                             return (
//                                 <button
//                                     key={lang}
//                                     type="button"
//                                     disabled={!hasStock}
//                                     className={selectedLanguage === lang ? styles.active : styles.option}
//                                     onClick={() => setSelectedLanguage(lang)}
//                                     style={{
//                                         opacity: hasStock ? 1 : 0.4,
//                                         cursor: hasStock ? "pointer" : "not-allowed"
//                                     }}
//                                 >
//                                     {lang}
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default ProductVariants;

import React, { useEffect, useMemo, useState } from "react";
import styles from "../../styles/ProductVariants.module.css";

function ProductVariants({ product, onVariantChange }) {

    // ==================================================
    // 1. النسخ النشطة فقط
    // ==================================================

    const variants = useMemo(() => {
        return (product?.variants || []).filter(
            variant => variant.is_active
        );
    }, [product]);


    // ==================================================
    // 2. استخراج أنواع الخصائص الموجودة فعليًا
    // ==================================================

    const attributes = useMemo(() => {

        const map = new Map();

        variants.forEach(variant => {

            (variant.attributes || []).forEach(attr => {

                if (!map.has(attr.attribute)) {

                    map.set(attr.attribute, {
                        id: attr.attribute,
                        name:
                            attr.attribute_name ||
                            attr.name ||
                            `Attribute ${attr.attribute}`,

                        type: attr.attribute_type || "text",
                    });

                }

            });

        });

        return Array.from(map.values());

    }, [variants]);


    // ==================================================
    // 3. الخصائص التي تستخدم لاختيار الـ Variant
    // ==================================================

    const selectableAttributes = useMemo(() => {

        return attributes.filter(attr =>
            attr.type === "color" ||
            attr.type === "select"
        );

    }, [attributes]);


    // ==================================================
    // 4. الخصائص المعلوماتية
    // ==================================================

    const informationAttributes = useMemo(() => {

        return attributes.filter(attr =>
            attr.type !== "color" &&
            attr.type !== "select"
        );

    }, [attributes]);


    // ==================================================
    // 5. القيم المختارة
    // ==================================================

    const [selectedAttributes, setSelectedAttributes] =
        useState({});


    // ==================================================
    // 6. استخراج قيمة Attribute من Variant
    // ==================================================

    const getAttributeValue = (
        variant,
        attributeId
    ) => {

        const attr = (
            variant?.attributes || []
        ).find(
            item => item.attribute === attributeId
        );

        if (!attr) {
            return null;
        }

        if (attr.option != null) {
            return String(attr.option);
        }

        if (attr.value != null) {
            return String(attr.value);
        }

        return null;
    };


    // ==================================================
    // 7. استخراج خيارات Attribute
    // ==================================================

    const getAttributeOptions = (
        attributeId,
        attributeType
    ) => {

        const map = new Map();

        variants.forEach(variant => {

            const attr = (
                variant.attributes || []
            ).find(
                item => item.attribute === attributeId
            );

            if (!attr) {
                return;
            }

            const value =
                attr.option != null
                    ? String(attr.option)
                    : attr.value != null
                        ? String(attr.value)
                        : null;

            if (value === null) {
                return;
            }


            // ------------------------------------------
            // اسم العرض
            // ------------------------------------------

            const label =
                attr.option_name ||
                attr.value_name ||
                attr.value ||
                value;


            // ------------------------------------------
            // لون اللون الحقيقي
            // ------------------------------------------

            const color =
                attr.color_hex ||
                attr.hex ||
                (
                    attributeType === "color"
                        ? attr.value
                        : null
                );


            if (!map.has(value)) {

                map.set(value, {
                    value,
                    label,
                    color,
                });

            }

        });

        return Array.from(map.values());

    };


    // ==================================================
    // 8. تعيين أول Variant تلقائيًا
    // ==================================================

    useEffect(() => {

        if (!variants.length) {
            return;
        }

        const firstVariant = variants[0];

        const initial = {};

        selectableAttributes.forEach(attr => {

            const value = getAttributeValue(
                firstVariant,
                attr.id
            );

            if (value !== null) {
                initial[attr.id] = value;
            }

        });

        setSelectedAttributes(initial);

    }, [
        variants,
        selectableAttributes
    ]);


    // ==================================================
    // 9. البحث عن الـ Variant المطابقة
    // ==================================================

    const selectedVariant = useMemo(() => {

        if (!variants.length) {
            return null;
        }

        return variants.find(variant => {

            return selectableAttributes.every(attr => {

                const selected =
                    selectedAttributes[attr.id];

                if (
                    selected === undefined ||
                    selected === ""
                ) {
                    return true;
                }

                const value =
                    getAttributeValue(
                        variant,
                        attr.id
                    );

                return value === selected;

            });

        }) || null;

    }, [
        variants,
        selectableAttributes,
        selectedAttributes
    ]);


    // ==================================================
    // 10. إرسال الـ Variant المختارة للأب
    // ==================================================

    useEffect(() => {

        if (onVariantChange) {
            onVariantChange(selectedVariant);
        }

    }, [
        selectedVariant,
        onVariantChange
    ]);


    // ==================================================
    // 11. تغيير Attribute
    // ==================================================

    const handleAttributeChange = (
        attributeId,
        value
    ) => {

        setSelectedAttributes(prev => ({
            ...prev,
            [attributeId]: value,
        }));

    };


    // ==================================================
    // 12. لا توجد Variants
    // ==================================================

    if (!variants.length) {
        return null;
    }


    // ==================================================
    // 13. العرض
    // ==================================================
    console.log("ATTR FOR MAIN:",attributes);
    console.log(
        "VARIANTS:",
        JSON.stringify(variants, null, 2)
    );

    console.log(
        "SELECTED VARIANT:",
        JSON.stringify(selectedVariant, null, 2)
    );

    console.log(
        "ATTR FOR MAIN:",
        attributes
    );
    return (

        <div className={styles.wrapper}>

            {/* ==================================================
                اختيار خصائص الـ Variant
            ================================================== */}

            {selectableAttributes.map(attr => {

                const options =
                    getAttributeOptions(
                        attr.id,
                        attr.type
                    );

                if (!options.length) {
                    return null;
                }

                const selected =
                    selectedAttributes[attr.id] || "";


                // ==================================================
                // COLOR
                // ==================================================

                if (attr.type === "color") {

                    return (

                        <div
                            key={attr.id}
                            className={styles.group}
                        >

                            <div className={styles.title}>
                                {attr.name}
                            </div>

                            <div className={styles.colorOptions}>

                                {options.map(option => {

                                    const isSelected =
                                        selected === option.value;


                                    const hasStock =
                                        variants.some(
                                            variant =>
                                                variant.stock > 0 &&
                                                getAttributeValue(
                                                    variant,
                                                    attr.id
                                                ) === option.value
                                        );


                                    return (

                                        <button
                                            key={option.value}
                                            type="button"
                                            disabled={!hasStock}
                                            onClick={() =>
                                                handleAttributeChange(
                                                    attr.id,
                                                    option.value
                                                )
                                            }
                                            className={`
                                                ${styles.colorButton}
                                                ${
                                                    isSelected
                                                        ? styles.colorSelected
                                                        : ""
                                                }
                                                ${
                                                    !hasStock
                                                        ? styles.colorDisabled
                                                        : ""
                                                }
                                            `}
                                            title={option.label}
                                        >

                                            <span
                                                className={
                                                    styles.colorCircle
                                                }
                                                style={{
                                                    backgroundColor:
                                                        option.color ||
                                                        "#e5e7eb"
                                                }}
                                            />

                                        </button>

                                    );

                                })}

                            </div>

                        </div>

                    );

                }


                // ==================================================
                // SELECT
                // ==================================================

                return (

                    <div
                        key={attr.id}
                        className={styles.group}
                    >

                        <div className={styles.title}>
                            {attr.name}
                        </div>

                        <div className={styles.selectOptions}>

                            {options.map(option => {

                                const isSelected =
                                    selected === option.value;


                                const hasStock =
                                    variants.some(
                                        variant =>
                                            variant.stock > 0 &&
                                            getAttributeValue(
                                                variant,
                                                attr.id
                                            ) === option.value
                                    );


                                return (

                                    <button
                                        key={option.value}
                                        type="button"
                                        disabled={!hasStock}
                                        onClick={() =>
                                            handleAttributeChange(
                                                attr.id,
                                                option.value
                                            )
                                        }
                                        className={`
                                            ${styles.optionButton}
                                            ${
                                                isSelected
                                                    ? styles.optionSelected
                                                    : ""
                                            }
                                            ${
                                                !hasStock
                                                    ? styles.optionDisabled
                                                    : ""
                                            }
                                        `}
                                    >
                                        {option.label}
                                    </button>

                                );

                            })}

                        </div>

                    </div>

                );

            })}


            {/* ==================================================
                معلومات الـ Variant المختارة فقط
            ================================================== */}

            {selectedVariant && (

                <div className={styles.variantDetails}>

                    <div className={styles.detailsHeader}>
                        Product details
                    </div>


                    <div className={styles.detailsList}>

                        {(selectedVariant.attributes || [])
                            .filter(attr => {

                                const attribute =
                                    attributes.find(
                                        item =>
                                            item.id ===
                                            attr.attribute
                                    );

                                if (!attribute) {
                                    return true;
                                }

                                return (
                                    attribute.type !== "color" &&
                                    attribute.type !== "select"
                                );

                            })
                            .map(attr => {

                                const value =
                                    attr.option_name ||
                                    attr.value_name ||
                                    attr.value ||
                                    attr.option;

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
                                            styles.detailRow
                                        }
                                    >

                                        <span
                                            className={
                                                styles.detailName
                                            }
                                        >
                                            {
                                                attr.attribute_name ||
                                                attr.name
                                            }
                                        </span>

                                        <span
                                            className={
                                                styles.detailValue
                                            }
                                        >
                                            {value}

                                            {attr.unit && (
                                                <span
                                                    className={
                                                        styles.unit
                                                    }
                                                >
                                                    {" "}
                                                    {attr.unit}
                                                </span>
                                            )}

                                        </span>

                                    </div>

                                );

                            })
                        }

                    </div>

                </div>

            )}

        </div>
    );
}

export default ProductVariants;