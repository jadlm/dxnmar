import { useLanguage } from "../components/LanguageProvider";

const ContactPage = () => {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-800">{t("contact.title")}</h1>
      <p className="mt-4 text-gray-600">{t("contact.subtitle")}</p>
      <p className="mt-4 text-sm text-gray-500">
        WhatsApp: +212 6 00 00 00 00
      </p>
    </div>
  );
};

export default ContactPage;
