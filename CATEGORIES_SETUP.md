# Guide : Insérer les catégories dans la base de données

## Option 1 : Utiliser le script SQL (Recommandé pour Railway)

### Méthode A : Via Railway Dashboard (Le plus simple)

1. **Va sur Railway** : https://railway.app
2. **Sélectionne ton projet** avec la base de données MySQL
3. **Clique sur MySQL** dans les services
4. **Ouvre l'onglet "Data"** ou "Query"
5. **Copie-colle le contenu** de `database/seed_categories.sql` :
   ```sql
   USE dxn;

   INSERT INTO categories (name_fr, name_ar, slug) VALUES
   ('FOOD SUPPLEMENTS', 'مكملات غذائية', 'food-supplements'),
   ('COSMETICS & SKIN CARE', 'مستحضرات التجميل والعناية بالبشرة', 'cosmetics-skin-care'),
   ('PERSONAL CARE', 'العناية الشخصية', 'personal-care'),
   ('FOOD & BEVERAGE', 'طعام ومشروبات', 'food-beverage'),
   ('DXN OOTEA SERIE', 'سلسلة DXN OOTEA', 'dxn-ootea-serie'),
   ('APPAREL & CLOTHING', 'ملابس وأزياء', 'apparel-clothing'),
   ('DXN KALLOW COSMETICS', 'مستحضرات DXN KALLOW', 'dxn-kallow-cosmetics')
   ON DUPLICATE KEY UPDATE name_fr = VALUES(name_fr), name_ar = VALUES(name_ar);
   ```
6. **Exécute la requête** (bouton "Run" ou "Execute")

### Méthode B : Via MySQL en ligne de commande (Local)

Si tu as MySQL installé localement :

```bash
# Se connecter à MySQL
mysql -u root -p

# Ou si tu utilises Railway en local avec les credentials
mysql -h [HOST] -u [USER] -p [DATABASE]

# Puis exécuter :
USE dxn;
SOURCE database/seed_categories.sql;
```

---

## Option 2 : Utiliser le script Node.js (Recommandé pour développement local)

### Prérequis
- Node.js installé
- Variables d'environnement configurées (`.env` dans le dossier `backend`)

### Étapes

1. **Ouvre un terminal** dans le dossier du projet

2. **Va dans le dossier backend** :
   ```bash
   cd backend
   ```

3. **Vérifie que les variables d'environnement sont configurées** :
   - `DB_HOST` (ex: localhost ou l'host Railway)
   - `DB_USER` (ex: root)
   - `DB_PASSWORD` (ton mot de passe MySQL)
   - `DB_NAME` (ex: dxn)
   - `DB_PORT` (optionnel, ex: 3306)

4. **Exécute le script** :
   ```bash
   node scripts/seed_categories.js
   ```

5. **Tu devrais voir** :
   ```
   ✅ Category added/updated: FOOD SUPPLEMENTS
   ✅ Category added/updated: COSMETICS & SKIN CARE
   ✅ Category added/updated: PERSONAL CARE
   ✅ Category added/updated: FOOD & BEVERAGE
   ✅ Category added/updated: DXN OOTEA SERIE
   ✅ Category added/updated: APPAREL & CLOTHING
   ✅ Category added/updated: DXN KALLOW COSMETICS

   ✅ Seeded 7 categories
   ```

---

## Option 3 : Via Railway CLI (Avancé)

Si tu as Railway CLI installé :

```bash
# Se connecter à Railway
railway login

# Se connecter à ton projet
railway link

# Exécuter le script SQL via Railway
railway run mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < database/seed_categories.sql
```

---

## Vérification

Après avoir exécuté l'une des méthodes, vérifie que les catégories sont bien insérées :

1. **Via Railway Dashboard** : Exécute cette requête SQL :
   ```sql
   SELECT * FROM categories;
   ```

2. **Tu devrais voir 7 catégories** avec leurs noms en français et en arabe.

---

## Problèmes courants

### Erreur : "Table 'categories' doesn't exist"
→ La table n'existe pas. Exécute d'abord le script SQL de création de base de données :
```sql
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_fr VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE
);
```

### Erreur : "Access denied"
→ Vérifie les credentials de la base de données dans Railway.

### Le script Node.js ne se connecte pas
→ Vérifie que les variables d'environnement sont bien définies dans Railway ou dans ton fichier `.env`.

---

## Recommandation

**Pour Railway (production)** : Utilise l'**Option 1 - Méthode A** (Railway Dashboard) - c'est le plus simple et le plus sûr.

**Pour développement local** : Utilise l'**Option 2** (script Node.js) - plus pratique pour le développement.
