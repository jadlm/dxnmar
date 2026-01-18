import fr from "../locales/fr.json";
import ar from "../locales/ar.json";

const dictionaries = { fr, ar };

export const getLocaleData = (locale) => {
  return dictionaries[locale] || dictionaries.fr;
};

export const getDirection = (locale) => {
  return locale === "ar" ? "rtl" : "ltr";
};

export const getInitialLocale = () => {
  if (typeof window === "undefined") return "fr";
  const stored = window.localStorage.getItem("dxn_locale");
  return stored || "fr";
};
