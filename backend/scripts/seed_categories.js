const pool = require("../models/db");

const categories = [
  { name_fr: "FOOD SUPPLEMENTS", name_ar: "مكملات غذائية", slug: "food-supplements" },
  { name_fr: "COSMETICS & SKIN CARE", name_ar: "مستحضرات التجميل والعناية بالبشرة", slug: "cosmetics-skin-care" },
  { name_fr: "PERSONAL CARE", name_ar: "العناية الشخصية", slug: "personal-care" },
  { name_fr: "FOOD & BEVERAGE", name_ar: "طعام ومشروبات", slug: "food-beverage" },
  { name_fr: "DXN OOTEA SERIE", name_ar: "سلسلة DXN OOTEA", slug: "dxn-ootea-serie" },
  { name_fr: "APPAREL & CLOTHING", name_ar: "ملابس وأزياء", slug: "apparel-clothing" },
  { name_fr: "DXN KALLOW COSMETICS", name_ar: "مستحضرات DXN KALLOW", slug: "dxn-kallow-cosmetics" }
];

const run = async () => {
  try {
    for (const cat of categories) {
      await pool.query(
        "INSERT INTO categories (name_fr, name_ar, slug) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name_fr = VALUES(name_fr), name_ar = VALUES(name_ar)",
        [cat.name_fr, cat.name_ar, cat.slug]
      );
      console.log(`✅ Category added/updated: ${cat.name_fr}`);
    }
    console.log(`\n✅ Seeded ${categories.length} categories`);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    process.exit(0);
  }
};

run();
