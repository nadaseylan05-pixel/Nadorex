
import React, { useEffect, useState, useCallback, useMemo} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContext";
import ProductCard from "./ProductCard";
import styles from "../../styles/Buyer.module.css";
import BuyerHeader from "./BuyerHeader/";
import CategoryFilter from "./CategoryFilter";
import { useLanguage } from "../../context/LanguageContext";
import useTranslations from "../../hooks/useTranslations";

function Buyer() {
    const navigate = useNavigate();
    const {instagramUsername} =useParams();
    const { cartItems, addToCart } = useCart();
    const {lang} =useLanguage();
    // const { t } = useTranslations("translations/buyer");
    
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const filteredProducts = category === "all"
    ? products
    : products.filter(
        product => product.category_code === category
    );
    const [color, setColor] = useState("");
    const [size, setSize] = useState("");
    const [bookLanguage, setBookLanguage] = useState("");
    const [sort, setSort] = useState("");
    const [t,setT] =useState({});
    // const availableCategories = useMemo(() => {
    //     return [
    //         ...new Set(
    //             products
    //                 .map(product => product.category_code)
    //                 .filter(Boolean)
    //         )
    //     ];
    // }, [products]);
    const [availableCategories, setAvailableCategories] = useState([]);
    // const [category, setCategory] = useState("all");
    // دالة مساعدة لجلب رقم المشتري
    const getBuyerPhone = () => {
        let phone = localStorage.getItem("buyer_phone");
        if (!phone) {
            phone = "guest_" + Math.random().toString(36).substring(2, 9);
            localStorage.setItem("buyer_phone", phone);
        }
        return phone;
    };

    // 1. جلب كافة المنتجات
    // const fetchAllProducts = useCallback(async () => {
    //     try {
    //         const phone = getBuyerPhone();
    //         const res = await fetch(
    //             `http://127.0.0.1:8000/api/buyer/products/?lang=${lang}&buyer_phone=${phone}`,
    //             { credentials: "include" }
    //         );

    //         if (!res.ok) throw new Error("Failed to fetch products");

    //         const data = await res.json();
    //         setProducts(data.products || []);
    //         setT(data.translations)
    //         setError("");
    //     } catch (err) {
    //         console.error("Fetch error:", err);
    //         setError("Server Error");
    //     }
    // }, [lang]);
    const fetchAllProducts = useCallback(async () => {
        try {
            const phone = getBuyerPhone();

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/buyer/products/?lang=${lang}&buyer_phone=${phone}&instagram_username=${instagramUsername}`,
                // `http://127.0.0.1:8000/api/buyer/products/?lang=${lang}&buyer_phone=${phone}&instagram_username=${instagramUsername}`,
                { credentials: "include" }
            );

            if (!res.ok) {
                throw new Error("Failed to fetch products");
            }

            const data = await res.json();
            console.log("BUYER PRODUCTS:", data.products);
            console.log("AVAILABLE CATEGORIES FROM API:", data.available_categories);
            setProducts(data.products || []);
            setAvailableCategories(data.available_categories || []);
            setT(data.translations);
            setError("");

        } catch (err) {
            console.error("Fetch error:", err);
            setError("Server Error");
        }
    }, [lang, instagramUsername]);
    // 2. البحث في المنتجات (تم تعديل المسار لتفادي خطأ الـ URL)
    const searchProducts = useCallback(async (
        searchValue = search,
        categoryValue = category,
        colorValue = color,
        sizeValue = size,
        bookLanguageValue = bookLanguage,
        sortValue = sort
    ) => {
        // إذا كان حقل البحث فارغاً، اجلب كل المنتجات بدلاً من إرسال طلب بحث فارغ
        if (!searchValue || searchValue.trim() === "") {
            fetchAllProducts();
            return;
        }

        try {
            const buyerPhone = getBuyerPhone();
            const params = new URLSearchParams({
                lang,
                buyer_phone: buyerPhone,
                instagram_username: instagramUsername,
                search: searchValue,
                category: categoryValue,
                color: colorValue,
                size: sizeValue,
                book_language: bookLanguageValue,
                sort: sortValue,
            });

            // تعديل الرابط للمسار الصحيح حسب urls.py في الباك إند
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/buyer/search/?${params}`,
                // `http://127.0.0.1:8000/api/buyer/search/?${params}`,
                { credentials: "include" }
            );

            if (!res.ok) throw new Error("Failed to search products");

            const data = await res.json();
            setProducts(data.products || []);
            setError("");
        } catch (err) {
            console.error("Search error:", err);
            setError("Server Error");
        }
    }, [lang, search, category, color, size, bookLanguage, sort, fetchAllProducts, instagramUsername]);
    
    // جلب المنتجات عند التحميل الأول أو تغير اللغة
    useEffect(() => {
        fetchAllProducts();
    }, [fetchAllProducts]);
    const displayedProducts =
    category === "all"
        ? products
        : products.filter(
            product => product.category_code === category
        );
    console.log("BUYER instagramUsername:", instagramUsername);
    return (
        <div className={styles.page}>
            <BuyerHeader
                lang={lang}
                search={search}
                setSearch={setSearch}
                onSearch={searchProducts}
                selectedCategory={category}
                setSelectedCategory={setCategory}
                instagramUsername={instagramUsername}
                // availableCategories={[
                //     ...new Set(
                //         products
                //             .map(product => product.category_code)
                //             .filter(Boolean)
                //     )
                // ]}
                availableCategories={availableCategories}
            />
            {/* <CategoryFilter
                lang={lang}
                selectedCategory={category}
                setSelectedCategory={setCategory}
            /> */}

            <main className={styles.mainLayout}>
                {/* <aside className={styles.sidebar}>
                    <h3>Filters</h3>
                    <div className={styles.filterCard}>Categories</div>
                    <div className={styles.filterCard}>Price</div>
                    <div className={styles.filterCard}>Color</div>
                    <div className={styles.filterCard}>Size</div>
                </aside> */}

                <section className={styles.content}>
                    <div className={styles.hero}>
                        <div>
                            <h1>Discover New Collections</h1>
                            <p>Explore thousands of products from trusted stores.</p>
                        </div>
                    </div>

                    <div className={styles.productsHeader}>
                        {/* <h2>{t.products} ({products.length})</h2> */}
                        <h2>{t.products} ({displayedProducts.length})</h2>
                    </div>

                    {error ? (
                        <p className={styles.error}>{error}</p>
                    ) : (
                        <div className={styles.productsGrid}>
                            
                            {displayedProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={addToCart}
                                    instagramUsername={instagramUsername}
                                />
                            ))}
                        
                            {/* {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={addToCart}
                                    instagramUsername={instagramUsername}
                                />
                            ))} */}\
                            
                        </div>
                    )}
                </section>
            </main>

            <button
                className={styles.floatingCartIcon}
                // onClick={() => navigate("/buyer/cart")}
                onClick={() => navigate(`/${instagramUsername}/cart`)}
            >
                🛒
                <span className={styles.cartCountBadge}>
                    {cartItems.length}
                </span>
            </button>
        </div>
    );
}

export default Buyer;