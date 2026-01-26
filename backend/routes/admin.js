const express = require("express");
const jwt = require("jsonwebtoken");
const pool = require("../models/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dxn_secret";
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "admin123";
const MOD_USER = process.env.MOD_USER || "moderator";
const MOD_PASS = process.env.MOD_PASS || "moderator123";


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]+/g, "-");
    cb(null, `${Date.now()}-${base}${ext}`);
  }
});
const upload = multer({ storage });

const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ error: "Forbidden" });
  }
  return next();
};

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  let role = null;
  if (username === ADMIN_USER && password === ADMIN_PASS) role = "admin";
  if (username === MOD_USER && password === MOD_PASS) role = "moderator";
  if (!role) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ role }, JWT_SECRET, { expiresIn: "12h" });
  return res.json({ token, role });
});

router.post("/upload", authMiddleware, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  
  try {
    // Préparer le nom de fichier pour public/images (garder le nom original mais nettoyé)
    const ext = path.extname(req.file.originalname);
    const base = path.basename(req.file.originalname, ext)
      .replace(/[^a-zA-Z0-9\s_-]+/g, "") // Garder les espaces pour correspondre aux noms de fichiers
      .trim();
    const publicFilename = `${base}${ext}`;
    
    // Chemin vers frontend/public/images
    const publicImagesDir = path.join(__dirname, "../../frontend/public/images");
    const publicImagePath = path.join(publicImagesDir, publicFilename);
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(publicImagesDir)) {
      fs.mkdirSync(publicImagesDir, { recursive: true });
    }
    
    // Copier le fichier vers public/images
    fs.copyFileSync(req.file.path, publicImagePath);
    
    // Retourner le chemin relatif pour Next.js
    const url = `/images/${publicFilename}`;
    return res.json({ url, filename: publicFilename });
  } catch (error) {
    console.error("Upload error:", error);
    // En cas d'erreur, retourner quand même le chemin uploads (fallback)
    const url = `/uploads/${req.file.filename}`;
    return res.json({ url, error: "Copied to uploads only. Please manually add to /images/ folder." });
  }
});

router.get("/products", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name_fr, name_ar, slug, price_mad, category, image, description_fr, description_ar, availability, status FROM products ORDER BY id DESC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch products." });
  }
});

router.post("/products", authMiddleware, async (req, res) => {
  const { name_fr, name_ar, slug, price_mad, category, image, description_fr, description_ar, availability, status } =
    req.body || {};
  if (!name_fr || !name_ar || !slug || !price_mad || !category) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO products (name_fr, name_ar, slug, price_mad, category, image, description_fr, description_ar, availability, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name_fr,
        name_ar,
        slug,
        price_mad,
        category,
        image || "",
        description_fr || "",
        description_ar || "",
        availability ?? 1,
        status || "active"
      ]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: "Unable to create product." });
  }
});

router.put("/products/:id", authMiddleware, async (req, res) => {
  try {
    const [existingRows] = await pool.query(
      "SELECT id, name_fr, name_ar, slug, price_mad, category, image, description_fr, description_ar, availability, status FROM products WHERE id = ?",
      [req.params.id]
    );
    if (!existingRows.length) {
      return res.status(404).json({ error: "Product not found." });
    }
    const existing = existingRows[0];
    const {
      name_fr = existing.name_fr,
      name_ar = existing.name_ar,
      slug = existing.slug,
      price_mad = existing.price_mad,
      category = existing.category,
      image = existing.image,
      description_fr = existing.description_fr,
      description_ar = existing.description_ar,
      availability = existing.availability,
      status = existing.status
    } = req.body || {};

    if (!name_fr || !name_ar || !slug || !price_mad || !category) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    await pool.query(
      "UPDATE products SET name_fr = ?, name_ar = ?, slug = ?, price_mad = ?, category = ?, image = ?, description_fr = ?, description_ar = ?, availability = ?, status = ? WHERE id = ?",
      [
        name_fr,
        name_ar,
        slug,
        price_mad,
        category,
        image || "",
        description_fr || "",
        description_ar || "",
        availability ?? 1,
        status || "active",
        req.params.id
      ]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Unable to update product." });
  }
});

router.delete("/products/:id", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    await pool.query("DELETE FROM products WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete product." });
  }
});

router.get("/testimonials", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, message_fr, message_ar, rating FROM testimonials ORDER BY id DESC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch testimonials." });
  }
});

router.post("/testimonials", authMiddleware, async (req, res) => {
  const { name, message_fr, message_ar, rating } = req.body || {};
  if (!name || !message_fr || !message_ar || !rating) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO testimonials (name, message_fr, message_ar, rating) VALUES (?, ?, ?, ?)",
      [name, message_fr, message_ar, rating]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: "Unable to create testimonial." });
  }
});

router.delete("/testimonials/:id", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    await pool.query("DELETE FROM testimonials WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete testimonial." });
  }
});

router.get("/volunteers", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, city, phone, motivation, availability, status, created_at FROM volunteers ORDER BY id DESC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch volunteers." });
  }
});

router.delete("/volunteers/:id", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    await pool.query("DELETE FROM volunteers WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete volunteer." });
  }
});

router.put("/volunteers/:id", authMiddleware, async (req, res) => {
  const { status, availability } = req.body || {};
  try {
    await pool.query(
      "UPDATE volunteers SET status = COALESCE(?, status), availability = COALESCE(?, availability) WHERE id = ?",
      [status || null, availability || null, req.params.id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Unable to update volunteer." });
  }
});

router.get("/orders", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, customer_name, city, address, phone, total_mad, created_at, status, platform, cart_link FROM orders ORDER BY id DESC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch orders." });
  }
});

router.get("/orders/:id/items", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, product_name, quantity, price_mad FROM order_items WHERE order_id = ?",
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch order items." });
  }
});

router.put("/orders/:id/status", authMiddleware, async (req, res) => {
  const { status } = req.body || {};
  if (!status) return res.status(400).json({ error: "Missing status." });
  try {
    await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Unable to update order status." });
  }
});

router.delete("/orders/:id", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    await pool.query("DELETE FROM orders WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete order." });
  }
});

router.get("/clients", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT c.id, c.name, c.whatsapp_phone, c.city, c.platform, c.created_at, COUNT(o.id) as orders_count, COALESCE(SUM(o.total_mad),0) as total_spent FROM clients c LEFT JOIN orders o ON o.client_id = c.id GROUP BY c.id ORDER BY c.created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch clients." });
  }
});

router.get("/export/orders.csv", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, customer_name, phone, city, total_mad, status, platform, created_at FROM orders ORDER BY created_at DESC"
    );
    const header = "id,customer_name,phone,city,total_mad,status,platform,created_at\n";
    const csv = rows
      .map((r) =>
        [
          r.id,
          `"${(r.customer_name || "").replace(/\"/g, '""')}"`,
          r.phone || "",
          r.city || "",
          r.total_mad,
          r.status,
          r.platform || "",
          r.created_at
        ].join(",")
      )
      .join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=orders.csv");
    res.send(header + csv);
  } catch (error) {
    res.status(500).json({ error: "Unable to export orders." });
  }
});

router.get("/export/orders.pdf", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, customer_name, phone, city, total_mad, status, created_at FROM orders ORDER BY created_at DESC"
    );
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=orders.pdf");
    doc.pipe(res);
    doc.fontSize(18).text("Orders Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(10);
    rows.forEach((r) => {
      doc.text(
        `#${r.id} | ${r.customer_name} | ${r.phone || ""} | ${r.city || ""} | ${r.total_mad} DH | ${r.status} | ${r.created_at}`
      );
    });
    doc.end();
  } catch (error) {
    res.status(500).json({ error: "Unable to export orders." });
  }
});

router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const [[orders]] = await pool.query("SELECT COUNT(*) as total_orders, COALESCE(SUM(total_mad),0) as total_sales FROM orders");
    const [[clients]] = await pool.query("SELECT COUNT(*) as total_clients FROM clients");
    const [[volunteers]] = await pool.query("SELECT COUNT(*) as total_volunteers FROM volunteers");
    const [[products]] = await pool.query("SELECT COUNT(*) as total_products FROM products");
    const [platforms] = await pool.query(
      "SELECT platform, COUNT(*) as count FROM orders GROUP BY platform"
    );
    res.json({
      total_orders: orders.total_orders,
      total_sales: orders.total_sales,
      total_clients: clients.total_clients,
      total_volunteers: volunteers.total_volunteers,
      total_products: products.total_products,
      orders_by_platform: platforms
    });
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch stats." });
  }
});

router.get("/notifications", authMiddleware, async (req, res) => {
  try {
    const [newOrders] = await pool.query(
      "SELECT id, customer_name, total_mad, created_at FROM orders WHERE created_at >= NOW() - INTERVAL 1 DAY ORDER BY created_at DESC LIMIT 10"
    );
    const [newVolunteers] = await pool.query(
      "SELECT id, name, city, created_at FROM volunteers WHERE created_at >= NOW() - INTERVAL 1 DAY ORDER BY created_at DESC LIMIT 10"
    );
    res.json({ new_orders: newOrders, new_volunteers: newVolunteers });
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch notifications." });
  }
});

router.post("/assignments", authMiddleware, async (req, res) => {
  const { volunteer_id, order_id } = req.body || {};
  if (!volunteer_id || !order_id) {
    return res.status(400).json({ error: "Missing assignment fields." });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO volunteer_assignments (volunteer_id, order_id) VALUES (?, ?)",
      [volunteer_id, order_id]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: "Unable to assign volunteer." });
  }
});

router.get("/assignments", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT va.id, va.status, va.created_at, v.name as volunteer_name, o.customer_name as order_customer FROM volunteer_assignments va JOIN volunteers v ON v.id = va.volunteer_id JOIN orders o ON o.id = va.order_id ORDER BY va.created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch assignments." });
  }
});

module.exports = router;
