
import React from "react";
import { useNavigate } from "react-router-dom";

import styles from "../../styles/CartItem.module.css";
import { useLanguage } from "../../context/LanguageContext";
import useTranslations from "../../hooks/useTranslations";
function CartItem({

    item,

    // onUpdateQuantity,
    onIncrease,
    onDecrease,

    onRemove,
    lang,

}) {

    const { t, loading } = useTranslations("translations/cart", lang);
    const navigate = useNavigate();



    const image = item.image_url || "";

    const price = item.price ?? 0;

    const currency = item.currency || "$";



    return (


        <div


            className={styles.card}


            onClick={() =>

                navigate(
                    `/buyer/product/detail/${item.id}`
                )

            }


        >



            {/* IMAGE */}


            {/* <img


                src={image}


                alt={item.name}


                className={styles.image}


            /> */}
            {/* معالجة رابط الصورة والتأكد من وجود صورة افتراضية عند الفشل */}
            <img
                src={
                    item.image_url && !item.image_url.includes("localhost:8080")
                        ? item.image_url
                        : "https://via.placeholder.com/150?text=No+Image"
                }
                alt={item.name || "Product"}
                className={styles.image}
                onError={(e) => {
                    // إذا فشل تحميل الصورة، يتم استبدالها بصورة افتراضية فوراً لتجنب الأخطاء
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150?text=No+Image";
                }}
            />





            <div className={styles.details}>


                {/* STORE */}


                <div className={styles.store}>


                    By {item.store_name}


                </div>





                {/* TITLE */}


                <h3 className={styles.title}>


                    {item.name}


                </h3>





                {/* DESCRIPTION */}


                {

                    item.short_description && (


                        <p className={styles.description}>


                            {

                                item.short_description.length > 80

                                    ?

                                    item.short_description.slice(0, 80) + "..."

                                    :

                                    item.short_description

                            }


                        </p>


                    )


                }






                {/* VARIANTS */}


                <div className={styles.specs}>


                    {

                        item.color &&

                        <span>

                            {item.color}

                        </span>

                    }



                    {

                        item.size &&

                        <span>

                            {item.size}

                        </span>

                    }



                    {

                        item.book_language &&

                        <span>

                            {item.book_language}

                        </span>

                    }



                </div>







                {/* RATING */}


                <div className={styles.rating}>


                    ⭐ {item.rating || 0}


                    {" ("}


                    {item.reviews || 0}


                    {")"}


                </div>







                {/* PRICE */}


                <div className={styles.price}>


                    {price}

                    {" "}

                    {currency}


                </div>







                {/* ACTIONS */}


                <div className={styles.actions}>


                    <div className={styles.qty}>


                        <button


                            onClick={(e) => {


                                e.stopPropagation();


                                // onUpdateQuantity(-1);
                                onDecrease();


                            }}


                        >

                            −

                        </button>





                        <span>


                            {item.quantity}


                        </span>





                        <button


                            onClick={(e) => {


                                e.stopPropagation();


                                // onUpdateQuantity(1);
                                onIncrease();


                            }}


                        >

                            +

                        </button>



                    </div>







                    <button


                        className={styles.remove}


                        onClick={(e) => {


                            e.stopPropagation();


                            onRemove();


                        }}


                    >

                        🗑 {t.delete}


                    </button>



                </div>



            </div>



        </div>


    );

}


export default CartItem;