require("dotenv").config();
const pool = require("../models/db");

// Mapping des noms de produits aux images
const productImageMap = [
  {
    productName: "DXN SPIRUNANAS",
    imagePath: "/images/DXN SPIRUNANAS.jpg"
  },
  {
    productName: "DXN NEPH-V",
    imagePath: "/images/DXN NEPH-V.jpg"
  },
  {
    productName: "DXN COFFEEPINE",
    imagePath: "/images/DXN COFFEEPINE CAKE.jpg"
  },
  {
    productName: "DXN OOLONG",
    imagePath: "/images/DXN OOLONG TEA POWDER.jpg"
  }
];

const run = async () => {
  try {
    console.log("Mise à jour des images des produits...\n");
    
    for (const mapping of productImageMap) {
      // Chercher le produit par nom (insensible à la casse)
      const [products] = await pool.query(
        "SELECT id, name_fr FROM products WHERE LOWER(name_fr) LIKE ?",
        [`%${mapping.productName.toLowerCase()}%`]
      );
      
      if (products.length === 0) {
        console.log(`⚠️  Produit non trouvé: ${mapping.productName}`);
        continue;
      }
      
      // Mettre à jour tous les produits correspondants
      for (const product of products) {
        await pool.query(
          "UPDATE products SET image = ? WHERE id = ?",
          [mapping.imagePath, product.id]
        );
        console.log(`✅ ${product.name_fr} -> ${mapping.imagePath}`);
      }
    }
    
    console.log("\n✅ Mise à jour terminée!");
  } catch (err) {
    console.error("❌ Erreur lors de la mise à jour:", err.message);
    console.error("Détails:", err);
  } finally {
    await pool.end();
    process.exit(0);
  }
};

run();
