const express = require("express");
const pool = require("../models/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, message_fr, message_ar, rating FROM testimonials ORDER BY id DESC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch testimonials." });
  }
});

router.post("/", async (req, res) => {
  const { name, message_fr, message_ar, rating } = req.body || {};
  if (!name || !message_fr || !message_ar) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO testimonials (name, message_fr, message_ar, rating) VALUES (?, ?, ?, ?)",
      [name, message_fr, message_ar, rating || 5]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: "Unable to save testimonial." });
  }
});

module.exports = router;
