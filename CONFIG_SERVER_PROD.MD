# Configuration Déploiement Application MEAN en Production

## 📋 Vue d'ensemble

Ce guide détaille le déploiement d'une application MEAN (MongoDB, Express, Angular, Node.js) sur MongoDB Atlas et Render.

---

## 1️⃣ Configuration MongoDB Atlas (Base de données)

### 1.1 Création du compte
- Accédez à : https://cloud.mongodb.com/
- Créez un compte gratuit

### 1.2 Création du projet
- Créez un nouveau projet MongoDB

### 1.3 Configuration du Cluster (gratuit)

**A. Configuration de la connexion**
- Créez un utilisateur de base de données
  - Username : `votre_username`
  - Password : `votre_password` (notez-le précieusement)

**B. Configuration des drivers**
- Driver : Node.js
- Version : 5.5 or later

**C. Configuration de l'accès IP**
- Ajoutez l'adresse IP : `0.0.0.0/0` (autorise toutes les IP - nécessaire pour Render)
- Status : Attendez que le statut passe de "Pending" à "Active"

**D. Récupération de l'URI de connexion**
- Format : `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<nom_base>?retryWrites=true&w=majority`
- Remplacez `<username>` et `<password>` par vos identifiants
- Ajoutez le nom de votre base de données (ex: `/mean_db`)

---

## 2️⃣ Configuration Render (Hébergement)

### 2.1 Création du compte
- Accédez à : https://dashboard.render.com/
- Créez un compte et liez votre compte GitHub/GitLab

---

## 3️⃣ Déploiement Backend (Express + Node.js)

### 3.1 Création du Web Service

**A. Configuration initiale**
- Type de service : **Web Service**
- Connexion au dépôt Git : Sélectionnez votre repository backend

**B. Configuration Build & Deploy**
- **Root Directory** : `backend` (si votre backend est dans un sous-dossier)
- **Build Command** : `npm install`
- **Start Command** : `node server.js` (ou `npm start`)

**C. Variables d'environnement (Section Environment)**

Ajoutez ces variables (Key: Value) :

| Key | Value | Description |
|-----|-------|-------------|
| `MONGO_URI` | `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mean_db?retryWrites=true&w=majority` | URI MongoDB Atlas |
| `NODE_ENV` | `production` | Environnement de production |
| `PORT` | `3000` | Port du serveur |
| `FRONTEND_URL` | `https://votre-frontend.onrender.com` | URL du frontend (à mettre à jour après déploiement frontend) |

**D. Déploiement**
- Render déploie automatiquement
- Vérifiez les logs : statut "Deploy successful" ✅ ou "Deploy failed" ❌
- Notez l'URL générée : `https://votre-backend-xxxxx.onrender.com`

---

## 4️⃣ Déploiement Frontend (Angular)

### 4.1 Configuration locale du projet Angular

**A. Vérifiez `angular.json`**

Dans la section `projects > frontend > architect > build > configurations > production`, assurez-vous d'avoir :
```json
"production": {
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.prod.ts"
    }
  ],
  "optimization": true,
  "outputHashing": "all",
  "sourceMap": false,
  "namedChunks": false,
  "extractLicenses": true
}
```

**B. Configurez `src/environments/environment.prod.ts`**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://votre-backend-xxxxx.onrender.com/api'
};
```

⚠️ Remplacez par l'URL réelle de votre backend Render

**C. Configurez le fichier `_redirects` pour le routing SPA**

1. Créez le dossier `public/` s'il n'existe pas :
```bash
mkdir -p public
```

2. Créez le fichier `public/_redirects` :
```
/*    /index.html   200
```

3. Modifiez `angular.json` pour copier ce fichier :
```json
"assets": [
  "src/favicon.ico",
  "src/assets",
  {
    "glob": "_redirects",
    "input": "public",
    "output": "/"
  }
]
```

**D. Build de production en local (test)**
```bash
cd frontend
ng build --configuration production
```

Vérifiez que :
- Le build compile sans erreur ✅
- Le fichier `_redirects` est dans `dist/frontend/browser/` ✅
- Aucune référence à `localhost` dans les fichiers JS :
```bash
grep -r "localhost" dist/
```

**E. Pushez sur Git**
```bash
git add .
git commit -m "Configuration production: environment et redirects"
git push origin main
```

### 4.2 Création du Static Site sur Render

**A. Configuration initiale**
- Type de service : **Static Site**
- Connexion au dépôt Git : Sélectionnez votre repository frontend

**B. Configuration Build & Deploy**
- **Root Directory** : `frontend` (si votre frontend est dans un sous-dossier)
- **Build Command** : `npm run build`
- **Publish Directory** : `dist/frontend/browser` (ou `dist/frontend` selon votre version Angular)

**C. Configuration Redirects/Rewrites (IMPORTANT)**

Dans le Dashboard Render, allez dans : **Settings → Redirects/Rewrites**

Ajoutez cette règle :

| Field | Value |
|-------|-------|
| **Source** | `/*` |
| **Destination** | `/index.html` |
| **Action** | `Rewrite` |

Cette configuration permet à Angular Router de gérer toutes les routes.

**D. Déploiement**
- Render déploie automatiquement
- Vérifiez les logs : statut "Deploy successful" ✅
- Notez l'URL générée : `https://votre-frontend.onrender.com`

### 4.3 Mise à jour de la variable FRONTEND_URL du backend

Retournez dans votre **Web Service backend** → **Environment** et mettez à jour :
```
FRONTEND_URL=https://votre-frontend.onrender.com
```

Sauvegardez. Le backend redémarrera automatiquement.

---

## 5️⃣ Vérification du déploiement

### 5.1 Test du Backend
```bash
# Test de la route santé
curl https://votre-backend.onrender.com/health

# Réponse attendue :
{
  "status": "OK",
  "mongodb": "connected",
  "timestamp": "..."
}

# Test de l'API
curl https://votre-backend.onrender.com/api/articles
```

### 5.2 Test du Frontend

1. Accédez à : `https://votre-frontend.onrender.com`
2. Ouvrez la console du navigateur (F12)
3. Vérifiez :
   - Aucune erreur JavaScript ✅
   - Les requêtes HTTP vont vers `votre-backend.onrender.com/api` ✅
   - Pas d'erreurs CORS ✅

4. Testez le routing :
   - `https://votre-frontend.onrender.com/` → Fonctionne ✅
   - `https://votre-frontend.onrender.com/articles` → Fonctionne ✅

---

## 6️⃣ Workflow de mise à jour

Pour déployer de nouvelles modifications :
```bash
# 1. Développez en local
# 2. Testez avec ng serve (frontend) et npm start (backend)
# 3. Committez vos changements
git add .
git commit -m "Description des changements"
git push origin main

# 4. Render détecte automatiquement et redéploie
# 5. Vérifiez les logs de déploiement sur Render Dashboard
```

---

## 7️⃣ Points de sécurité importants

### ✅ À FAIRE
- Fichier `.env` ajouté au `.gitignore` (ne JAMAIS pusher les secrets)
- Variables sensibles configurées dans Render Environment (pas dans le code)
- CORS configuré pour autoriser uniquement l'URL du frontend
- MongoDB Atlas avec authentification activée

### ❌ À NE PAS FAIRE
- Ne JAMAIS pusher le fichier `.env` sur Git
- Ne JAMAIS hardcoder les mots de passe dans le code
- Ne pas utiliser `0.0.0.0/0` pour MongoDB en production réelle (sauf pour Render qui a des IP dynamiques)

---

## 📋 Checklist finale de déploiement

**MongoDB Atlas :**
- [ ] Cluster créé et actif
- [ ] Utilisateur de BDD créé
- [ ] IP `0.0.0.0/0` autorisée
- [ ] URI de connexion récupérée

**Backend (Render Web Service) :**
- [ ] Repository Git connecté
- [ ] Build et Start commands configurées
- [ ] Variables d'environnement ajoutées (MONGO_URI, NODE_ENV, PORT, FRONTEND_URL)
- [ ] Déploiement réussi
- [ ] API accessible et fonctionnelle

**Frontend (Render Static Site) :**
- [ ] `environment.prod.ts` configuré avec URL backend
- [ ] Fichier `_redirects` créé et copié dans le build
- [ ] Build command et Publish directory configurés
- [ ] Redirects/Rewrites configuré (`/* → /index.html`)
- [ ] Déploiement réussi
- [ ] Application accessible et routing fonctionnel

**Tests :**
- [ ] Backend répond sur `/health` et `/api/articles`
- [ ] Frontend charge sans erreur
- [ ] Pas d'erreurs CORS
- [ ] Communication frontend ↔ backend fonctionnelle
- [ ] MongoDB stocke et récupère les données

---

## 🆘 Résolution des problèmes courants

| Problème | Cause probable | Solution |
|----------|---------------|----------|
| 404 sur routes Angular | Redirects/Rewrites non configuré | Ajouter `/* → /index.html` dans Render |
| Erreur CORS | CORS mal configuré backend | Vérifier `FRONTEND_URL` et configuration CORS |
| Connexion MongoDB échoue | IP non autorisée | Vérifier IP Access List : `0.0.0.0/0` |
| Backend appelle localhost | Mauvais environment | Vérifier `environment.prod.ts` avec bonne URL |
| Build failed | Erreurs de syntaxe | Vérifier logs Render, corriger le code |

---

**Date de création :** 23 Janvier 2026  
**Stack :** MongoDB Atlas + Express.js + Angular 19 + Node.js sur Render

                                                 By RATOVONANDRASANA Aina Ny Antsa