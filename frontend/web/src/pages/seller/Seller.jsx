// src/pages/seller/Seller.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import useTranslations from "../../hooks/useTranslations";

// Register.jsx


import "../../styles/seller/Seller.css";

function Seller({ lang }) {
  const { t, loading } = useTranslations("seller", lang);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="seller-container">


      {/* <main className="seller-main"> */}
      {/* زر التسجيل */}
      {/* <div className="section-box">
          <h2 className="section-title">{t.merchant_register_title}</h2> */}
      {/* رابط مطلق => يفتح صفحة جديدة كاملة */}
      {/* <Link to="/seller/register" className="btn-submit">
            {t.merchant_register_title}
          </Link>
        </div> */}

      {/* زر تسجيل الدخول */}
      {/* <div className="section-box">
          <h2 className="section-title">{t.merchant_login}</h2>
          <Link to="/seller/login" className="btn-submit">
            {t.login_button}
          </Link>
        </div> */}

      {/* الدفع
        <div className="section-box">
          <h2 className="section-title">{t.iyzico_title}</h2>
          <div className="payment-box">
            <p>{t.iyzico_description}</p>
            <form action="/iyzico" method="POST">
              <input
                type="text"
                name="amount"
                placeholder={t.iyzico_amount}
              />
              <button className="btn-submit" type="submit">
                {t.iyzico_pay_button}
              </button>
            </form>
          </div>
        </div> */}
      {/* </main> */}
      <main className="seller-main">
        <div className="seller-content">
          <header className="seller-header">
            <h1 className="seller-title">{t.seller_page_title}</h1>
            <p className="seller-description">{t.seller_page_description}</p>

            {/* <div className="lang-selector">
            <select
              value={lang}
              onChange={(e) => {
                const newLang = e.target.value;
                localStorage.setItem("lang_detected", "true");
                window.location.href = `/set_language/${newLang}?next=/seller`;
              }}
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
              <option value="tr">Türkçe</option>
            </select>
          </div> */}

            {/* <div className="nav-links">
            <Link to="/">{t.back_to_home}</Link>
            <Link to="/stores">{t.stores}</Link>
          </div> */}
          </header>
          <div className="seller-auth-card">

            {/* <h1 className="seller-title">
                  Nadorex
              </h1> */}

            <p className="seller-subtitle">
              {t.merchant_welcome}
            </p>

            <Link
              to="/seller/login"
              className="btn-submit secondary"
            >
              {t.merchant_login}
            </Link>

            <div className="divider">
              <span>◇</span>
            </div>

            <Link
              to="/seller/register"
              className="btn-submit secondary"
            >
              {t.merchant_register_title}
            </Link>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Seller;