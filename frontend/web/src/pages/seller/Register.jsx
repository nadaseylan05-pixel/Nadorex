import React, { useState } from "react";

import "../../styles/seller/Register.css";
import { useLanguage } from "../../context/LanguageContext";
import useTranslations from "../../hooks/useTranslations";
import { useNavigate } from "react-router-dom";
function SellerRegister({ lang }) {
  const { t, loading } = useTranslations("translations/register");
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    instagram_username: "", // 💡 إضافة الحقل الجديد في الـ state
    notification_lang: lang,
  });


  // null | loading | success | error
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/merchant/register/?lang=${lang}`,
        // `http://localhost:8000/merchant/register/?lang=${lang}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );
      
      const data = await res.json();
      console.log("REGISTER RESPONSE:", data);

      // ❌ فشل
      if (data.success !== true) {
        setStatus("error");
        setMessage(data.message || "Registration failed");
        return;
      }

      // ✅ نجاح
      setStatus("success");
      setMessage("Verification email sent successfully");

      // ⏩ تحويل لصفحة التحقق
      setTimeout(() => {
        window.location.href = "/seller/register/verify";
      }, 1500);
      // if (data.redirect_url) {
      //   navigate(data.redirect_url);
      // } else {
      //   // 💡 تعديل الوجهة الافتراضية هنا لتكون لوحة التحكم الرئيسية مباشرة
      //   navigate("/seller/dashboard");
      // }
  
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Server error");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main>
      <div className="form-container">

        <h2 className="form-title">
          {t?.merchant_register_title || "Seller Registration"}
        </h2>

        <p className="form-description">
          {t?.seller_page_description || ""}
        </p>

        {/* 🔔 الرسائل */}
        {status === "loading" && (
          <div className="form-info loading">⏳ Loading...</div>
        )}

        {status === "success" && (
          <div className="form-info success">✅ {message}</div>
        )}

        {status === "error" && (
          <div className="form-info error">❌ {message}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t?.name || "Name"}</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t?.your_email_label || "Email"}</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t?.password_label || "Password"}</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* 💡 حقل اسم مستخدم إنستغرام الجديد */}
          <div className="form-group">
            <label>{t?.instagram_username || "Instagram Username"}</label>
            <input
              name="instagram_username"
              type="text"
              placeholder="e.g. shop_username"
              value={form.instagram_username}
              onChange={handleChange}
              required // نضعه مطلوباً لضمان ربط كل تاجر بحسابه من البداية
            />
          </div>

          <div className="form-group">
            <label>{t?.choose_language || "Language"}</label>
            <select
              name="notification_lang"
              value={form.notification_lang}
              onChange={handleChange}
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
              <option value="tr">Türkçe</option>
            </select>
          </div>

          <button
            className="form-button"
            disabled={status === "loading"}
          >
            {t?.register_merchant || "Register"}
          </button>
        </form>

        <div className="form-footer">
          {t?.already_have_account || "Already have an account?"}{" "}
          <a href="/login">{t?.register || "Login"}</a>
        </div>
      </div>
    </main>
  );
}

export default SellerRegister;