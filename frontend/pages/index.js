import Link from "next/link";
import ProductCard from "../components/ProductCard";
import TestimonialCard from "../components/TestimonialCard";
import { useLanguage } from "../components/LanguageProvider";
import { applyProductImages } from "../utils/productImages";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const HomePage = ({ products = [] }) => {
  const { t } = useLanguage();
  const featured = products.slice(0, 8);
  const testimonials = t("testimonials.items");
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212624559497";
  const trustCards = [
    {
      title: "Paiement sécurisé",
      description: "Transactions protégées et données chiffrées.",
      icon: "🛡️"
    },
    {
      title: "Livraison rapide",
      description: "Expédition rapide partout au Maroc.",
      icon: "🚚"
    },
    {
      title: "Support WhatsApp 24/7",
      description: "Une équipe réactive à tout moment.",
      icon: "💬",
      cta: {
        label: "Contacter sur WhatsApp",
        href: `https://wa.me/${whatsappNumber}`
      }
    },
    {
      title: "Avis clients réels",
      description: "Témoignages authentiques et vérifiés.",
      icon: "⭐"
    }
  ];

  return (
    <div>
      <section className="relative h-[360px] w-full overflow-hidden md:h-[460px]">
        <img
          src="/images/hero2.jpg"
          alt="DXN Products"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30">
          <div className="mx-auto flex h-full max-w-6xl flex-col justify-center gap-4 px-4 text-white">
            <div className="max-w-2xl">
              <h1 className="text-2xl font-semibold leading-snug sm:text-3xl md:text-4xl">
                {t("hero.title")}
              </h1>
              <p className="mt-2 text-sm text-white/90 sm:text-base md:text-lg">
                {t("hero.subtitle")}
              </p>
            </div>
            <Link
              href="/categories"
              className="inline-flex w-fit rounded-full bg-dxnGold px-6 py-3 text-sm font-semibold text-white"
            >
              {t("hero.cta")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">{t("featured.title")}</h2>
          <Link href="/categories" className="text-sm text-dxnGreen">
            {t("hero.cta")}
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-4 sm:grid-cols-2">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-3xl bg-gradient-to-br from-gray-50 via-white to-dxnGreen/10 p-6 sm:p-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-gray-800">Commander en toute confiance</h2>
            <p className="text-sm text-gray-600">Tout est pensé pour une expérience sûre et simple.</p>
          </div>
          <div className="mt-6 hidden grid-cols-2 gap-4 lg:grid">
            {trustCards.map((card) => (
              <div
                key={card.title}
                className="group rounded-2xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 text-2xl shadow-inner">
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{card.title}</p>
                    <p className="text-xs text-gray-500">{card.description}</p>
                  </div>
                </div>
                {card.cta && (
                  <a
                    href={card.cta.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex rounded-full bg-dxnGreen px-4 py-2 text-xs font-semibold text-white"
                  >
                    {card.cta.label}
                  </a>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-2 lg:hidden snap-x snap-mandatory">
            {trustCards.map((card) => (
              <div
                key={card.title}
                className="snap-start min-w-[240px] rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur transition"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-xl shadow-inner">
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{card.title}</p>
                    <p className="text-xs text-gray-500">{card.description}</p>
                  </div>
                </div>
                {card.cta && (
                  <a
                    href={card.cta.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex rounded-full bg-dxnGreen px-4 py-2 text-xs font-semibold text-white"
                  >
                    {card.cta.label}
                  </a>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase text-gray-400">Avis clients</p>
            <div className="mt-3 hidden grid-cols-3 gap-3 md:grid">
              {Array.isArray(testimonials) &&
                testimonials.slice(0, 3).map((item, index) => (
                  <div key={index} className="rounded-xl bg-white p-3 text-sm shadow-sm">
                    <p className="text-yellow-500">⭐⭐⭐⭐⭐</p>
                    <p className="mt-2 text-gray-600">{item}</p>
                  </div>
                ))}
            </div>
            <div className="mt-3 flex gap-3 overflow-x-auto pb-2 md:hidden snap-x snap-mandatory">
              {Array.isArray(testimonials) &&
                testimonials.slice(0, 5).map((item, index) => (
                  <div
                    key={index}
                    className="snap-start min-w-[220px] rounded-xl bg-white p-3 text-sm shadow-sm"
                  >
                    <p className="text-yellow-500">⭐⭐⭐⭐⭐</p>
                    <p className="mt-2 text-gray-600">{item}</p>
                  </div>
                ))}
            </div>
          </div>
          <div className="mt-6 flex">
            <Link
              href="/categories"
              className="inline-flex rounded-full bg-dxnGold px-6 py-3 text-sm font-semibold text-white shadow-sm"
            >
              🛒 Commander en toute confiance
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-semibold text-gray-800">{t("about.title")}</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-gray-100">
            <img
              src="/images/about.jpg"
              alt="DXN"
              className="h-full w-full object-cover"
            />
          </div>
          <p className="text-gray-600 leading-relaxed">{t("about.content")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Les avantages des produits DXN</h2>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <p className="font-semibold text-gray-800">Ingrédients naturels et contrôlés</p>
              <p>
                Les produits DXN sont formulés à base de plantes sélectionnées avec soin,
                notamment le Ganoderma, reconnu pour ses bienfaits.
              </p>
              <p className="font-semibold text-gray-800">Qualité pharmaceutique</p>
              <p>
                Fabrication dans des laboratoires certifiés, avec des normes internationales strictes
                de qualité et de sécurité.
              </p>
              <p className="font-semibold text-gray-800">Sans additifs nocifs</p>
              <p>
                Sans colorants artificiels, sans conservateurs chimiques et sans ingrédients controversés.
              </p>
              <p className="font-semibold text-gray-800">Bien-être global</p>
              <p>
                Les produits DXN agissent sur l’équilibre général du corps : énergie, digestion, immunité
                et vitalité.
              </p>
              <p className="font-semibold text-gray-800">Recherche et expertise internationale</p>
              <p>DXN s’appuie sur des années de recherche scientifique et une présence mondiale.</p>
              <p className="font-semibold text-gray-800">Convient à toute la famille</p>
              <p>Une large gamme adaptée aux besoins quotidiens des adultes et des seniors.</p>
              <p className="font-semibold text-gray-800">Marque reconnue à l’international</p>
              <p>
                DXN est présente dans de nombreux pays avec une forte réputation dans le domaine du bien-être
                naturel.
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl bg-gray-100">
            <img
              src="/images/id%C3%A9e.jpg"
              alt="Avantages DXN"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-semibold text-gray-800">{t("testimonials.title")}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {Array.isArray(testimonials) &&
            testimonials.map((item, index) => (
              <TestimonialCard key={index} text={item} />
            ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl bg-dxnGreen/10 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-gray-800">{t("volunteer.title")}</h2>
          <p className="mt-2 text-gray-600 leading-relaxed">{t("volunteer.subtitle")}</p>
          <Link
            href="/volunteer"
            className="mt-4 inline-flex rounded-full bg-dxnGreen px-6 py-3 text-sm font-semibold text-white"
          >
            {t("volunteer.cta")}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-gray-800">{t("catalogue.title")}</h2>
          <p className="mt-2 text-gray-600 leading-relaxed">
            {t("contact.subtitle")}
          </p>
          <a
            href="/catalogue-dxn.pdf"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex rounded-full border px-6 py-3 text-sm font-semibold text-gray-700"
          >
            {t("catalogue.cta")}
          </a>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

export async function getServerSideProps() {
  try {
    const res = await fetch(`${API_URL}/api/products`);
    const data = await res.json();
    const products = applyProductImages(Array.isArray(data) ? data : []);
    return { props: { products } };
  } catch (err) {
    return { props: { products: [] } };
  }
}
