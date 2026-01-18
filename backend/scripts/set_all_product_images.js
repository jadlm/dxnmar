const pool = require("../models/db");

const IMAGE_PATH = "/images/ganocelium (GL 360).jpeg";

const run = async () => {
  try {
    await pool.query("UPDATE products SET image = ?", [IMAGE_PATH]);
    console.log("Updated all products with image:", IMAGE_PATH);
  } catch (err) {
    console.error("Update failed", err.message);
  } finally {
    process.exit(0);
  }
};

run();
