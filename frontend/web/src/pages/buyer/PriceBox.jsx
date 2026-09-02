import React from "react";

import styles from "../../styles/PriceBox.module.css";

function PriceBox({

    product,
    variant,

}) {

    const price =
        variant?.price ??
        product.price;

    const oldPrice =
        variant?.old_price ??
        product.old_price;

    const currency =
        variant?.currency ??
        product.currency ??
        "₺";

    const hasDiscount =
        oldPrice &&
        Number(oldPrice) > Number(price);

    const discountPercentage = hasDiscount
        ? Math.round(
            ((oldPrice - price) / oldPrice) * 100
        )
        : 0;

    return (

        <div className={styles.priceBox}>

            <div className={styles.currentRow}>

                <span className={styles.currentPrice}>
                    {price}
                </span>

                <span className={styles.currency}>
                    {currency}
                </span>

            </div>

            {hasDiscount && (

                <>

                    <div className={styles.oldPrice}>
                        {oldPrice} {currency}
                    </div>

                    <div className={styles.discount}>
                        -{discountPercentage}%
                    </div>

                </>

            )}

        </div>

    );

}

export default PriceBox;