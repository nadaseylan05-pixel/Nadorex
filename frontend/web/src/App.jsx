// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// صفحات رئيسية
import Home from "./pages/Home";
import Buyer from "./pages/buyer/Buyer";

import ProductDetails from "./pages/seller/ProductDetails";
// صفحات البائع
import Seller from "./pages/seller/Seller";
import SellerLogin from "./pages/seller/Login";
import SellerRegister from "./pages/seller/Register";
import AddProduct from "./pages/seller/AddProduct";
import VerifyAccount from "./pages/seller/Verification";
import "./App.css";
import ProductDetail from "./pages/buyer/ProductDetail";
import { CartProvider } from "./pages/buyer/context/CartContext";
import Cart from "./pages/buyer/Cart";
import Checkout from "./pages/buyer/Checkout";
import BuyerOrders from "./pages/buyer/BuyerOrders";
import FavoritesPage from "./pages/buyer/favoriteService";
import { useLanguage } from "./context/LanguageContext";
import SellerOrderDetails from "./pages/seller/SellerOrderDetails";
function App() {


  // const [lang, setLang] = useState("en");

  // useEffect(() => {
  //   document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  // }, [lang]);

  // قيم افتراضية آمنة لصفحة AddProduct
  const defaultCategories = [];
  const defaultColors = [];
  const defaultSizes = [];
  const defaultProducts = [];
  const { lang, setLang } = useLanguage();
  return (
    <Router>
      <CartProvider>
      <div className="app-container">
        {/* الهيدر */}
        <header className="app-header">
          <Link to="/" className="logo">Nadorex</Link>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="language-select"
          >
            <option value="en">English</option>
            <option value="ar">العربية</option>
            <option value="tr">Türkçe</option>
          </select>
        </header>

        {/* المحتوى */}
        <main>
          <Routes>
            
            {/* صفحات رئيسية */}
            {/* <Route path="/" element={<Home lang={lang} />} /> */}
            <Route path="/buyer" element={<Buyer lang={lang} />} />
            {/* <Route path="/buyer/product/detail/:id" element={<ProductDetail lang={lang}/>} /> */}
            <Route
                path="/:instagramUsername/product/detail/:id"
                element={<ProductDetail lang={lang} />}
            />
           

            <Route path="/buyer/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout lang="ar" />} />
            <Route path="/buyer/orders" element={<BuyerOrders lang={lang} />} />
            {/* صفحات البائع */}
            
            {/* <Route path="/seller" element={<Seller lang={lang} />} /> */}
            <Route path="/" element={<Seller lang={lang} />} />
            <Route path="/seller/login" element={<SellerLogin lang={lang} />} />
            <Route path="/seller/register" element={<SellerRegister lang={lang} />} />
            <Route path="/seller/register/verify" element={<VerifyAccount lang={lang} />} />
            <Route path="/seller/products/:id" element={<ProductDetails />} />
            {/* <Route path="/buyer/favorites" element={<FavoritesPage />} /> */}
            <Route
                path="/seller/orders/:orderNumber"
                element={<SellerOrderDetails />}
            />
            {/* <Route
                path="/store/:instagramUsername"
                element={<Buyer lang={lang} />}
            /> */}
            {/* صفحة إضافة المنتجات */}
            <Route
              path="/seller/login/add"
              element={
                <AddProduct
                  lang={lang}
                  categories={defaultCategories}
                  availableColors={defaultColors}
                  availableSizes={defaultSizes}
                  recentProducts={defaultProducts}
                />

                
              }
            />
            <Route
                path="/:instagramUsername"
                element={<Buyer lang={lang} />}
            />
            <Route
                path="/:instagramUsername/cart"
                element={<Cart />}
            />
            <Route
                path="/:instagramUsername/checkout"
                element={<Checkout lang={lang} />}
            />
            <Route
                path="/:instagramUsername/favorites"
                element={<FavoritesPage />}
            />
          </Routes>
        </main>
      </div>
      </CartProvider>
    </Router>
  );

}

export default App;