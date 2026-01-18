import { useLanguage } from "../components/LanguageProvider";

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-800">{t("about.title")}</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-gray-100">
          <img
            src="/images/about.jpg"
            alt="DXN"
            className="h-full w-full object-cover"
          />
        </div>
        <p className="text-gray-600">{t("about.content")}</p>
      </div>
    </div>
  );
};

export default AboutPage;
