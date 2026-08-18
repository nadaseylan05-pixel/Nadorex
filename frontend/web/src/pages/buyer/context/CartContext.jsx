// import React, { createContext, useContext, useState } from "react";
// import { getCart, saveCart } from "../utils";

// const CartContext = createContext();

// export function CartProvider({ children }) {
//     const [cartItems, setCartItems] = useState(getCart() || []);

//     const updateCart = (cart) => {
//         setCartItems(cart);
//         saveCart(cart);

//     };
//     const increaseQuantity = (target) => {
//         changeQuantity(target, 1);
//     };

//     const decreaseQuantity = (target) => {
//         changeQuantity(target, -1);
//     };
//     const addToCart = (product, variant, quantity) => {

//         let cart = [...cartItems];

//         const id = variant
//             ? `${product.id}-${variant.id}`
//             : `${product.id}`;

//         const index = cart.findIndex(
//             item => item.cart_id === id
//         );

//         const stock =
//             variant?.stock ??
//             product.stock ??
//             0;

//         if (index > -1) {

//             cart[index] = {
//                 ...cart[index],
//                 quantity: Math.min(quantity, stock),
//             };

//         } else {

//             cart.push({
//                 cart_id: id,
//                 id: product.id,
//                 variant_id: variant?.id || null,
//                 name: product.name || "Product",
//                 short_description:
//                     product.describtion ||
//                     product.description ||
//                     "",
//                 store_name:
//                     product.store_name ||
//                     product.merchant_name ||
//                     product.seller_name ||
//                     "Official Store",
//                 image_url:
//                     variant?.image_url ||
//                     product.image_url ||
//                     product.base_image ||
//                     "",
//                 price:
//                     variant?.price ??
//                     product.price ??
//                     0,
//                 currency:
//                     variant?.currency ||
//                     product.currency ||
//                     "$",
//                 rating:
//                     product.rating || 0,
//                 reviews:
//                     product.reviews || 0,
//                 color:
//                     variant?.color || null,
//                 size:
//                     variant?.size || null,
//                 book_language:
//                     variant?.book_language || null,
//                 sku:
//                     variant?.sku || null,
//                 stock,
//                 quantity,
//             });

//         }

//         updateCart(cart);

//     };
    
//     const changeQuantity = (target, delta) => {
//         let cart = [...cartItems];

//         const index =
//             typeof target === "number"
//                 ? target
//                 : cart.findIndex(item => item.cart_id === target);

//         if (index === -1) return;

//         const item = cart[index];

//         const newQuantity = item.quantity + delta;

//         // لا ينزل أقل من 1
//         if (newQuantity < 1) return;

//         // لا يزيد عن المخزون
//         if (newQuantity > item.stock) return;

//         cart[index] = {
//             ...item,
//             quantity: newQuantity,
//         };

//         updateCart(cart);
//     };

//     // تعديل removeItem لتقبل cart_id أو index
//     const removeItem = (target) => {
//         const cart = cartItems.filter((item, i) => 
//             typeof target === "number" ? i !== target : item.cart_id !== target
//         );
//         updateCart(cart);
//     };

//     return (
//         <CartContext.Provider value={{ cartItems, addToCart, changeQuantity, removeItem, increaseQuantity, decreaseQuantity}}>
//             {children}
//         </CartContext.Provider>
//     );
// }

// export function useCart() {
//     const context = useContext(CartContext);
//     if (!context) throw new Error("useCart must be used inside CartProvider");
//     return context;
// }
// import React, { createContext, useContext, useState } from "react";
// import { useLocatio} from "react-router-dom";
// import { getCart, saveCart } from "../utils";

// const CartContext = createContext();

// export function CartProvider({ children }) {

//     const [cartItems, setCartItems] = useState(
//         getCart() || []
//     );


//     // ==================================================
//     // تحديث السلة
//     // ==================================================

//     const updateCart = (cart) => {

//         setCartItems(cart);

//         saveCart(cart);

//     };


//     // ==================================================
//     // زيادة الكمية
//     // ==================================================

//     const increaseQuantity = (target) => {

//         changeQuantity(target, 1);

//     };


//     // ==================================================
//     // تقليل الكمية
//     // ==================================================

//     const decreaseQuantity = (target) => {

//         changeQuantity(target, -1);

//     };


//     // ==================================================
//     // إضافة منتج للسلة
//     // ==================================================

//     const addToCart = (
//         product,
//         variant,
//         quantity
//     ) => {

//         let cart = [...cartItems];

//         const id = variant
//             ? `${product.id}-${variant.id}`
//             : `${product.id}`;

//         const index = cart.findIndex(
//             item => item.cart_id === id
//         );

//         const stock =
//             variant?.stock ??
//             product.stock ??
//             0;


//         if (index > -1) {

//             cart[index] = {
//                 ...cart[index],

//                 quantity: Math.min(
//                     quantity,
//                     stock
//                 ),
//             };

//         } else {

//             cart.push({

//                 cart_id: id,

//                 id: product.id,

//                 variant_id:
//                     variant?.id || null,

//                 name:
//                     product.name ||
//                     "Product",

//                 short_description:
//                     product.describtion ||
//                     product.description ||
//                     "",

//                 store_name:
//                     product.store_name ||
//                     product.merchant_name ||
//                     product.seller_name ||
//                     "Official Store",

//                 image_url:
//                     variant?.image_url ||
//                     product.image_url ||
//                     product.base_image ||
//                     "",

//                 price:
//                     variant?.price ??
//                     product.price ??
//                     0,

//                 currency:
//                     variant?.currency ||
//                     product.currency ||
//                     "$",

//                 rating:
//                     product.rating || 0,

//                 reviews:
//                     product.reviews || 0,

//                 color:
//                     variant?.color ||
//                     null,

//                 size:
//                     variant?.size ||
//                     null,

//                 book_language:
//                     variant?.book_language ||
//                     null,

//                 sku:
//                     variant?.sku ||
//                     null,

//                 stock,

//                 quantity,
//             });

//         }


//         updateCart(cart);

//     };


//     // ==================================================
//     // تغيير الكمية
//     // ==================================================

//     const changeQuantity = (
//         target,
//         delta
//     ) => {

//         let cart = [...cartItems];

//         const index =
//             typeof target === "number"
//                 ? target
//                 : cart.findIndex(
//                     item =>
//                         item.cart_id === target
//                 );


//         if (index === -1) return;


//         const item = cart[index];

//         const newQuantity =
//             item.quantity + delta;


//         // لا ينزل أقل من 1
//         if (newQuantity < 1) return;


//         // لا يزيد عن المخزون
//         if (newQuantity > item.stock) return;


//         cart[index] = {
//             ...item,
//             quantity: newQuantity,
//         };


//         updateCart(cart);

//     };


//     // ==================================================
//     // حذف منتج واحد
//     // ==================================================

//     const removeItem = (target) => {

//         const cart =
//             cartItems.filter(
//                 (item, i) =>
//                     typeof target === "number"
//                         ? i !== target
//                         : item.cart_id !== target
//             );

//         updateCart(cart);

//     };


//     // ==================================================
//     // تفريغ السلة بالكامل
//     // ==================================================

//     const clearCart = () => {

//         setCartItems([]);

//         saveCart([]);

//     };


//     // ==================================================
//     // Provider
//     // ==================================================

//     return (

//         <CartContext.Provider
//             value={{
//                 cartItems,

//                 addToCart,

//                 changeQuantity,

//                 removeItem,

//                 increaseQuantity,

//                 decreaseQuantity,

//                 clearCart,
//             }}
//         >

//             {children}

//         </CartContext.Provider>

//     );

// }


// export function useCart() {

//     const context =
//         useContext(CartContext);


//     if (!context) {

//         throw new Error(
//             "useCart must be used inside CartProvider"
//         );

//     }


//     return context;

// }

import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import { useLocation } from "react-router-dom";

import {
    getCart,
    saveCart
} from "../utils";


const CartContext = createContext();


export function CartProvider({ children }) {

    // ==================================================
    // معرفة المتجر الحالي من الرابط
    // ==================================================

    const location = useLocation();

    const pathParts =
        location.pathname
            .split("/")
            .filter(Boolean);


    /*
        مثال:

        /userinsta
        pathParts = ["userinsta"]

        /userinsta/cart
        pathParts = ["userinsta", "cart"]

        /userinsta/checkout
        pathParts = ["userinsta", "checkout"]
    */

    const instagramUsername =
        pathParts[0] || "";


    // ==================================================
    // السلة الحالية
    // ==================================================

    const [
        cartItems,
        setCartItems
    ] = useState(
        () => getCart(instagramUsername)
    );


    // ==================================================
    // تغيير المتجر
    // ==================================================

    useEffect(() => {

        const newCart =
            getCart(instagramUsername);

        setCartItems(newCart);

    }, [instagramUsername]);


    // ==================================================
    // تحديث السلة
    // ==================================================

    const updateCart = (cart) => {

        setCartItems(cart);

        saveCart(
            cart,
            instagramUsername
        );

    };


    // ==================================================
    // زيادة الكمية
    // ==================================================

    const increaseQuantity = (target) => {

        changeQuantity(
            target,
            1
        );

    };


    // ==================================================
    // تقليل الكمية
    // ==================================================

    const decreaseQuantity = (target) => {

        changeQuantity(
            target,
            -1
        );

    };


    // ==================================================
    // إضافة منتج للسلة
    // ==================================================

    const addToCart = (
        product,
        variant,
        quantity
    ) => {

        let cart = [
            ...cartItems
        ];


        const id = variant
            ? `${product.id}-${variant.id}`
            : `${product.id}`;


        const index =
            cart.findIndex(
                item =>
                    item.cart_id === id
            );


        const stock =
            variant?.stock ??
            product.stock ??
            0;


        if (index > -1) {

            cart[index] = {

                ...cart[index],

                quantity:
                    Math.min(
                        cart[index].quantity +
                        quantity,
                        stock
                    ),

            };

        } else {

            cart.push({

                cart_id: id,

                id: product.id,

                variant_id:
                    variant?.id ||
                    null,

                name:
                    product.name ||
                    "Product",

                short_description:
                    product.describtion ||
                    product.description ||
                    "",

                store_name:
                    product.store_name ||
                    product.merchant_name ||
                    product.seller_name ||
                    "Official Store",

                image_url:
                    variant?.image_url ||
                    product.image_url ||
                    product.base_image ||
                    "",

                price:
                    variant?.price ??
                    product.price ??
                    0,

                currency:
                    variant?.currency ||
                    product.currency ||
                    "$",

                rating:
                    product.rating ||
                    0,

                reviews:
                    product.reviews ||
                    0,

                color:
                    variant?.color ||
                    null,

                size:
                    variant?.size ||
                    null,

                book_language:
                    variant?.book_language ||
                    null,

                sku:
                    variant?.sku ||
                    null,

                stock,

                quantity:
                    Math.min(
                        quantity,
                        stock
                    ),

            });

        }


        updateCart(cart);

    };


    // ==================================================
    // تغيير الكمية
    // ==================================================

    const changeQuantity = (
        target,
        delta
    ) => {

        let cart = [
            ...cartItems
        ];


        const index =
            typeof target === "number"

                ? target

                : cart.findIndex(
                    item =>
                        item.cart_id ===
                        target
                );


        if (index === -1) {
            return;
        }


        const item =
            cart[index];


        const newQuantity =
            item.quantity +
            delta;


        // لا ينزل أقل من 1

        if (newQuantity < 1) {
            return;
        }


        // لا يزيد عن المخزون

        if (
            newQuantity >
            item.stock
        ) {
            return;
        }


        cart[index] = {

            ...item,

            quantity:
                newQuantity,

        };


        updateCart(cart);

    };


    // ==================================================
    // حذف منتج
    // ==================================================

    const removeItem = (
        target
    ) => {

        const cart =
            cartItems.filter(
                (item, i) =>

                    typeof target === "number"

                        ? i !== target

                        : item.cart_id !==
                          target
            );


        updateCart(cart);

    };


    // ==================================================
    // تفريغ السلة
    // ==================================================

    const clearCart = () => {

        setCartItems([]);

        saveCart(
            [],
            instagramUsername
        );

    };


    // ==================================================
    // Provider
    // ==================================================

    return (

        <CartContext.Provider
            value={{

                cartItems,

                addToCart,

                changeQuantity,

                removeItem,

                increaseQuantity,

                decreaseQuantity,

                clearCart,

                instagramUsername,

            }}
        >

            {children}

        </CartContext.Provider>

    );

}


export function useCart() {

    const context =
        useContext(
            CartContext
        );


    if (!context) {

        throw new Error(
            "useCart must be used inside CartProvider"
        );

    }


    return context;

}