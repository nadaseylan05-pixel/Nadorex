// src/pages/seller/Login.jsx
 

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/seller/Seller.css";
import { useLanguage } from "../../context/LanguageContext";
import useTranslations from "../../hooks/useTranslations";
function SellerLogin({ lang }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const {t, loading} =useTranslations("translations/login");
  // const t = {
  //   merchant_login: "Login",
  //   your_email_label: "Your Email",
  //   password_label: "Password",
  //   account_not_verified: "Don't have an account?",
  //   register: "Register",
  // };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/login/?lang=${lang || "en"}`,
        // `http://127.0.0.1:8000/api/login/?lang=${lang || "en"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      let data = null;
      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        throw new Error("Server did not return JSON");
      }

      console.log("LOGIN RESPONSE:", data);

      // ❌ فشل (HTTP أو منطقي)
      if (!res.ok || data.success === false) {
        setError(data.error || "Login failed");
        return;
      }

      // ✅ حفظ التوكنات
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      // ✅ التحويل الذكي بعد النجاح
      if (data.redirect_url) {
        navigate(data.redirect_url);
      } else {
        // 💡 تعديل الوجهة الافتراضية هنا لتكون لوحة التحكم الرئيسية مباشرة
        navigate("/seller/dashboard");
      }

    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <main className="seller-main">
      <div className="login-container">
        <h2 className="login-title">{t.merchant_login}</h2>

        {error && <p className="login-error">{error}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t.your_email_label}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t.password_label}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="form-button">
            {t.merchant_login}
          </button>
        </form>

        <div className="form-footer">
          <p>
            {t.account_not_verified}{" "}
            <span
              style={{ color: "#007bff", cursor: "pointer" }}
              onClick={() => navigate("/seller/register")}
            >
              {t.register}
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}

export default SellerLogin;