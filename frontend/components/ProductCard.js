import Link from "next/link";
import { addToCart } from "../utils/cart";
import { useState } from "react";
import { useLanguage } from "./LanguageProvider";

const ProductCard = ({ product }) => {
  const { locale, t } = useLanguage();
  const [added, setAdded] = useState(false);
  const name = locale === "ar" ? product.name_ar || product.name_fr || product.name : product.name_fr || product.name;

  const handleAdd = () => {
    addToCart({
      slug: product.slug,
      name,
      price: product.price_mad
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="h-36 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={product.image || "/images/product-placeholder.svg"}
          alt={name}
          className="h-full w-full object-contain"
        />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-gray-800 line-clamp-2">{name}</h3>
      <p className="text-sm text-gray-500">{product.price_mad} DH</p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 rounded-full bg-dxnGreen px-3 py-2 text-xs font-semibold text-white"
        >
          {added ? "✓" : t("product.add")}
        </button>
        <Link
          href={`/produits/${product.slug}`}
          className="flex-1 rounded-full border px-3 py-2 text-center text-xs font-semibold text-gray-700"
        >
          {t("product.details")}
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
