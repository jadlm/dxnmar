# Guide : Redéployer le backend sur Railway

## Méthode 1 : Redéploiement automatique (Recommandé)

Railway redéploie automatiquement quand tu pushes sur GitHub.

### Étapes :

1. **Vérifie que ton code est sur GitHub** :
   ```bash
   git status
   git push
   ```

2. **Railway détecte automatiquement le push** et redéploie
   - Va sur https://railway.app
   - Sélectionne ton projet
   - Va dans l'onglet **"Deployments"**
   - Tu verras un nouveau déploiement en cours

3. **Attends que le déploiement se termine** (quelques minutes)
   - Le statut passera de "Building" → "Deploying" → "Active"

---

## Méthode 2 : Redéploiement manuel depuis Railway

Si le redéploiement automatique ne fonctionne pas :

1. **Va sur Railway** : https://railway.app
2. **Sélectionne ton projet**
3. **Clique sur le service backend** (ton service Node.js)
4. **Va dans l'onglet "Deployments"**
5. **Clique sur les 3 points** (⋯) à côté du dernier déploiement
6. **Sélectionne "Redeploy"**

---

## Méthode 3 : Via Railway CLI

Si tu as Railway CLI installé :

```bash
# Installer Railway CLI (si pas déjà fait)
npm i -g @railway/cli

# Se connecter
railway login

# Lier le projet
railway link

# Redéployer
railway up
```

---

## Méthode 4 : Forcer un nouveau commit (si rien ne change)

Si tu veux forcer un redéploiement sans changer de code :

```bash
# Créer un commit vide
git commit --allow-empty -m "trigger redeploy"

# Push
git push
```

---

## Vérifier que le déploiement fonctionne

1. **Va dans Railway → Deployments**
2. **Clique sur le dernier déploiement**
3. **Regarde les logs** pour voir s'il y a des erreurs
4. **Vérifie que le service est "Active"**

---

## Problèmes courants

### Le déploiement échoue
- **Vérifie les logs** dans Railway → Deployments → Logs
- **Vérifie les variables d'environnement** dans Railway → Variables
- **Vérifie que `package.json` a bien le script `start`**

### Le service ne démarre pas
- **Vérifie le port** : Railway utilise `process.env.PORT`
- **Vérifie les variables d'environnement** (DB_HOST, DB_USER, etc.)
- **Regarde les logs** pour voir les erreurs

### Le redéploiement automatique ne fonctionne pas
- **Vérifie que Railway est connecté à ton repo GitHub**
- **Va dans Railway → Settings → Source**
- **Vérifie que le bon repo et la bonne branche sont sélectionnés**

---

## Configuration recommandée pour Railway

### Variables d'environnement à vérifier :
- `PORT` (automatique, ne pas définir)
- `DB_HOST` (depuis le service MySQL)
- `DB_USER` (depuis le service MySQL)
- `DB_PASSWORD` (depuis le service MySQL)
- `DB_NAME` (ex: `dxn`)
- `JWT_SECRET` (ta clé secrète)
- `ADMIN_USER` (nom d'utilisateur admin)
- `ADMIN_PASS` (mot de passe admin)

### Root Directory (si nécessaire) :
Si ton backend est dans un sous-dossier, configure :
- Railway → Settings → Root Directory : `backend`

---

## Recommandation

**La méthode la plus simple** : Pousse simplement tes changements sur GitHub avec `git push`, et Railway redéploiera automatiquement.
