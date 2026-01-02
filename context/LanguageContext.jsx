import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(
    process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || "en"
  );

  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_AUTO_LANGUAGE_DETECT === "true" &&
      typeof window !== "undefined"
    ) {
      const saved = localStorage.getItem("lang");
      if (saved) {
        setLang(saved);
      } else {
        const browserLang = navigator.language.startsWith("hi")
          ? "hi"
          : "en";
        setLang(browserLang);
      }
    }
  }, []);

  const switchLanguage = (lng) => {
    setLang(lng);
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", lng);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
