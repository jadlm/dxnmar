import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getDirection, getInitialLocale, getLocaleData } from "../utils/i18n";

const LanguageContext = createContext({
  locale: "fr",
  dir: "ltr",
  t: (path) => path,
  setLocale: () => {}
});

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState("fr");

  useEffect(() => {
    const initial = getInitialLocale();
    setLocale(initial);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("dxn_locale", locale);
      document.documentElement.lang = locale;
      document.documentElement.dir = getDirection(locale);
    }
  }, [locale]);

  const value = useMemo(() => {
    const dictionary = getLocaleData(locale);
    const t = (path) => {
      return path.split(".").reduce((acc, key) => acc?.[key], dictionary) ?? path;
    };

    return {
      locale,
      dir: getDirection(locale),
      t,
      setLocale
    };
  }, [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
