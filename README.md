# Projet MEAN Stack

Ce projet est basé sur le **MEAN stack** : **MongoDB**, **Express**, **Angular** et **Node.js**.  
Ce guide explique comment mettre en place la base de données, le backend et le frontend pour démarrer un projet MEAN.

---

## 1. Prérequis

- Node.js (v20+ recommandé)
- Angular CLI (v17+ recommandé)
- MongoDB (service installé et lancé)
- Navigateur moderne

---

## 2. Installation de MongoDB

### 2.1 Télécharger et extraire MongoDB

```bash
wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2204-8.2.3.tgz
tar -zxvf mongodb-linux-x86_64-ubuntu2204-8.2.3.tgz
sudo mv mongodb-linux-x86_64-ubuntu2204-8.2.3 /opt/mongodb
```

### 2.2 Créer les répertoires de données et logs

```bash
sudo mkdir -p /var/lib/mongodb /var/log/mongodb
sudo chown -R $USER /var/lib/mongodb /var/log/mongodb
```

### 2.3 Ajouter MongoDB au PATH

```bash
echo 'export PATH=/opt/mongodb/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
mongod --version
```

### 2.4 Installer mongosh (shell MongoDB)

```bash
wget https://downloads.mongodb.com/compass/mongosh-2.3.7-linux-x64.tgz
tar -zxvf mongosh-2.3.7-linux-x64.tgz
sudo cp mongosh-2.3.7-linux-x64/bin/* /opt/mongodb/bin/
mongosh
```

### 2.5 Interface graphique MongoDB (optionnel)

```bash
wget https://downloads.mongodb.com/compass/mongodb-compass_1.42.1_amd64.deb
sudo dpkg -i mongodb-compass_1.42.1_amd64.deb
sudo apt-get install -f
mongodb-compass
```

---

## 3. Installation Node.js et Angular CLI

### 3.1 Node.js

```bash
nvm install 20
node -v
```

### 3.2 Angular CLI

```bash
npm install -g @angular/cli@latest
ng version
```

---

## 4. Création d'un projet Angular (Frontend)

```bash
ng new frontend
cd frontend
ng serve --open
```

**URL :** http://localhost:4200

### 4.1 Création d'un service Angular

```bash
ng generate service services/nom-du-service
# ou version courte
ng g s services/nom-du-service
```

### 4.2 Création d'un component Angular

```bash
ng generate component components/nom-du-component --standalone
# ou version courte
ng g c components/nom-du-component --standalone
```

---

## 5. Création du backend (Node.js + Express)

### 5.1 Initialiser le backend

```bash
mkdir backend && cd backend
npm init -y
```

### 5.2 Installer les dépendances

```bash
npm install express mongoose cors dotenv body-parser
npm install --save-dev nodemon
```

### 5.3 Ajouter les scripts dans package.json

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### 5.4 Configurer Express et MongoDB (server.js)

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connecté"))
  .catch(err => console.log(err));

// Exemple de route
app.get('/', (req, res) => res.send('API MEAN en cours'));

// Lancer le serveur
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
```

### 5.5 Lancer le backend

Créez un fichier `.env` :

```
MONGO_URI=mongodb://localhost:27017/nom-de-la-base
```

Lancez le serveur :

```bash
npm run dev
```

---

## 6. Structure finale recommandée

```
backend/
 ├── server.js
 ├── .env
 ├── models/
 └── routes/

frontend/
 ├── src/app/
 │   ├── components/
 │   └── services/
 └── angular.json
```

---

## 7. Lancement complet

1. **Lancer MongoDB :**
   ```bash
   mongod --dbpath /var/lib/mongodb
   ```

2. **Lancer le backend :**
   ```bash
   cd backend
   npm run dev
   ```

3. **Lancer le frontend :**
   ```bash
   cd frontend
   ng serve --open
   ```

---

## Ressources utiles

- [Documentation MongoDB](https://docs.mongodb.com/)
- [Documentation Express](https://expressjs.com/)
- [Documentation Angular](https://angular.io/docs)
- [Documentation Node.js](https://nodejs.org/docs/)

---

## Licence

Ce projet est sous licence MIT.
