import { useLanguage } from "./LanguageProvider";

const LanguageSwitcher = () => {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setLocale("fr")}
        className={`px-3 py-1 rounded-full text-sm ${locale === "fr" ? "bg-dxnGreen text-white" : "bg-white border"}`}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => setLocale("ar")}
        className={`px-3 py-1 rounded-full text-sm ${locale === "ar" ? "bg-dxnGreen text-white" : "bg-white border"}`}
      >
        AR
      </button>
    </div>
  );
};

export default LanguageSwitcher;
