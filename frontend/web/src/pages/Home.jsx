import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import useTranslations from "../hooks/useTranslations";
function Home({ lang }) {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/index/?lang=${lang}`, {
        method:"GET",
        credentials: "include", // مهم إذا كنت تستخدم session/cookies
    })
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error(err));
  }, [lang]); // سيعاد الجلب عند تغيير اللغة
  

  const { t, loading } = useTranslations("index", lang);

  if (loading) return <p>Loading...</p>;
  return (
    <div className="home-container">
      <h1 className="home-title">{t.homepage_title || "Homepage"}</h1>
      <p className="home-welcome">{t.welcome || "Welcome"}</p>

      <div className="buttons">
        <Link to="/buyer">
          <button className="btn">{t.buyer || "Buyer"}</button>
        </Link>
        
        
        <Link to="/seller">
          <button className="btn">{t.seller || "Seller"}</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;