const fs = require("fs");
const path = require("path");
const pool = require("../models/db");

const productsPath = path.join(__dirname, "../../frontend/data/products.json");
const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");

const run = async () => {
  const raw = fs.readFileSync(productsPath, "utf-8");
  const products = JSON.parse(raw);

  if (!Array.isArray(products) || products.length === 0) {
    console.log("No products found in products.json");
    process.exit(0);
  }

  const seen = new Set();
  const values = products.map((p, idx) => {
    const baseName = p.name || p.name_fr || `produit-${idx + 1}`;
    let slug = p.slug || slugify(baseName) || `produit-${idx + 1}`;
    if (seen.has(slug)) {
      slug = `${slug}-${idx + 1}`;
    }
    seen.add(slug);
    return [
      p.name || p.name_fr || "",
      p.name || p.name_ar || "",
      slug,
      p.price_mad || 0,
      p.category || "Catalogue DXN",
      p.image || "",
      p.description_fr || "",
      p.description_ar || ""
    ];
  });

  try {
    await pool.query("DELETE FROM products");
    await pool.query(
      "INSERT INTO products (name_fr, name_ar, slug, price_mad, category, image, description_fr, description_ar) VALUES ?",
      [values]
    );
    console.log(`Seeded ${values.length} products`);
  } catch (err) {
    console.error("Seed failed", err.message);
  } finally {
    process.exit(0);
  }
};

run();
