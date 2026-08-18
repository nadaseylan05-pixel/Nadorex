import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(
        localStorage.getItem("lang") || "en"
    );

    const changeLanguage = (newLang) => {
        localStorage.setItem("lang", newLang);
        setLang(newLang);
    };

    return (
        <LanguageContext.Provider
            value={{
                lang,
                setLang: changeLanguage,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error(
            "useLanguage must be used inside LanguageProvider"
        );
    }

    return context;
}