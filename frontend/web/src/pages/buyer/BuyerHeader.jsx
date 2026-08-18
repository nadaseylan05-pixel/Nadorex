
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//     FiHeart,
//     FiShoppingCart,
//     FiPackage,
//     FiUser,
//     FiMenu,
// } from "react-icons/fi";
// import CategoryFilter from "./CategoryFilter";
// import SearchBar from "./SearchBar";
// import styles from "../../styles/BuyerHeader.module.css";
// import { useCart } from "./context/CartContext";
// import { useLanguage } from "../../context/LanguageContext";
// import useTranslations from "../../hooks/useTranslations";
// function BuyerHeader({
//     // lang = "en",
//     search,
//     setSearch,
//     onSearch,
//     selectedCategory,
//     setSelectedCategory,
// }) {
//     const navigate = useNavigate();
//     const [showCategories, setShowCategories] = useState(false);
//     const { cartItems, addToCart } = useCart();
//     const {t, loading} =useTranslations("translations/buyer/common")
//     return (
//         <header className={styles.header}>
//             {showCategories && (
//                 <div className={styles.categoriesDropdown}>
//                     <CategoryFilter
//                         lang={lang}
//                         selectedCategory={selectedCategory}
//                         setSelectedCategory={(value) => {
//                             setSelectedCategory(value);
//                             setShowCategories(false);
//                         }}
//                     />
//                 </div>
//             )}
//             <div
//                 className={styles.logoSection}
//                 onClick={() => navigate("/buyer")}
//             >
//                 <div className={styles.logoIcon}>
//                     M
//                 </div>

//                 <div className={styles.logoText}>
//                     Marketplace
//                 </div>
//             </div>

//             <div className={styles.searchSection}>
//                 <SearchBar
//                     search={search}
//                     setSearch={setSearch}
//                     onSearch={onSearch}
//                 />
//             </div>

//             <div className={styles.actions}>

//                 <button
//                     className={styles.actionButton}
//                     onClick={() => setShowCategories(!showCategories)}
//                 >
//                     <FiMenu />
//                     <span>{t.select_category}</span>
//                 </button>

//                 <button
//                     className={styles.iconButton}
//                     onClick={() => navigate("/buyer/favorites")}
//                 >
//                     <FiHeart />

//                     <span className={styles.badge}>
//                         0
//                     </span>
//                 </button>

//                 <button
//                     className={styles.iconButton}
//                     onClick={() => navigate("/buyer/orders")}
//                 >
//                     <FiPackage />

//                     <span className={styles.badge}>
//                         0
//                     </span>
//                 </button>

//                 <button
//                     className={styles.iconButton}
//                     onClick={() => navigate("/buyer/cart")}
//                 >
//                     <FiShoppingCart />

//                     {/* <span className={styles.badge}>
//                         0
//                     </span> */}
//                     <span className={styles.badge}>
//                         {cartItems.length}
//                     </span>
//                 </button>

//                 <button
//                     className={styles.profileButton}
//                     onClick={() => navigate("/buyer/profile")}
//                 >
//                     <FiUser />
//                 </button>

//             </div>

//         </header>
        
//     );
// }

// export default BuyerHeader;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiHeart,
    FiShoppingCart,
    FiPackage,
    FiUser,
    FiMenu,
} from "react-icons/fi";

import CategoryFilter from "./CategoryFilter";
import SearchBar from "./SearchBar";

import styles from "../../styles/BuyerHeader.module.css";

import { useCart } from "./context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import useTranslations from "../../hooks/useTranslations";


// ==================================================
// API
// ==================================================

const API_URL = "http://127.0.0.1:8000/api";


// ==================================================
// جلب عدد المفضلة
// ==================================================

const getFavoritesCount = async (buyerPhone, instagramUsername) => {

    if (!buyerPhone) {
        return 0;
    }

    const response = await fetch(
        `${API_URL}/buyer/favorites/?buyer_phone=${encodeURIComponent(
            buyerPhone
        )}&instagram_username=${encodeURIComponent(instagramUsername)}`,
        {
            method: "GET",
            credentials: "include",
        }
        
    );


    if (!response.ok) {
        throw new Error(
            "Failed to fetch favorites"
        );
    }


    const data = await response.json();


    return (
        data?.favorites?.length || 0
    );
};


// ==================================================
// Buyer Header
// ==================================================

function BuyerHeader({

    search,

    setSearch,

    onSearch,

    selectedCategory,

    setSelectedCategory,
    instagramUsername,
    availableCategories =[],
    
    

}) {

    const navigate = useNavigate();


    // ==================================================
    // اللغة
    // ==================================================

    const { lang } = useLanguage();

    const {
        t,
        loading,
    } = useTranslations(
        "translations/buyer/common",
        lang
    );


    // ==================================================
    // السلة
    // ==================================================

    const {
        cartItems,
    } = useCart();
    const [ordersCount, setOrdersCount]=useState(0);
    const fetchOrdersCount = async () => {
        try {
            const phone =
                localStorage.getItem("buyer_phone")?.trim() || "";

            if (!phone) {
                setOrdersCount(0);
                return;
            }

            const response = await fetch(
                `http://127.0.0.1:8000/api/buyer/orders/confirmed/?phone=${encodeURIComponent(phone)}&lang=${lang}`,
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch orders");
            }

            const data = await response.json();

            setOrdersCount(data?.orders?.length || 0);

        } catch (error) {
            console.error(
                "Error fetching orders count:",
                error
            );

            setOrdersCount(0);
        }
    };
    useEffect(() => {
        fetchOrdersCount();
    }, [lang,instagramUsername]);
    // ==================================================
    // القائمة
    // ==================================================

    const [
        showCategories,
        setShowCategories
    ] = useState(false);


    // ==================================================
    // عدد المفضلة
    // ==================================================

    const [
        favoritesCount,
        setFavoritesCount
    ] = useState(0);


    // ==================================================
    // جلب عدد المفضلة
    // ==================================================

    const fetchFavoritesCount = async () => {
        
        try {

            const buyerPhone =
                localStorage.getItem(
                    "buyer_phone"
                ) || "";
            console.log("instagramUsername:", instagramUsername);
            console.log("buyerPhone:", buyerPhone);

            if (!buyerPhone) {

                setFavoritesCount(0);

                return;

            }


            const count =
                await getFavoritesCount(
                    buyerPhone,
                    instagramUsername
                    
                );
                console.log("favorites count:", count);
                setFavoritesCount(count);
            

        } catch (error) {

            console.error(
                "Error fetching favorites count:",
                error
            );

            setFavoritesCount(0);

        }

    };


    // ==================================================
    // عند تحميل الـ Header
    // ==================================================

    useEffect(() => {

        fetchFavoritesCount();

    }, []);


    // ==================================================
    // تحديث العداد عند الرجوع للصفحة
    // ==================================================

    useEffect(() => {

        const handleFocus = () => {

            fetchFavoritesCount();

        };


        window.addEventListener(
            "focus",
            handleFocus
        );


        return () => {

            window.removeEventListener(
                "focus",
                handleFocus
            );

        };

    }, []);


    // ==================================================
    // الصفحة
    // ==================================================
    console.log("AVAILABLE CATEGORIES RECEIVED to buyerheader:", availableCategories);
    return (

        <header
            className={styles.header}
        >

            {/* ==========================================
                Categories
            ========================================== */}

            {showCategories && (

                <div
                    className={
                        styles.categoriesDropdown
                    }
                >

                    <CategoryFilter

                        lang={lang}

                        selectedCategory={
                            selectedCategory
                        }

                        setSelectedCategory={(
                            value
                        ) => {

                            setSelectedCategory(
                                value
                            );

                            setShowCategories(
                                false
                            );

                        }}
                        availableCategories={availableCategories}

                    />

                </div>

            )}


            {/* ==========================================
                Logo
            ========================================== */}

            <div
                className={
                    styles.logoSection
                }

                onClick={() =>
                    navigate("/buyer")
                }
            >

                <div
                    className={
                        styles.logoIcon
                    }
                >
                    M
                </div>


                <div
                    className={
                        styles.logoText
                    }
                >
                    Marketplace
                </div>

            </div>


            {/* ==========================================
                Search
            ========================================== */}

            <div
                className={
                    styles.searchSection
                }
            >

                <SearchBar

                    search={search}

                    setSearch={setSearch}

                    onSearch={onSearch}

                />

            </div>


            {/* ==========================================
                Actions
            ========================================== */}

            <div
                className={
                    styles.actions
                }
            >


                {/* ======================================
                    Categories
                ====================================== */}

                <button

                    className={
                        styles.actionButton
                    }

                    onClick={() =>
                        setShowCategories(
                            !showCategories
                        )
                    }

                >

                    <FiMenu />

                    <span>
                        {t.select_category}
                    </span>

                </button>


                {/* ======================================
                    Favorites
                ====================================== */}

                <button

                    className={
                        styles.iconButton
                    }

                    onClick={() => {

                        // navigate(
                        //     "/buyer/favorites"
                        // );
                        navigate(`/${instagramUsername}/favorites`)

                    }}

                >

                    <FiHeart />


                    {favoritesCount > 0 && (

                        <span
                            className={
                                styles.badge
                            }
                        >

                            {favoritesCount}

                        </span>

                    )}

                </button>


                {/* ======================================
                    Orders
                ====================================== */}

                <button

                    className={
                        styles.iconButton
                    }

                    onClick={() =>
                        navigate(
                            "/buyer/orders"
                        )
                    }

                >

                    <FiPackage />
                    
                    {ordersCount > 0 && (
                        <span
                            className={
                                styles.badge
                            }
                        >
                            {ordersCount}
                            
                        </span>

                    ) }

                    

                </button>


                {/* ======================================
                    Cart
                ====================================== */}

                <button

                    className={
                        styles.iconButton
                    }

                    onClick={() =>
                        navigate(
                            "/buyer/cart"
                        )
                    }

                >

                    <FiShoppingCart />


                    {cartItems.length > 0 && (

                        <span
                            className={
                                styles.badge
                            }
                        >

                            {cartItems.length}

                        </span>

                    )}

                </button>


                {/* ======================================
                    Profile
                ====================================== */}

                <button

                    className={
                        styles.profileButton
                    }

                    onClick={() =>
                        navigate(
                            "/buyer/profile"
                        )
                    }

                >

                    <FiUser />

                </button>

            </div>

        </header>

    );

}


export default BuyerHeader;