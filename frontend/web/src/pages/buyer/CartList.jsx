import React, { useEffect, useMemo, useState } from "react";

import CartItem from "./CartItem";
import { useCart } from "./context/CartContext";
import useTranslations from "../../hooks/useTranslations";

function CartList({

    cartItems,

    // onIncrease,

    // onDecrease,

    onRemove,

    onCheckout,
    lang

}) {

    // const { changeQuantity, removeItem } = useCart();
   
    const {
        changeQuantity,
        removeItem,
    } = useCart();
    const { t, loading } = useTranslations("translations/cart", lang);
    return (

        <>

            {

                cartItems.map((item, index) => (

                    // <CartItem

                    //     key={item.cart_id || index}

                    //     item={item}

                    //     onIncrease={() => onIncrease(index)}

                    //     onDecrease={() => onDecrease(index)}

                    //     onRemove={() => onRemove(index)}

                    //     // onCheckout={() => onCheckout(item)}

                    // />
                    <CartItem
                        key={item.cart_id || index}
                        item={item}
                        onIncrease={() => changeQuantity(item.cart_id, 1)}
                        onDecrease={() => changeQuantity(item.cart_id, -1)}
                        onRemove={() => removeItem(item.cart_id)}
                        lang={lang}
                    />

                ))

            }

        </>

    );

}

export default CartList;