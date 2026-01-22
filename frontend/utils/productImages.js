import fs from "fs";
import path from "path";

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".gif"
]);

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const buildImageMap = () => {
  const imagesDir = path.join(process.cwd(), "public", "images");
  if (!fs.existsSync(imagesDir)) return new Map();
  const files = fs.readdirSync(imagesDir);
  const map = new Map();
  files.forEach((file) => {
    const ext = path.extname(file).toLowerCase();
    if (!IMAGE_EXTENSIONS.has(ext)) return;
    const base = path.basename(file, ext);
    const key = normalize(base);
    if (key) map.set(key, `/images/${file}`);
  });
  return map;
};

export const applyProductImages = (products = []) => {
  const map = buildImageMap();
  return products.map((product) => {
    const key = normalize(product.name_fr || product.name_ar || product.name);
    if (key && map.has(key)) {
      return { ...product, image: map.get(key) };
    }
    return product;
  });
};
