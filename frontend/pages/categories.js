import { useMemo, useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useLanguage } from "../components/LanguageProvider";
import { applyProductImages } from "../utils/productImages";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const CategoriesPage = ({ products = [], categoriesList = [] }) => {
  const { t, locale } = useLanguage();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("price_asc");

  // Créer un mapping entre le nom français de la catégorie et ses traductions
  const categoryMap = useMemo(() => {
    const map = {};
    categoriesList.forEach((cat) => {
      map[cat.name_fr] = {
        name_fr: cat.name_fr,
        name_ar: cat.name_ar,
        slug: cat.slug
      };
    });
    return map;
  }, [categoriesList]);

  // Fonction pour obtenir le nom de la catégorie selon la langue
  const getCategoryName = (categoryName) => {
    if (!categoryName) return locale === "ar" ? "كتالوج DXN" : "Catalogue DXN";
    const cat = categoryMap[categoryName];
    if (cat) {
      return locale === "ar" ? cat.name_ar : cat.name_fr;
    }
    return categoryName; // Fallback si la catégorie n'est pas dans la base
  };

  const categories = useMemo(() => {
    return Array.from(
      new Set(products.map((p) => p.category).filter(Boolean))
    );
  }, [products]);

  const filtered = useMemo(() => {
    let list = products;
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((p) => (p.name_fr || p.name || "").toLowerCase().includes(q));
    }
    if (category) {
      list = list.filter((p) => p.category === category);
    }
    if (sort === "price_asc") {
      list = [...list].sort((a, b) => (a.price_mad || 0) - (b.price_mad || 0));
    } else if (sort === "price_desc") {
      list = [...list].sort((a, b) => (b.price_mad || 0) - (a.price_mad || 0));
    } else if (sort === "name") {
      list = [...list].sort((a, b) => (a.name_fr || "").localeCompare(b.name_fr || ""));
    }
    return list;
  }, [query, category, sort, products]);

  const grouped = useMemo(() => {
    return filtered.reduce((acc, item) => {
      const key = item.category || "Catalogue DXN";
      acc[key] = acc[key] || [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [filtered]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-800">{t("catalog.title")}</h1>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search.placeholder")}
          className="w-full rounded-lg border px-4 py-2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border px-4 py-2"
        >
          <option value="">{t("catalog.filter")}</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {getCategoryName(cat)}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full rounded-lg border px-4 py-2"
        >
          <option value="price_asc">{t("catalog.sort_price_asc")}</option>
          <option value="price_desc">{t("catalog.sort_price_desc")}</option>
          <option value="name">{t("catalog.sort_name")}</option>
        </select>
      </div>

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800">{getCategoryName(cat)}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoriesPage;

export async function getServerSideProps() {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`${API_URL}/api/products`),
      fetch(`${API_URL}/api/products/categories`)
    ]);
    
    const productsData = await productsRes.json();
    const categoriesData = await categoriesRes.json();
    
    const products = applyProductImages(Array.isArray(productsData) ? productsData : []);
    const categoriesList = Array.isArray(categoriesData) ? categoriesData : [];
    
    return { props: { products, categoriesList } };
  } catch (err) {
    return { props: { products: [], categoriesList: [] } };
  }
}
