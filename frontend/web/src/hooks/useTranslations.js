import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
export default function useTranslations(endpoint) {
  const { lang } = useLanguage();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("usetranslations called", endpoint, lang);

    // fetch(`http://127.0.0.1:8000/api/${endpoint}/?lang=${lang}`, {
    fetch(`${import.meta.env.VITE_API_URL}/api/${endpoint}/?lang=${lang}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(json => {
        setData(json.translations || json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [endpoint, lang]);

  return { t: data, loading };
}
