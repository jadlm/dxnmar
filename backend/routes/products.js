const express = require("express");
const pool = require("../models/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name_fr, name_ar, price_mad, slug, category, image, description_fr, description_ar, availability, status FROM products WHERE status = 'active' ORDER BY id ASC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch products." });
  }
});

module.exports = router;
