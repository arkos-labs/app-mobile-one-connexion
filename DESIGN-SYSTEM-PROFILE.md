# 🎨 Design System - One Connexion Driver

## ✅ Mise à Jour Terminée

Les écrans **Profile** et **Edit Profile** ont été mis à jour avec le design system dark moderne ! 🌙

---

## 🎨 Design System Appliqué

### Couleurs

| Élément | Classe Tailwind | Couleur Hex | Usage |
|---------|----------------|-------------|-------|
| **Fond Principal** | `bg-slate-950` | `#020617` | Fond de l'application |
| **Cartes** | `bg-slate-900` | `#0f172a` | Fond des cartes |
| **Bordures** | `border-slate-800` | `#1e293b` | Bordures des cartes |
| **Accent Primaire** | `bg-yellow-400` / `text-yellow-400` | `#facc15` | Avatar, étoiles, chiffres |
| **Texte Principal** | `text-white` | `#ffffff` | Titres, labels |
| **Texte Secondaire** | `text-gray-400` | `#9ca3af` | Sous-titres, descriptions |
| **Inputs** | `bg-slate-900` | `#0f172a` | Fond des champs |
| **Bouton Save** | `bg-yellow-400` + `text-black` | `#facc15` + `#000000` | Contraste fort |

---

## 📱 Écran Profile

### Structure

```
┌─────────────────────────────────────┐
│         Header (One Connexion)      │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │ 🟡 Avatar (Initiales noires)│   │
│  │ Jean Dupont                  │   │
│  │ ✓ Chauffeur Vérifié         │   │
│  │ ⭐ 4.9 (127 courses)         │   │
│  │ 📧 email@example.com         │   │
│  │ 📱 +33 6 XX XX XX XX         │   │
│  │ [Modifier mon profil]        │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  127      98%      2,450€   │   │
│  │ Courses  Satisf.  Ce mois   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔔 Notifications         >  │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 🛡️ Sécurité              >  │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 📄 Documents             >  │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 🚗 Véhicules             >  │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Se déconnecter] (Rouge)           │
└─────────────────────────────────────┘
```

### Caractéristiques

- ✅ **Avatar Jaune** : `bg-yellow-400` avec initiales en `text-black`
- ✅ **Badge "Chauffeur Vérifié"** : `bg-slate-800` avec `text-white`
- ✅ **Note 4.9** : Étoile jaune (`text-yellow-400 fill-yellow-400`)
- ✅ **Statistiques** : Chiffres en `text-yellow-400` et `text-white`
- ✅ **Menu Items** : Cartes `bg-slate-900` avec chevron gris
- ✅ **Bouton Déconnexion** : `text-red-400` avec bordure rouge

---

## ✏️ Écran Edit Profile

### Structure

```
┌─────────────────────────────────────┐
│  ← Edit Profile                     │
├─────────────────────────────────────┤
│         🟡 Avatar + 📷              │
│                                     │
│  Full Name                          │
│  ┌─────────────────────────────┐   │
│  │ Jane Cooper                  │   │
│  └─────────────────────────────┘   │
│                                     │
│  Nickname                           │
│  ┌─────────────────────────────┐   │
│  │ Jane                         │   │
│  └─────────────────────────────┘   │
│                                     │
│  Email (Read-only)                  │
│  ┌─────────────────────────────┐   │
│  │ email@example.com            │   │
│  └─────────────────────────────┘   │
│                                     │
│  Phone                              │
│  ┌─────────────────────────────┐   │
│  │ +33 6 XX XX XX XX            │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│  [Discard]        [🟡 Save]         │
└─────────────────────────────────────┘
```

### Caractéristiques

- ✅ **Avatar** : Même style jaune avec bouton caméra
- ✅ **Labels** : `text-gray-400` au-dessus des champs
- ✅ **Inputs** : `bg-slate-900` avec bordure `border-slate-700`
- ✅ **Email** : `bg-slate-800` en lecture seule (grisé)
- ✅ **Focus** : Bordure jaune (`focus:border-yellow-400`)
- ✅ **Bouton Discard** : Outline blanc
- ✅ **Bouton Save** : `bg-yellow-400` avec `text-black` (contraste fort)

---

## 🎯 Classes Tailwind Utilisées

### Fond et Cartes
```tsx
className="bg-slate-950"           // Fond principal
className="bg-slate-900"           // Cartes
className="border-slate-800"       // Bordures
```

### Avatar
```tsx
className="bg-yellow-400 text-black"  // Avatar jaune, texte noir
```

### Texte
```tsx
className="text-white"             // Titres
className="text-gray-400"          // Sous-titres
className="text-yellow-400"        // Accents (chiffres, étoiles)
```

### Inputs
```tsx
className="bg-slate-900 border-slate-700 text-white focus:border-yellow-400"
```

### Boutons
```tsx
// Bouton Save (Jaune)
className="bg-yellow-400 hover:bg-yellow-500 text-black"

// Bouton Discard (Outline)
className="border-slate-700 text-white hover:bg-slate-800"

// Bouton Déconnexion (Rouge)
className="text-red-400 border-red-400/30 hover:bg-red-400/10"
```

---

## 🔄 Navigation

### Profile → Edit Profile
```tsx
onClick={() => navigate('/profile/edit')}
```

### Edit Profile → Profile
```tsx
onClick={() => navigate('/profile')}
```

---

## 📊 Données Affichées

### Profile
- **Avatar** : Initiales du chauffeur
- **Nom** : `${driver.first_name} ${driver.last_name}`
- **Email** : `driver.email`
- **Téléphone** : `driver.phone`
- **Statistiques** : 127 courses, 98% satisfaction, 2,450€

### Edit Profile
- **Full Name** : Éditable
- **Nickname** : Éditable (prénom)
- **Email** : Lecture seule (non modifiable)
- **Phone** : Éditable
- **Address** : Éditable
- **Occupation** : Éditable

---

## ✨ Fonctionnalités

### Profile
- ✅ Affichage des informations du chauffeur
- ✅ Statistiques (courses, satisfaction, revenus)
- ✅ Menu avec 6 items (Notifications, Sécurité, Documents, Véhicules, Paramètres, Aide)
- ✅ Bouton "Modifier mon profil" → Navigation vers Edit Profile
- ✅ Bouton "Se déconnecter" → Logout + Redirection vers Login

### Edit Profile
- ✅ Édition du nom complet
- ✅ Édition du nickname
- ✅ Email en lecture seule (sécurité)
- ✅ Édition du téléphone
- ✅ Bouton "Discard" → Annule et retourne au profil
- ✅ Bouton "Save" → Enregistre et retourne au profil
- ✅ Toast de confirmation

---

## 🎨 Cohérence Visuelle

### Avec le Login
Le design system est cohérent avec la page de login :
- ✅ Même fond `bg-slate-950`
- ✅ Même accent jaune `yellow-400`
- ✅ Même style de cartes `bg-slate-900`

### Avec le Dashboard
Le design s'intègre parfaitement avec le reste de l'app :
- ✅ Header uniforme
- ✅ BottomNav présent
- ✅ Même palette de couleurs

---

## 📱 Responsive

Les écrans sont optimisés pour mobile :
- ✅ `max-w-lg mx-auto` pour centrer le contenu
- ✅ `safe-top` et `safe-bottom` pour les notches
- ✅ `pb-24` pour l'espace du BottomNav
- ✅ Boutons pleine largeur sur mobile

---

## 🚀 Tester

Le serveur est déjà lancé sur **http://localhost:8080**

1. **Connecte-toi** (auto-login activé)
2. **Va sur Profile** (icône utilisateur dans le BottomNav)
3. **Clique sur "Modifier mon profil"**
4. **Teste l'édition** et clique sur "Save"

---

## ✅ Résumé

| Écran | Fond | Cartes | Accent | Bouton Principal |
|-------|------|--------|--------|------------------|
| **Profile** | `slate-950` | `slate-900` | `yellow-400` | Outline blanc |
| **Edit Profile** | `slate-950` | `slate-900` | `yellow-400` | Jaune + Noir |

---

**Design system dark moderne appliqué avec succès ! 🌙✨**
