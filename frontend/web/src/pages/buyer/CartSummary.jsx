import React from "react";

import styles from "../../styles/CartSummary.module.css";
import { useLanguage } from "../../context/LanguageContext";
import useTranslations from "../../hooks/useTranslations";

function CartSummary({
    cartItems,
    onCheckout
}) {

    const {lang} =useLanguage();
    const { t, loading } = useTranslations("translations/cart", lang);
    const itemCount = cartItems.reduce(
        (sum,item)=> sum + item.quantity,
        0
    );


    const subtotal = cartItems.reduce(
        (sum,item)=>
            sum + (item.price * item.quantity),
        0
    );


    const discount = 0;


    const shipping = 0;


    const total =
        subtotal - discount + shipping;



    return (

        <div className={styles.summary}>


            <h2>
                {t.order_summary}
            </h2>



            <div className={styles.row}>

                <span>
                    {t.items} ({itemCount})
                </span>


                <span>
                    ${subtotal.toFixed(2)}
                </span>

            </div>



            <div className={styles.row}>

                <span>
                    {t.discount}
                </span>


                <span>
                    -
                    ${discount.toFixed(2)}
                </span>

            </div>



            <div className={styles.row}>

                <span>
                    {t.shipping}
                </span>


                <span>
                    {
                    shipping === 0
                    ?
                    "Calculated later"
                    :
                    `$${shipping}`
                    }
                </span>

            </div>




            <hr />



            <div className={styles.total}>


                <span>
                    Total
                </span>


                <span>
                    ${total.toFixed(2)}
                </span>


            </div>




            <button

                className={styles.checkout}

                onClick={onCheckout}

            >

                {t.confirm_order}

            </button>



            <div className={styles.secure}>

                🔒 Secure Checkout

            </div>




            <div className={styles.paymentBox}>
                    
                

                <div className={styles.paymentTitle}>

                    {t.payment_arranged_directly_with_seller}

                </div>


{/* 
                <div className={styles.paymentItem}>

                    💳
                    Credit / Debit Card

                </div>


                <div className={styles.paymentItem}>

                    🏦
                    Bank Transfer

                </div>


                <div className={styles.paymentItem}>

                    💰
                    Cash on Delivery

                </div> */}



            </div>



        </div>

    );

}


export default CartSummary;