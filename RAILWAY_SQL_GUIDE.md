# Guide : Exécuter le script SQL dans Railway

## Méthode 1 : Via le bouton "Connect" de Railway

### Étape 1 : Obtenir les credentials
1. Dans Railway, clique sur le bouton **"Connect"** (en haut à droite)
2. Tu verras les informations de connexion :
   - **Host** : `containers-us-xxx.railway.app`
   - **Port** : `xxxx`
   - **User** : `root`
   - **Password** : `xxxxx`
   - **Database** : `railway` ou `dxn`

### Étape 2 : Se connecter avec un client MySQL

#### Option A : MySQL Workbench (Interface graphique)
1. Télécharge MySQL Workbench : https://dev.mysql.com/downloads/workbench/
2. Crée une nouvelle connexion avec les credentials de Railway
3. Connecte-toi
4. Sélectionne la base de données `dxn` (ou crée-la si elle n'existe pas)
5. Ouvre le fichier `database/seed_categories.sql`
6. Exécute le script (Ctrl+Shift+Enter)

#### Option B : Ligne de commande MySQL
```bash
# Installe MySQL client si nécessaire
# Windows : Télécharge depuis https://dev.mysql.com/downloads/installer/

# Connecte-toi avec les credentials Railway
mysql -h [HOST] -P [PORT] -u root -p[PASSWORD] railway

# Puis exécute :
USE dxn;
SOURCE database/seed_categories.sql;
```

#### Option C : Utiliser un client web (phpMyAdmin ou Adminer)
1. Installe Adminer (simple client web PHP) : https://www.adminer.org/
2. Connecte-toi avec les credentials Railway
3. Sélectionne la base `dxn`
4. Va dans l'onglet "SQL"
5. Copie-colle le contenu de `database/seed_categories.sql`
6. Clique sur "Exécuter"

---

## Méthode 2 : Via Railway CLI (si installé)

```bash
# Installer Railway CLI
npm i -g @railway/cli

# Se connecter
railway login

# Lier le projet
railway link

# Exécuter le script SQL
railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE < database/seed_categories.sql
```

---

## Méthode 3 : Via le script Node.js (Le plus simple !)

Si tu as déjà configuré les variables d'environnement dans Railway :

1. **Va dans Railway → Variables** et vérifie que tu as :
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`

2. **Sur ton ordinateur local**, dans le dossier du projet :
   ```bash
   cd backend
   node scripts/seed_categories.js
   ```

   Le script utilisera automatiquement les variables d'environnement pour se connecter.

---

## Méthode 4 : Créer la table d'abord (si elle n'existe pas)

Si tu vois "You have no tables", il faut d'abord créer la table `categories` :

1. Clique sur **"Connect"** dans Railway
2. Utilise un client MySQL pour te connecter
3. Exécute ce SQL pour créer la table :

```sql
CREATE DATABASE IF NOT EXISTS dxn;
USE dxn;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_fr VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE
);
```

4. Puis exécute le script `seed_categories.sql`

---

## Recommandation

**La méthode la plus simple** : Utilise **MySQL Workbench** ou un client web comme **Adminer** avec les credentials du bouton "Connect" de Railway.
