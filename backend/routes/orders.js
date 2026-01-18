const express = require("express");
const pool = require("../models/db");

const router = express.Router();

router.post("/", async (req, res) => {
  const { customer, items, total_mad } = req.body || {};

  if (!customer || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Invalid order payload." });
  }

  try {
    let clientId = null;
    if (customer.phone) {
      const [existing] = await pool.query(
        "SELECT id FROM clients WHERE whatsapp_phone = ? LIMIT 1",
        [customer.phone]
      );
      if (existing.length) {
        clientId = existing[0].id;
      } else {
        const [clientResult] = await pool.query(
          "INSERT INTO clients (name, whatsapp_phone, city, platform) VALUES (?, ?, ?, ?)",
          [customer.name || "", customer.phone, customer.city || "", customer.platform || ""]
        );
        clientId = clientResult.insertId;
      }
    }

    const [orderResult] = await pool.query(
      "INSERT INTO orders (client_id, customer_name, city, address, phone, platform, cart_link, total_mad, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        clientId,
        customer.name || "",
        customer.city || "",
        customer.address || "",
        customer.phone || "",
        customer.platform || "",
        customer.cart_link || "",
        total_mad || 0,
        "new"
      ]
    );

    const orderId = orderResult.insertId;
    const values = items.map((item) => [
      orderId,
      item.product_id || null,
      item.name,
      item.quantity,
      item.price_mad
    ]);

    await pool.query(
      "INSERT INTO order_items (order_id, product_id, product_name, quantity, price_mad) VALUES ?",
      [values]
    );

    return res.status(201).json({ order_id: orderId });
  } catch (error) {
    return res.status(500).json({ error: "Unable to save order." });
  }
});

module.exports = router;
