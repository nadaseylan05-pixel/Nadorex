import React from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useCart } from "./context/CartContext";

import CartHeader from "./CartHeader";

import CartSummary from "./CartSummary";

import CartList from "./CartList";

import { useLanguage } from "../../context/LanguageContext";



import styles from "../../styles/Cart.module.css";
import useTranslations from "../../hooks/useTranslations";


function Cart() {


    const navigate = useNavigate();
    const { instagramUsername } = useParams();



    const {

        cartItems,

        changeQuantity,

        removeItem,

    } = useCart();




    const itemsCount = cartItems.reduce(

        (total, item) =>

            total + item.quantity,

        0

    );
    const { lang } = useLanguage();
    // const {t} = useTranslations("translations/cart",lang);
    const { t, loading } = useTranslations("translations/cart", lang);

    console.log("Cart.jsx cartItems =", cartItems);

    return (

        <div className={styles.page}>


            {/* HEADER */}

            <CartHeader

                itemsCount={itemsCount}

                onBack={() => navigate(-1)}


            />





            <div className={styles.layout}>


                {/* PRODUCTS */}

                <div className={styles.left}>


                    <div className={styles.products}>


                        {

                            cartItems.length === 0

                                ?


                                <div className={styles.empty}>


                                    <h2>

                                        {t.empty_cart}

                                    </h2>


                                    <p>

                                        Add some products to continue shopping.

                                    </p>


                                </div>


                                :


                                <CartList

                                    cartItems={cartItems}


                                    onUpdateQuantity={(id, quantity) =>

                                        changeQuantity(
                                            id,
                                            quantity
                                        )

                                    }


                                    onRemove={(id) =>

                                        removeItem(id)

                                    }


                                />


                        }


                    </div>


                </div>





                {/* SUMMARY */}


                {

                    cartItems.length > 0 &&


                    <div className={styles.right}>


                        <CartSummary


                            cartItems={cartItems}


                            onCheckout={() =>

                                navigate(`/${instagramUsername}/checkout`)

                            }


                        />


                    </div>


                }



            </div>


        </div>

    );

}


export default Cart;