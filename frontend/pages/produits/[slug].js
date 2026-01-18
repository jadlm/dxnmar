import { useRouter } from "next/router";
import { useState } from "react";
import { addToCart } from "../../utils/cart";
import { useLanguage } from "../../components/LanguageProvider";
import { buildWhatsAppLink, buildWhatsAppMessage } from "../../utils/whatsapp";

const WHATSAPP_NUMBER = "212600000000";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const ProductDetail = ({ product }) => {
  const { locale, t } = useLanguage();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  if (router.isFallback || !product) {
    return <div className="mx-auto max-w-3xl px-4 py-10">Chargement...</div>;
  }

  const name = locale === "ar" ? product.name_ar || product.name_fr : product.name_fr;
  const description =
    locale === "ar"
      ? product.description_ar || "منتج DXN من الكتالوج الرسمي."
      : product.description_fr || "Produit DXN du catalogue officiel.";
  const waMessage = buildWhatsAppMessage({
    items: [{ name, quantity, price: product.price_mad }],
    locale,
    customer: {}
  });
  const waLink = buildWhatsAppLink(WHATSAPP_NUMBER, waMessage);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-56 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={product.image || "/images/product-placeholder.svg"}
            alt={name}
            className="h-full w-full object-contain"
          />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">{name}</h1>
          <p className="mt-2 text-gray-600">{product.price_mad} DH</p>
          <p className="mt-2 text-sm text-gray-500">{product.category || "DXN"}</p>
          <p className="mt-4 text-gray-600">{description}</p>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm text-gray-600">Qté</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-8 w-8 rounded-full border text-sm"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="h-8 w-8 rounded-full border text-sm"
            >
              +
            </button>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => addToCart({ slug: product.slug, name, price: product.price_mad })}
              className="rounded-full bg-dxnGreen px-6 py-3 text-sm font-semibold text-white"
            >
              {t("product.add")}
            </button>
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white text-center"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  try {
    const res = await fetch(`${API_URL}/api/products`);
    const data = await res.json();
    const list = Array.isArray(data) ? data : [];
    const product = list.find((p) => p.slug === params.slug) || null;
    return { props: { product } };
  } catch (err) {
    return { props: { product: null } };
  }
}

export default ProductDetail;
