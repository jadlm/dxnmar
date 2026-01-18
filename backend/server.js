require("dotenv").config();
const express = require("express");
const cors = require("cors");

const productsRoutes = require("./routes/products");
const ordersRoutes = require("./routes/orders");
const volunteersRoutes = require("./routes/volunteers");
const testimonialsRoutes = require("./routes/testimonials");
const adminRoutes = require("./routes/admin");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({ status: "DXN API running" });
});

app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/volunteers", volunteersRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/admin", adminRoutes);

app.listen(port, () => {
  console.log(`DXN API listening on port ${port}`);
});
