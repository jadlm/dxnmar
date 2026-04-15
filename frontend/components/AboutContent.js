import { useLanguage } from "./LanguageProvider";

const DXN_INFO_URL = "https://www.dxn2uafrica.com/pws/141309992";

const LinkToInfo = () => (
  <a
    href={DXN_INFO_URL}
    className="font-medium text-dxnGreen underline underline-offset-2 hover:text-dxnGreen/80"
    target="_blank"
    rel="noopener noreferrer"
  >
    {DXN_INFO_URL}
  </a>
);

export default function AboutContent({ className = "" }) {
  const { locale } = useLanguage();

  if (locale === "ar") {
    return (
      <div className={`space-y-4 text-gray-600 leading-relaxed ${className}`}>
        <p>
          هل ترغب في استهلاك منتجات DXN المغرب وليس لديك رمز؟
        </p>
        <p>
          هل ترغب في الاستفادة من فرصة عمل DXN المغرب ولا تعرف من أين تبدأ؟
        </p>
        <p>
          اطلع الآن على المقال التالي، <LinkToInfo /> ، واتبع التعليمات خطوة بخطوة للحصول على رمز DXN مجاني 100%
          لكي تتمكن من الشراء بأسعار الموزّع وتسجيل آخرين في المغرب وحول العالم.
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">ملاحظة:</span> إذا رغبت في تطوير فرصة DXN وبدء دخل متكرر، يتعيّن
          عليك الاشتراك عبر حزمة البداية بسعر 109 درهم فقط.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 text-gray-600 leading-relaxed ${className}`}>
      <p>Vous souhaitez consommer les produits DXN Maroc mais vous n&apos;avez pas de code ?</p>
      <p>
        Vous souhaitez profiter de l&apos;opportunité d&apos;affaires DXN Maroc mais vous ne savez pas par où
        commencer ?
      </p>
      <p>
        Accédez dès maintenant à l&apos;article suivant, <LinkToInfo />, et suivez les instructions étape par
        étape pour obtenir un code DXN 100 % GRATUIT afin de pouvoir acheter aux prix distributeur et même
        inscrire d&apos;autres personnes au Maroc et partout dans le monde.
      </p>
      <p className="text-sm text-gray-700">
        <span className="font-semibold">Remarque :</span> Si vous souhaitez développer l&apos;opportunité DXN et
        commencer à générer des revenus résiduels, vous devez alors acquérir une adhésion via un kit de démarrage à
        seulement 109 dh.
      </p>
    </div>
  );
}
