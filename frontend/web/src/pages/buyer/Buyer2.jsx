import React, { useEffect, useState } from "react";

import styles from "../../styles/Buyer.module.css";

import ProductCard from "./ProductCard";

import CartDrawer from "./CartDrawer";
import ProductDetail from "./ProductDetail";
import OrdersDrawer from "./BuyerOrders";
import AddToCartButton from "./AddToCartButton";
import { useCart } from "./context/CartContext";
import { useNavigate } from "react-router-dom";
import {
    getCsrfToken,
    saveCart,
    getCart,
    getCartCount
} from "./utils";


function Buyer({lang="en"}) {

    console.log("BUYER RENDERED");
    const [products,setProducts] = useState([]);

    // const [cartItems,setCartItems] = useState([]);
    const navigate = useNavigate();
    const [confirmedOrders,setConfirmedOrders] = useState([]);

    const [viewCart,setViewCart] = useState(false);

    const [viewOrders,setViewOrders] = useState(false);

    const [error,setError] = useState("");

    const [activeTab, setActiveTab] = useState("cart");


    

    const checkout = (item, index) => {
        console.log(item);
        console.log(index);
        body: JSON.stringify({
        name,
        address,
        phone,
        email: "",

        product_data: {
            id: item.id,
            variant_id: item.variant_id,

            quantity: item.quantity,

            color: item.color,
            size: item.size,
            book_language: item.book_language,
        },

        lang,
    })
    
    // هنا لاحقًا سترسل الطلب إلى Django
    };


    // ===============================
    // LOAD PRODUCTS
    // ===============================

    useEffect(()=>{


        fetch(
            `http://127.0.0.1:8000/api/buyer/products/?lang=${lang}`,
            {
                credentials:"include"
            }
        )

        .then(res=>res.json())

        .then(data=>{
            console.log("PRODUCT FROM API",data.products)
            setProducts(
                data.products || []
            );

        })

        .catch(()=>{

            setError("Server Error");

        });



        // setCartItems(
        //     getCart()
        // );


        fetchOrders();



    },[lang]);





    // ===============================
    // ORDERS
    // ===============================


    const fetchOrders=()=>{


        const phone =
        localStorage.getItem(
            "buyer_phone"
        );


        if(!phone)
            return;



        fetch(

        `http://127.0.0.1:8000/api/buyer/orders/confirmed/?phone=${phone}&lang=${lang}`,

        {
            credentials:"include"
        }

        )


        .then(res=>res.json())


        .then(data=>{


            setConfirmedOrders(
                data.orders || []
            );


        })

        .catch(console.error);


    };






    // تحديث الطلبات تلقائياً

    useEffect(()=>{


        const interval=setInterval(()=>{

            fetchOrders();

        },5000);



        return ()=>clearInterval(interval);



    },[]);









    // ===============================
    // CART
    // ===============================


    

    const {

        cartItems,

        addToCart,

        changeQuantity,

        removeItem

    } = useCart();
    
    // const updateCart=(cart)=>{


    //     setCartItems(cart);

    //     saveCart(cart);


    // };






    // const addToCart=(product,variant,quantity)=>{


    //     let cart=[
    //         ...cartItems
    //     ];



    //     const id =
    //     variant
    //     ?
    //     `${product.id}-${variant.id}`
    //     :
    //     product.id;



    //     const index =
    //     cart.findIndex(
    //         item=>item.cart_id===id
    //     );




    //     if(index>-1){


    //         cart[index].quantity +=quantity;


    //     }

    //     else{


    //         cart.push({

    //             cart_id:id,

    //             id:product.id,

    //             variant_id:
    //             variant?.id || null,


    //             name:
    //             product.name,


    //             price:
    //             variant?.price ??
    //             product.price,


    //             image_url:
    //             variant?.image_url ?? 
    //             product.image_url,


    //             color:
    //             variant?.color || null,


    //             size:
    //             variant?.size || null,

    //             book_language:variant?.book_language,
    //             quantity

    //         });


    //     }



    //     updateCart(cart);


    // };







    // const changeQuantity=(index,delta)=>{


    //     let cart=[
    //         ...cartItems
    //     ];


    //     cart[index].quantity += delta;



    //     if(cart[index].quantity<=0){


    //         cart.splice(index,1);

    //     }



    //     updateCart(cart);


    // };







    // const removeItem=(index)=>{


    //     let cart =
    //     cartItems.filter(
    //         (_,i)=>i!==index
    //     );


    //     updateCart(cart);


    // };








    // ===============================
    // ORDER ACTION
    // ===============================


    const orderAction=async(action,id)=>{


        await fetch(

        "http://127.0.0.1:8000/api/orders/action/",

        {

            method:"POST",

            credentials:"include",

            headers:{


                "Content-Type":
                "application/json",


                "X-CSRFToken":
                getCsrfToken()


            },


            body:JSON.stringify({

                order_id:id,

                action

            })

        });


        fetchOrders();


    };






    console.log("BUYER PRODUCTS STATE:", products);
    if(error)

        return <p>{error}</p>;
        



   


    return (

    <div className={styles.container}>

    <h1>
    عدد المنتجات: {products.length}
    </h1>

        <div className={styles.productsGrid}>


        {
            products.map(product=>{
                console.log("MAP:",product.name);
                return (
                <ProductCard


                    key={product.id}


                    product={product}


                    onAddToCart={addToCart}

                    


                />
                );

            })
        }


        </div>





        <button

            className={styles.cartButton}

            // onClick={()=>setViewCart(true)}
            onClick={() => navigate("/buyer/cart")}
        >

            🛒 {cartItems.length}


        </button>






        <CartDrawer


            open={viewCart}


            onClose={()=>setViewCart(false)}


            cartItems={cartItems}

            cartCount={getCartCount(cartItems)}
             
            activeTab={activeTab}

            setActiveTab={setActiveTab}

            confirmedOrders={confirmedOrders}

            onIncrease={(index) => changeQuantity(index, 1)}

            onDecrease={(index) => changeQuantity(index, -1)}

            onRemove={removeItem}

            onCheckout={checkout}

           
        />







        <OrdersDrawer


            open={viewOrders}


            onClose={()=>setViewOrders(false)}


            orders={confirmedOrders}


            onAction={orderAction}


        />
        


    </div>

    );

}


export default Buyer;