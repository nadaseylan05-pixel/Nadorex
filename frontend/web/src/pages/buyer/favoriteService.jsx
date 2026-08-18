import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import styles from "../../styles/Buyer.module.css";
import { useParams } from "react-router-dom";
const API_URL = "http://127.0.0.1:8000/api";

export const toggleFavoriteApi = async (buyerPhone, productId) => {
    const response = await axios.post(`${API_URL}/favorites/toggle/`, {
        buyer_phone: buyerPhone,
        product_id: productId,
    });
    return response.data;
};

function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    const buyerPhone = localStorage.getItem("buyer_phone") || "";
    const {instagramUsername} =useParams();
    useEffect(() => {
        if (!buyerPhone) {
            setLoading(false);
            return;
        }

        fetch(`http://127.0.0.1:8000/buyer/favorites/?buyer_phone=${buyerPhone} & instagram_username=${instagramUsername}`, {
            credentials: "include"
        })
        .then((res) => res.json())
        .then((data) => {
            const items = (data.favorites || []).map((item) => ({
                ...item,
                is_favorite: true,
            }));
            setFavorites(items);
            setLoading(false);
        })
        .catch((err) => {
            console.error("Error fetching favorites:", err);
            setLoading(false);
        });
    }, [buyerPhone]);

    const handleRemoveFromFavorites = (productId) => {
        setFavorites((prev) => prev.filter((item) => item.id !== productId));
    };

    if (loading) return <p style={{ textAlign: "center", padding: "40px" }}>جاري التحميل...</p>;

    if (!buyerPhone) return <p style={{ textAlign: "center", padding: "40px" }}>يرجى إدخال رقم الهاتف لعرض المفضلات.</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>❤️ قائمة مفضلاتي ({favorites.length})</h2>

            {favorites.length === 0 ? (
                <p style={{ marginTop: "20px", color: "#666" }}>
                    لا توجد منتجات في قائمة المفضلات حالياً.
                </p>
            ) : (
                <div className={styles.productsGrid || "products-grid"}>
                    {favorites.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onFavoriteToggle={handleRemoveFromFavorites}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default FavoritesPage;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import ProductCard from "./ProductCard";
// import styles from "../../styles/Buyer.module.css";

// const API_URL = "http://127.0.0.1:8000/api";

// // تصدير دالة تبديل المفضلة لـ ProductCard.jsx
// export const toggleFavoriteApi = async (buyerPhone, productId) => {
//     const response = await axios.post(`${API_URL}/favorites/toggle/`, {
//         buyer_phone: buyerPhone,
//         product_id: productId,
//     });
//     return response.data; // سيرجع: { is_favorite: true/false, message: "..." }
// };

// function FavoritesPage() {
//     const [favorites, setFavorites] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const buyerPhone = localStorage.getItem("buyer_phone") || "";
//     const image =
//     product.image_url ||
//     product.base_image ||
//     product.image ||
//     "/placeholder.png";
//     useEffect(() => {
//         if (!buyerPhone) {
//             setLoading(false);
            
//             return;
//         }

//         // جلب المفضلات مع إرسال رقم الهاتف في الرابط
//         fetch(`${API_URL}/buyer/favorites/?buyer_phone=${buyerPhone}`, {
//             credentials: "include"
//         })
//         .then((res) => res.json())
//         .then((data) => {
//             // ضمان وجود حالة is_favorite: true لجميع العناصر القادمة
//             const items = (data.favorites || []).map((item) => ({
//                 ...item,
//                 is_favorite: true,
//             }));
//             setFavorites(items);
//             setLoading(false);
//         })
//         .catch((err) => {
//             console.error("Error fetching favorites:", err);
//             setLoading(false);
//         });
//     }, [buyerPhone]);

//     // دالة لحذف المنتج من الشاشة فور إلغاء القلب
//     const handleRemoveFromFavorites = (productId) => {
//         setFavorites((prev) => prev.filter((item) => item.id !== productId));
//     };

//     if (loading) return <p style={{ textAlign: "center", padding: "40px" }}>جاري التحميل...</p>;

//     if (!buyerPhone) return <p style={{ textAlign: "center", padding: "40px" }}>يرجى إدخال رقم الهاتف لعرض المفضلات.</p>;

//     return (
//         <div style={{ padding: "20px" }}>
//             <h2>❤️ قائمة مفضلاتي ({favorites.length})</h2>

//             {favorites.length === 0 ? (
//                 <p style={{ marginTop: "20px", color: "#666" }}>
//                     لا توجد منتجات في قائمة المفضلات حالياً.
//                 </p>
//             ) : (
//                 <div className={styles.productsGrid || "products-grid"}>
//                     {favorites.map((product) => (
//                         <ProductCard
//                             key={product.id}
//                             product={product}
//                             onFavoriteToggle={handleRemoveFromFavorites}
//                         />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

// export default FavoritesPage;