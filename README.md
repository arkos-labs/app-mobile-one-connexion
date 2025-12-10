# 🚗 One Connexion Driver (PWA + Mobile)

Application mobile pour chauffeurs, développée avec une approche **Mobile-First**, transformable en PWA (Progressive Web App) et en application native (Android/iOS) via Capacitor.

## 🛠 Stack Technique

- **Frontend :** React 18 + TypeScript + Vite
- **UI/UX :** Tailwind CSS + Shadcn/ui + Lucide Icons
- **Mobile Native :** Capacitor 6 (Android & iOS)
- **PWA :** Vite Plugin PWA (Service Workers, Manifest, Offline-first)
- **Backend/Data :** Supabase (Auth & Database) - *En cours d'intégration*
- **Maps :** LocationIQ API (Affichage Cartes & Itinéraires)

---

## 🚀 Démarrage Rapide

### 1. Prérequis
- Node.js (v18+)
- Android Studio (pour le dev mobile Android)
- Compte Supabase (pour la connexion future)

### 2. Installation
```bash
# Installer les dépendances
npm install
```

### 3. Lancer en Développement (Web)
Pour tester l'interface dans le navigateur avec le Hot-Reload :

```bash
npm run dev
# Accessible sur http://localhost:5173
# Pour tester sur mobile via Wi-Fi : http://VOTRE_IP_LOCALE:5173
```

## 📱 Développement Mobile (Capacitor)

### Synchronisation
À chaque fois que vous modifiez le code `src/` ou installez un plugin, il faut compiler et synchroniser :

```bash
npm run cap:sync
# Cela fait : npm run build + npx cap sync
```

### Lancer sur Android
```bash
# Ouvrir le projet dans Android Studio
npx cap open android

# Ou lancer directement sur un émulateur/device connecté
npm run cap:run:android
```

## 🌐 Gestion PWA (Progressive Web App)
L'application est configurée pour être installable (Add to Home Screen) et fonctionner hors-ligne.

### Génération des Icônes
Si vous changez le logo (`public/favicon.ico`), régénérez les assets mobiles :

```bash
npm run generate-pwa-assets
```

### Test du Service Worker
Le Service Worker (cache hors-ligne) ne fonctionne qu'en version "Build" (pas en `npm run dev`).

```bash
npm run build
npm run preview
```

## 📂 Structure du Projet
```
/
├── android/              # Projet natif Android (Généré par Capacitor)
├── dist/                 # Build de production (le code compilé)
├── public/               # Assets statiques (Sons, Logos, Robots.txt)
│   └── sounds/           # Sons de notification (ex: notification.mp3)
├── src/
│   ├── components/       # Composants UI réutilisables (Boutons, Modales...)
│   ├── context/          # Contextes React (OrderContext, etc.)
│   ├── hooks/            # Hooks personnalisés (usePWA, useMobile...)
│   ├── pages/            # Écrans principaux (Dashboard, Login, Profil...)
│   ├── store/            # Gestion d'état global (Zustand : authStore, etc.)
│   ├── types/            # Définitions TypeScript partagées
│   ├── App.tsx           # Routeur principal & Layouts
│   └── main.tsx          # Point d'entrée React
├── capacitor.config.ts   # Configuration Mobile Native
├── pwa-assets.config.json # Config génération icônes
└── vite.config.ts        # Config Build & PWA
```

## 🛡️ Règles de Développement (Architecture)
1. **Mobile First :** Toujours penser "Écran tactile" et "Petit écran" en priorité.
2. **Zéro Scroll Dashboard :** La page d'accueil est fixe (`100dvh`), pas de défilement.
3. **Composants Atomiques :** Utiliser les composants `ui/` (Shadcn) pour la cohérence.
4. **État Global :** Utiliser Zustand (`src/store/`) pour les données partagées (User, GPS).

## 📝 Suivi du Projet
Voir le fichier `TODO.md` à la racine pour l'état d'avancement des tâches et la roadmap.

---
*Généré par l'Architecte Technique Senior - Arkos Labs*
