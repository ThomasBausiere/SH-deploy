# Guild Wars – Chasseur de Compétences (Java / Angular)

> Projet personnel pour **mettre en pratique** mes compétences, **montrer ma passion du dev** et fournir une application utile à la communauté **Guild Wars**.

![Angular](https://img.shields.io/badge/Angular-20%2B-DD0031?logo=angular&logoColor=white)
![Java](https://img.shields.io/badge/Java-17%2B-007396?logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?logo=springboot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-informational)

---

## 🎯 Objectif du projet (projet passion)

Dans **Guild Wars** (NCsoft), un titre/succès consiste à **capturer 300 compétences élites** disséminées aux quatre coins du monde, détenues par des **boss**. Les joueurs doivent trouver puis éliminer ces boss pour **capturer** chaque compétence.

Mon application **recense** ces compétences élites et **affiche** les boss qui les possèdent, afin d'aider les joueurs dans leur **quête de chasseur de compétences**. Les utilisateurs peuvent :
- **Créer un compte** et **s'authentifier** (Spring Security, JWT).
- Créer des **toons** (personnages) et **suivre la progression** des compétences élites capturées.
- Naviguer dans un **catalogue** (compétences ⇄ boss) avec filtres et recherche.
- Utiliser un **panel admin** pour gérer **utilisateurs / toons / boss / compétences**.

---

## 🧱 Architecture & techno

**Front** : Angular **20+**, TypeScript, RxJS, Angular Router, Tailwind (optionnel).  
**Back** : Java **17+**, Spring Boot 3.x, Spring Security (JWT Bearer), Spring Data JPA, MapStruct/Lombok (si présents).  
**DB** : MySQL 8.x.  
**Data** : Script **Python** de scraping (compétences & boss).  
**Design** : Maquettes **Figma**.  


---

## ✨ Fonctionnalités principales

- Authentification & autorisation **JWT** (login, enregistrement, Bearer token).
- Gestion **utilisateur** : profil, changement de mot de passe, suppression de compte.
- Gestion **toons** : création, liste des compétences élites capturées/à faire.
- Catalogue **compétences ⇄ boss** avec recherche/filtre et fiches détaillées.
- **Admin panel** (ROLE_ADMIN) : CRUD **utilisateurs / toons / boss / compétences**.
- **Scraping Python** des données initiales (import vers la base).
- API REST **documentée** (OpenAPI/Swagger si activé).

---



## 🔐 Authentification (Spring Security + JWT)

- **Inscription** : `POST /api/auth/register`
- **Login** : `POST /api/auth/login` → retourne un **JWT**.
- **Usage** : `Authorization: Bearer <token>`
- **Rôles** : `ROLE_USER`, `ROLE_ADMIN` (accès panel admin).
- **Endpoints protégés** : CRUD toons, modification MDP, suppression compte, etc.
- **Bonne pratique** : rotation & durée de vie contrôlée du token, header `Authorization` uniquement via HTTPS.

---

## 🗂️ Modèles & relations (exemple)

- `User` (1) ── (N) `Toon`
- `Toon` (N) ── (N) `EliteSkill` (table de jointure `toon_skills`)
- `EliteSkill` (N) ── (N) `Boss` (table de jointure `boss_skills`)

Champs clés (indicatif) :
```text
User(id, username, email, passwordHash, roles, createdAt)
Toon(id, userId, name, profession, createdAt)
EliteSkill(id, name, profession, description, captureZone, wikiUrl, ...)
Boss(id, name, region, zone, level, ...)
```

---

## 📡 API (exemples d’endpoints)

```http
GET    /api/skills?profession=Moine&search=MotCleansed
GET    /api/skills/{id}
GET    /api/bosses?zone=Cantha
GET    /api/bosses/{id}
GET    /api/skills/{id}/bosses
POST   /api/toons              (auth)
POST   /api/toons/{id}/skills  (auth)
DELETE /api/toons/{id}/skills/{skillId} (auth)

# Admin
POST   /api/admin/skills
PUT    /api/admin/skills/{id}
DELETE /api/admin/skills/{id}
# idem pour /bosses, /users, /toons
```



## 🙌 Pourquoi ce projet ?

Pour **prouver** mes compétences, ma **détermination** et mon **énergie** à concevoir des solutions utiles : réflexion produit, design, scraping, **stack complète** (Angular + Spring Boot + MySQL + Security), qualité et préparation au déploiement. J’ai beaucoup appris et j’ai hâte de continuer avec de nouveaux projets.

---

## 📬 Contact

- Auteur : *Thomas Bausiere*
- Email : t.bausiere@gmail.com
- LinkedIn : https://www.linkedin.com/in/thomasbausiere


