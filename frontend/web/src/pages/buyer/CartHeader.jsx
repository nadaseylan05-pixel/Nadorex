import React from "react";

import styles from "../../styles/CartHeader.module.css";
import useTranslations from "../../hooks/useTranslations";
import { useLanguage } from "../../context/LanguageContext";

console.log("Cart rendered");
function CartHeader({

    itemsCount,

    onBack,
    
}) {
    const { lang } = useLanguage();
    const { t, loading } = useTranslations("translations/cart", lang);

    console.log("LANG ", lang)
    return (

        <div className={styles.header}>

            <button

                className={styles.backButton}

                onClick={onBack}

            >

                {/* ← Back to Store */}
                ←{t.back_to_shopping}
            </button>

            <div className={styles.titleBox}>

                <h1>

                    {t.shopping_cart}

                </h1>

                <p>

                    {/* {itemsCount} {itemsCount === 1 ? "Item" : t.items} */}
                    {itemsCount}  {t.items}

                </p>

            </div>

        </div>

    );

}

export default CartHeader;