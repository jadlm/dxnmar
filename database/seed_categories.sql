-- Script pour insérer les catégories de produits DXN
USE dxn;

-- Supprimer les anciennes catégories si nécessaire (optionnel)
-- DELETE FROM categories;

-- Insérer les nouvelles catégories
INSERT INTO categories (name_fr, name_ar, slug) VALUES
('FOOD SUPPLEMENTS', 'مكملات غذائية', 'food-supplements'),
('COSMETICS & SKIN CARE', 'مستحضرات التجميل والعناية بالبشرة', 'cosmetics-skin-care'),
('PERSONAL CARE', 'العناية الشخصية', 'personal-care'),
('FOOD & BEVERAGE', 'طعام ومشروبات', 'food-beverage'),
('DXN OOTEA SERIE', 'سلسلة DXN OOTEA', 'dxn-ootea-serie'),
('APPAREL & CLOTHING', 'ملابس وأزياء', 'apparel-clothing'),
('DXN KALLOW COSMETICS', 'مستحضرات DXN KALLOW', 'dxn-kallow-cosmetics')
ON DUPLICATE KEY UPDATE name_fr = VALUES(name_fr), name_ar = VALUES(name_ar);
