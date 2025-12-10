# 📱 Navigation Layout - Documentation

## ✅ Header & BottomNav Mis à Jour

Les composants de navigation ont été mis à jour avec le design system dark ! 🎉

---

## 🎨 Design System Appliqué

### Couleurs
- **Fond des barres** : `bg-slate-950` (#020617)
- **Bordures** : `border-slate-800` (#1e293b)
- **Couleur active** : `text-yellow-400` (#facc15)
- **Couleur inactive** : `text-slate-500` (#64748b)
- **Logo** : `text-yellow-400` (jaune)
- **Avatar** : `border-yellow-400` + `bg-yellow-400`

---

## 📱 Structure de Navigation

```
┌─────────────────────────────────────┐
│  👤 Jean Dupont    One Connexion 🔔│  ← Header
│     En ligne                        │
├─────────────────────────────────────┤
│                                     │
│         CONTENU DE LA PAGE          │
│                                     │
│                                     │
├─────────────────────────────────────┤
│  🏠     📦      🚗      👤          │  ← BottomNav
│ Accueil Courses Véhicules Profil   │
└─────────────────────────────────────┘
```

---

## 🔝 Header (`src/components/Header.tsx`)

### Structure

```tsx
<header className="bg-slate-950 border-b border-slate-800">
  <div className="flex items-center justify-between h-16">
    {/* Left: Profile */}
    <div>
      <Avatar /> {/* Jaune avec initiales noires */}
      <Status /> {/* Indicateur vert/jaune/gris */}
      <Name />   {/* Blanc */}
    </div>
    
    {/* Center: Logo */}
    <span className="text-yellow-400">One Connexion</span>
    
    {/* Right: Notifications */}
    <Button>
      <Bell /> {/* Badge rouge si notifications */}
    </Button>
  </div>
</header>
```

### Caractéristiques

#### Avatar
- **Bordure** : `border-yellow-400` (2px)
- **Fond** : `bg-yellow-400`
- **Initiales** : `text-black` (contraste fort)
- **Taille** : 40px (w-10 h-10)

#### Indicateur de Statut
- **En ligne** : `bg-green-500` (vert)
- **En course** : `bg-yellow-400` (jaune)
- **Hors ligne** : `bg-slate-500` (gris)
- **Position** : Coin bas-droit de l'avatar

#### Logo
- **Texte** : "One Connexion"
- **Couleur** : `text-yellow-400` (jaune)
- **Position** : Centré
- **Police** : Bold

#### Notifications
- **Icône** : Bell (cloche)
- **Couleur** : `text-slate-400`
- **Hover** : `text-yellow-400` + `bg-yellow-400/10`
- **Badge** : Rouge avec compteur (max 9+)

---

## 🔽 BottomNav (`src/components/BottomNav.tsx`)

### Structure

```tsx
<nav className="bg-slate-950 border-t border-slate-800">
  <div className="flex items-center justify-around h-16">
    {/* 4 onglets */}
    <NavLink to="/">
      <Home />      {/* Jaune si actif, gris sinon */}
      <span>Accueil</span>
    </NavLink>
    {/* ... */}
  </div>
</nav>
```

### Les 4 Onglets

| Onglet | Route | Icône | Label |
|--------|-------|-------|-------|
| **Accueil** | `/` | `Home` | Accueil |
| **Courses** | `/orders` | `Package` | Courses |
| **Véhicules** | `/vehicles` | `Car` | Véhicules |
| **Profil** | `/profile` | `User` | Profil |

### États Visuels

#### Actif (Sélectionné)
- **Icône** : `text-yellow-400` (jaune)
- **Label** : `text-yellow-400` (jaune)
- **Fond** : `bg-yellow-400/10` (jaune transparent)
- **Taille icône** : 24px (w-6 h-6)

#### Inactif
- **Icône** : `text-slate-500` (gris)
- **Label** : `text-slate-500` (gris)
- **Hover** : `text-slate-400` (gris plus clair)

### Caractéristiques

- **Hauteur** : 64px (h-16)
- **Position** : Fixed bottom
- **Z-index** : 50 (au-dessus du contenu)
- **Safe area** : `safe-bottom` pour les notches
- **Max width** : `max-w-lg mx-auto` (centré sur grand écran)

---

## 🎯 Utilisation

### Dans une Page

```tsx
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';

export default function MyPage() {
  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      <Header notificationCount={3} />
      
      <main className="px-4 py-6">
        {/* Contenu de la page */}
      </main>
      
      <BottomNav />
    </div>
  );
}
```

### Props du Header

```tsx
interface HeaderProps {
  notificationCount?: number; // Nombre de notifications (optionnel)
}
```

---

## 🎨 Classes Tailwind Utilisées

### Header
```tsx
// Container
className="bg-slate-950 border-b border-slate-800"

// Avatar
className="border-yellow-400 bg-yellow-400"

// Logo
className="text-yellow-400 font-bold"

// Notification
className="text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10"
```

### BottomNav
```tsx
// Container
className="bg-slate-950 border-t border-slate-800"

// Actif
className="text-yellow-400"

// Inactif
className="text-slate-500 hover:text-slate-400"

// Fond actif
className="bg-yellow-400/10"
```

---

## 📊 Responsive

### Mobile (< 640px)
- Header et BottomNav pleine largeur
- Icônes 24px
- Labels 10px

### Desktop (> 640px)
- Max width 512px (max-w-lg)
- Centré avec `mx-auto`
- Même design que mobile

---

## ✨ Animations

### Transitions
```tsx
// Changement de couleur fluide
className="transition-colors"

// Fond actif avec animation
className="transition-all duration-200"
```

### Effets Hover
- **BottomNav** : Changement de couleur au survol
- **Header Bell** : Changement de couleur + fond jaune transparent

---

## 🔄 Navigation Active

Le composant `NavLink` de React Router gère automatiquement l'état actif :

```tsx
<NavLink
  to="/orders"
  className={({ isActive }) => cn(
    "flex flex-col items-center",
    isActive ? "text-yellow-400" : "text-slate-500"
  )}
>
  {({ isActive }) => (
    <>
      <div className={isActive && "bg-yellow-400/10"}>
        <Package />
      </div>
      <span>Courses</span>
    </>
  )}
</NavLink>
```

---

## 🧪 Tester

Le serveur est lancé sur **http://localhost:8080**

1. **Connecte-toi** (auto-login ✅)
2. **Vérifie le Header** :
   - Avatar jaune avec initiales
   - Logo "One Connexion" en jaune
   - Indicateur de statut (vert/jaune/gris)
   - Icône de notification
3. **Vérifie le BottomNav** :
   - 4 onglets visibles
   - Onglet actif en jaune
   - Onglets inactifs en gris
   - Clique pour naviguer

---

## 📋 Pages Utilisant Header + BottomNav

- ✅ **Dashboard** (`/`)
- ✅ **Orders** (`/orders`)
- ✅ **Vehicles** (`/vehicles`)
- ✅ **Profile** (`/profile`)

---

## 🎨 Cohérence Visuelle

### Avec le Reste de l'App
- ✅ Même fond `bg-slate-950`
- ✅ Même accent `yellow-400`
- ✅ Même bordures `border-slate-800`
- ✅ Même typographie

### Hiérarchie des Couleurs
1. **Jaune** : Éléments actifs, logo, accents
2. **Blanc** : Texte principal
3. **Gris clair** : Texte secondaire
4. **Gris foncé** : Éléments inactifs

---

## ✅ Checklist

- [x] Header mis à jour avec design dark
- [x] BottomNav mis à jour avec design dark
- [x] Avatar jaune avec initiales noires
- [x] Logo jaune centré
- [x] Indicateur de statut coloré
- [x] 4 onglets configurés
- [x] Couleurs actives/inactives
- [x] Animations de transition
- [x] Safe areas pour mobile
- [x] Responsive design

---

**Navigation Layout terminée ! 📱✨**
