import rawProducts from "./products.json";

const slugify = (value) => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
};


export const products = rawProducts.map((item, index) => {
  const base = slugify(item.name || `produit-${index + 1}`);
  return {
    ...item,
    slug: `${base}-${index + 1}`,
    name_fr: item.name,
    name_ar: item.name
  };
});
