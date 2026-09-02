import React, { useEffect, useState } from "react";

import styles from "../../styles/QuantitySelector.module.css";

function QuantitySelector({

    product,
    variant,
    onAddToCart,

}) {

    const [quantity, setQuantity] = useState(1);

    useEffect(() => {

        setQuantity(1);

    }, [variant]);

    const stock =
        variant?.stock ??
        product.stock ??
        0;

    const increase = () => {

        if (quantity >= stock)
            return;

        setQuantity(prev => prev + 1);

    };

    const decrease = () => {

        if (quantity <= 1)
            return;

        setQuantity(prev => prev - 1);

    };

    const handleAdd = () => {

        if (stock <= 0)
            return;

        if (!onAddToCart)
            return;
        console.log("CLICKED SECCEFULLY");
        // onAddToCart(

        //     product,
        //     variant,
        //     quantity

        // );
        onAddToCart(quantity);
        alert("تم الاضافه بنجاح");

    };
    console.log("CART IS WORKING!!.", onAddToCart);
    return (

        <div className={styles.wrapper}>

            <div className={styles.quantityBox}>

                <button
                    type="button"
                    onClick={decrease}
                >
                    −
                </button>

                <span>

                    {quantity}

                </span>

                <button
                    type="button"
                    onClick={increase}
                    disabled={quantity >= stock}
                >
                    +
                </button>

            </div>

            <div className={styles.stock}>

                {stock > 0
                    ? `${stock} Available`
                    : "Out Of Stock"}

            </div>

            <button
                type="button"
                disabled={stock <= 0}
                className={styles.addButton}
                onClick={handleAdd}
            >

                Add To Cart

            </button>

        </div>

    );

}

export default QuantitySelector;