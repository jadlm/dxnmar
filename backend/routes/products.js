const express = require("express");
const pool = require("../models/db");

const router = express.Router();

const resolveImageOverride = (product) => {
  const name = (product.name_fr || "").trim().toLowerCase();
  const slug = (product.slug || "").trim().toLowerCase();
  const key = `${name} ${slug}`;

  if (key.includes("spirulina")) {
    if (key.includes("500")) {
      return "/images/DXN SPIRULINA Tablets (500).jpg";
    }
    return "/images/DXN SPIRULINA Tablets (120).png";
  }

  if (key.includes("potenzhi") && key.includes("90")) {
    return "/images/POTENZHI 90’S.avif";
  }

  if (key.includes("potenzhi") && key.includes("30")) {
    return "/images/POTENZHI 30’S.jpg";
  }

  if (key.includes("reishi") && (key.includes("rg 90") || key.includes("rg-90") || key.includes("rg90"))) {
    return "/images/REISHI GANO (RG 90).webp";
  }

  if (key.includes("ganoceliom") && (key.includes("gl 90") || key.includes("gl-90") || key.includes("gl90"))) {
    return "/images/Ganoceliom (GL 90).webp";
  }

  if (key.includes("black cumin") && key.includes("plus") && key.includes("caps")) {
    return "/images/DXN BLACK CUMIN PLUS CAPS.jpg";
  }

  if (key.includes("poria") && key.includes("powder")) {
    return "/images/DXN PORIA S POWDER.webp";
  }

  if (key.includes("mycovita") || key.includes("mix dxn vita")) {
    return "/images/DXN MYCOVITA.webp";
  }

  if (key.includes("mycoveggie")) {
    return "/images/DXN MYCOVEGGIE.jpg";
  }

  if (
    (key.includes("reishi") || key.includes("rg 360") || key.includes("rg-360")) &&
    !key.includes("ganocelium") &&
    !key.includes("ganoceliom")
  ) {
    return "/images/Reishi Gano (RG 360).webp";
  }

  if (key.includes("ganocelium") || key.includes("ganoceliom") || key.includes("gl 360") || key.includes("gl-360")) {
    return "/images/GANOCELIUM (GL 360).webp";
  }

  return product.image;
};

const withImageOverride = (product) => {
  const image = resolveImageOverride(product);
  return image ? { ...product, image } : product;
};

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name_fr, name_ar, price_mad, slug, category, image, description_fr, description_ar, availability, status FROM products WHERE status = 'active' ORDER BY id ASC"
    );
    res.json(rows.map(withImageOverride));
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch products." });
  }
});

module.exports = router;
