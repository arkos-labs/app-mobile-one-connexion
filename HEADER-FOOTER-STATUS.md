# ✅ Header & Footer Visibles Partout

## 📋 État Actuel des Pages

### Pages avec Header + BottomNav ✅

| Page | Route | Header | BottomNav | Fond |
|------|-------|--------|-----------|------|
| **Dashboard** | `/` | ✅ | ✅ | `bg-slate-950` |
| **Orders** | `/orders` | ✅ | ✅ | À vérifier |
| **Vehicles** | `/vehicles` | ✅ | ✅ | À vérifier |
| **Profile** | `/profile` | ✅ | ✅ | `bg-slate-950` |

### Pages avec Header Personnalisé (Normal) ⚙️

Ces pages ont un header personnalisé avec bouton retour, c'est normal :

| Page | Route | Header Type | BottomNav |
|------|-------|-------------|-----------|
| **Edit Profile** | `/profile/edit` | Custom (← Retour) | ❌ |
| **Notification Settings** | `/notifications/settings` | Custom (← Retour) | ❌ |
| **Security Settings** | `/security` | Custom (← Retour) | ❌ |
| **Order Detail** | `/order/:id` | Custom (← Retour) | ❌ |
| **Proof of Delivery** | `/order/:id/proof` | Custom (← Retour) | ❌ |

### Pages sans Navigation (Normal) 🔐

| Page | Route | Raison |
|------|-------|--------|
| **Login** | `/login` | Page publique |
| **Not Found** | `*` | Page d'erreur |

---

## 🎨 Design System Appliqué

### Header (Toutes les pages principales)
```tsx
<Header notificationCount={2} />
```

- **Fond** : `bg-slate-950`
- **Avatar** : Jaune avec initiales noires
- **Logo** : "One Connexion" en jaune
- **Notification** : Cloche avec badge

### BottomNav (Toutes les pages principales)
```tsx
<BottomNav />
```

- **Fond** : `bg-slate-950`
- **4 onglets** : Accueil, Courses, Véhicules, Profil
- **Actif** : Jaune
- **Inactif** : Gris

---

## 📱 Structure Type d'une Page Principale

```tsx
export default function MyPage() {
  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      <Header notificationCount={0} />
      
      <main className="px-4 py-6 max-w-lg mx-auto">
        {/* Contenu de la page */}
      </main>
      
      <BottomNav />
    </div>
  );
}
```

### Points Clés
- **Fond** : `bg-slate-950` (dark)
- **Padding bottom** : `pb-24` (espace pour le BottomNav)
- **Main** : `max-w-lg mx-auto` (centré sur grand écran)
- **Header** : Sticky en haut
- **BottomNav** : Fixed en bas

---

## 🔧 Composant MainLayout (Optionnel)

Un composant réutilisable a été créé pour simplifier :

```tsx
import { MainLayout } from '@/components/MainLayout';

export default function MyPage() {
  return (
    <MainLayout notificationCount={0}>
      <div className="px-4 py-6 max-w-lg mx-auto">
        {/* Contenu */}
      </div>
    </MainLayout>
  );
}
```

### Props
```tsx
interface MainLayoutProps {
  children: ReactNode;
  notificationCount?: number;  // Badge de notification
  showBottomNav?: boolean;     // Afficher le BottomNav (défaut: true)
}
```

---

## ✅ Corrections Effectuées

### Dashboard
- ✅ Changé `bg-background` → `bg-slate-950`
- ✅ Header présent
- ✅ BottomNav présent

---

## 🧪 Vérification

Pour vérifier que Header et BottomNav sont visibles partout :

1. **Dashboard** (`/`) :
   - Header en haut ✅
   - BottomNav en bas ✅
   - Fond dark ✅

2. **Orders** (`/orders`) :
   - Header en haut ✅
   - BottomNav en bas ✅

3. **Vehicles** (`/vehicles`) :
   - Header en haut ✅
   - BottomNav en bas ✅

4. **Profile** (`/profile`) :
   - Header en haut ✅
   - BottomNav en bas ✅

---

## 📊 Hiérarchie Visuelle

```
┌─────────────────────────────────────┐
│  Header (Fixed Top)                 │  ← Toujours visible
│  - Avatar + Logo + Notification     │
├─────────────────────────────────────┤
│                                     │
│  Main Content (Scrollable)          │  ← Contenu de la page
│  - padding-bottom: 96px (6rem)      │
│                                     │
│                                     │
├─────────────────────────────────────┤
│  BottomNav (Fixed Bottom)           │  ← Toujours visible
│  - 4 onglets de navigation          │
└─────────────────────────────────────┘
```

---

## 🎯 Pages Principales vs Pages Secondaires

### Pages Principales (avec Header + BottomNav)
- Dashboard
- Orders (liste)
- Vehicles (liste)
- Profile

### Pages Secondaires (avec Header personnalisé)
- Edit Profile
- Notification Settings
- Security Settings
- Order Detail
- Proof of Delivery

**Raison** : Les pages secondaires ont un bouton retour pour revenir à la page précédente, donc pas besoin du BottomNav.

---

## ✨ Avantages

### Avec MainLayout
- ✅ Code plus propre
- ✅ Moins de répétition
- ✅ Facile à maintenir
- ✅ Cohérence garantie

### Sans MainLayout (Actuel)
- ✅ Plus de contrôle
- ✅ Flexibilité par page
- ✅ Personnalisation facile

---

## 📝 Recommandations

1. **Garder le Header et BottomNav** sur les 4 pages principales
2. **Utiliser un header personnalisé** pour les pages de détail/paramètres
3. **Toujours utiliser** `bg-slate-950` comme fond
4. **Toujours ajouter** `pb-24` quand BottomNav est présent

---

**Header et BottomNav sont maintenant visibles sur toutes les pages principales ! ✅**
