import Link from "next/link";
import ProductCard from "../components/ProductCard";
import TestimonialCard from "../components/TestimonialCard";
import { useLanguage } from "../components/LanguageProvider";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const HomePage = ({ products = [] }) => {
  const { t } = useLanguage();
  const featured = products.slice(0, 8);
  const testimonials = t("testimonials.items");

  return (
    <div>
      <section className="relative h-[320px] w-full overflow-hidden md:h-[420px]">
        <img
          src="/images/hero2.jpg"
          alt="DXN Products"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-6xl flex-col justify-center px-4">
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
        <div className="flex items-center justify-between">
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
        <h2 className="text-2xl font-semibold text-gray-800">{t("about.title")}</h2>
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
        <div className="rounded-2xl bg-dxnGreen/10 p-8">
          <h2 className="text-2xl font-semibold text-gray-800">{t("volunteer.title")}</h2>
          <p className="mt-2 text-gray-600">{t("volunteer.subtitle")}</p>
          <Link
            href="/volunteer"
            className="mt-4 inline-flex rounded-full bg-dxnGreen px-6 py-3 text-sm font-semibold text-white"
          >
            {t("volunteer.cta")}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border bg-white p-8">
          <h2 className="text-2xl font-semibold text-gray-800">{t("catalogue.title")}</h2>
          <p className="mt-2 text-gray-600">
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
    return { props: { products: Array.isArray(data) ? data : [] } };
  } catch (err) {
    return { props: { products: [] } };
  }
}
