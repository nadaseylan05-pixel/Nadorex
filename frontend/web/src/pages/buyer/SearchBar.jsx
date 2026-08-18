import React, { useEffect, useState, useRef } from "react";
import styles from "../../styles/SearchBar.module.css";
import { useLanguage } from "../../context/LanguageContext";
import useTranslations from "../../hooks/useTranslations";
function SearchBar({ search, setSearch, onSearch }) {
    const [value, setValue] = useState(search);
    const isFirstRender = useRef(true);
    const {t, loading} =useTranslations("translations/buyer/common");
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            setSearch(value);
            onSearch(value);
        }
    };

    const handleButtonClick = () => {
        setSearch(value);
        onSearch(value);
    };

    // Debounce تلقائي عند الكتابة (ينتظر 400ms بعد التوقف عن الكتابة)
    useEffect(() => {
        // لتفادي تنفيذ البحث فور فتح الصفحة
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            setSearch(value);
            onSearch(value);
        }, 400);

        return () => clearTimeout(timer);
    }, [value]);

    return (
        <div className={styles.searchWrapper}>
            <input
                className={styles.searchInput}
                type="text"
                placeholder={t.search_product_placeholder_key}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />

            <button
                className={styles.searchButton}
                onClick={handleButtonClick}
            >
                🔍
            </button>
        </div>
    );
}

export default SearchBar;