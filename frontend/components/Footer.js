import { useLanguage } from "./LanguageProvider";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative overflow-hidden bg-white border-t">
      <div className="pointer-events-none absolute inset-0">
        <span className="pill pill-1" />
        <span className="pill pill-2" />
        <span className="pill pill-3" />
        <span className="pill pill-4" />
        <span className="pill pill-5" />
        <span className="pill pill-6" />
        <span className="pill pill-7" />
        <span className="pill pill-8" />
        <span className="pill pill-9" />
        <span className="pill pill-10" />
        <span className="pill pill-11" />
        <span className="pill pill-12" />
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col gap-3 px-4 py-14 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
        <p className="footer-float">DXN Morocco © 2026</p>
        <p className="footer-float">{t("contact.subtitle")}</p>
      </div>
    </footer>
  );
};

export default Footer;
