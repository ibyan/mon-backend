# 📚 Assignments API — Backend ESATIC 2025/2026

API REST Node.js/Express/MongoDB pour la gestion des assignments.

## 🚀 Fonctionnalités

- **CRUD complet** sur les Assignments avec pagination
- **Authentification JWT** (register, login, token Bearer)
- **Gestion des rôles** : `user` (ajout/modification) et `admin` (suppression)
- **Filtres** : recherche full-text, filtre par matière et par statut rendu/non rendu
- **Modèle enrichi** : auteur, matière, photo prof, note, remarques
- **Compte admin** créé automatiquement au démarrage
- **Script de seed** : 1000 assignments générés automatiquement

## 📦 Installation locale

```bash
git clone <URL_REPO>
cd backend
npm install
cp .env.example .env
# Remplissez MONGODB_URI dans .env avec votre cluster MongoDB Atlas
npm start
```

## 🌱 Peuplement de la base (1000 assignments)

```bash
node scripts/seed.js
```

## 🔐 Variables d'environnement

| Variable | Description | Défaut |
|---|---|---|
| `MONGODB_URI` | URI de connexion MongoDB Atlas | *requis* |
| `PORT` | Port du serveur | `8010` |
| `JWT_SECRET` | Clé secrète JWT | `esatic_secret_key_2025` |

## 📡 Routes API

### Auth (publiques)
| Méthode | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Créer un compte |
| POST | `/api/auth/login` | Se connecter → token JWT |
| GET | `/api/auth/me` | Profil (auth requis) |

### Assignments
| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/assignments` | Non | Liste paginée (+ filtres) |
| GET | `/api/assignments/:id` | Non | Détail |
| POST | `/api/assignments` | User | Créer |
| PUT | `/api/assignments` | User | Modifier |
| DELETE | `/api/assignments/:id` | Admin | Supprimer |

#### Paramètres de filtrage (GET /api/assignments)
- `page` : numéro de page (défaut: 1)
- `limit` : éléments par page (défaut: 10)
- `search` : recherche dans nom, auteur, matière
- `rendu` : `true` ou `false`
- `matiere` : nom exact de la matière

## 👤 Compte admin par défaut
- **Username** : `admin`
- **Password** : `Admin1234!`

## 🏗️ Déploiement sur Render.com

1. Créez un service **Web Service** sur render.com
2. Branch : `main`, Build Command : `npm install`, Start Command : `node server.js`
3. Variables d'environnement : `MONGODB_URI`, `JWT_SECRET`, `PORT`
