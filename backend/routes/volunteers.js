const express = require("express");
const pool = require("../models/db");

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, city, phone, motivation, availability } = req.body || {};
  if (!name || !city || !phone) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO volunteers (name, city, phone, motivation, availability, status) VALUES (?, ?, ?, ?, ?, ?)",
      [name, city, phone, motivation || "", availability || "", "active"]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: "Unable to save volunteer." });
  }
});

module.exports = router;
