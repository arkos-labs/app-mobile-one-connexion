# 📱 Configuration PWA Mobile-First + Capacitor

## ✅ Configuration Terminée

Ton projet est maintenant configuré en tant que **PWA Mobile-First** compatible avec **Capacitor** !

---

## 📋 Ce qui a été configuré

### 1. **vite.config.ts**
- ✅ Plugin `vite-plugin-pwa` installé et configuré
- ✅ Mode `registerType: 'autoUpdate'` activé (mises à jour automatiques)
- ✅ Manifest PWA complet avec icônes
- ✅ Workbox configuré pour le cache intelligent (offline-first)
- ✅ Build optimisé pour Capacitor

### 2. **capacitor.config.ts**
- ✅ `webDir` configuré sur `dist`
- ✅ `androidScheme: 'https'` pour éviter les problèmes CORS
- ✅ Configuration Android et iOS optimisée
- ✅ SplashScreen configuré

### 3. **index.html**
- ✅ Meta viewport mobile-first avec `user-scalable=no`
- ✅ Support des safe areas (notches iPhone X+)
- ✅ Meta `theme-color` configuré
- ✅ Meta tags PWA complets

### 4. **Service Worker**
- ✅ Enregistrement automatique dans `src/main.tsx`
- ✅ Auto-update toutes les heures
- ✅ Logs pour le debug
- ✅ Types TypeScript configurés

---

## 🚀 Commandes Disponibles

### Développement Web
```bash
npm run dev                    # Lance le serveur de développement
npm run build                  # Build de production
npm run preview                # Prévisualise le build
```

### PWA
```bash
npm run generate-pwa-assets    # Génère les icônes PWA automatiquement
```

### Capacitor (Mobile)
```bash
npm run cap:sync              # Build + Sync avec Capacitor
npm run cap:android           # Ouvre le projet dans Android Studio
npm run cap:run:android       # Build + Lance sur Android
```

---

## 📱 Génération des Icônes PWA

### ⚠️ IMPORTANT : Icônes Requises

Avant de déployer, tu dois générer les icônes PWA. Voici les tailles requises :

- `pwa-64x64.png`
- `pwa-192x192.png`
- `pwa-512x512.png`
- `maskable-icon-512x512.png`
- `apple-touch-icon.png` (180x180)

### Option 1 : Automatique (Recommandé)
```bash
# Place ton icône source (512x512 minimum) dans public/
npm run generate-pwa-assets
```

### Option 2 : Outils en ligne
1. Va sur https://www.pwabuilder.com/imageGenerator
2. Upload ton icône (512x512 minimum)
3. Télécharge les icônes générées
4. Place-les dans le dossier `public/`

### Option 3 : Manuel
Utilise un éditeur d'images pour créer les tailles requises et place-les dans `public/`

---

## 🔧 Service Worker - Explication

### ❓ Dois-je créer un fichier sw.js manuel ?

**NON !** 🎉 La configuration Vite suffit.

Le plugin `vite-plugin-pwa` génère automatiquement le Service Worker pour toi lors du build.

### Comment ça fonctionne ?

1. **En développement (`npm run dev`)** :
   - Le Service Worker est actif (grâce à `devOptions.enabled: true`)
   - Tu peux tester les fonctionnalités PWA localement

2. **En production (`npm run build`)** :
   - Vite génère automatiquement `sw.js` dans le dossier `dist/`
   - Le fichier `manifest.webmanifest` est aussi généré
   - Tous les assets sont pré-cachés selon la config Workbox

3. **Enregistrement automatique** :
   - Le code dans `src/main.tsx` enregistre le SW automatiquement
   - Les mises à jour sont détectées et appliquées automatiquement
   - L'app fonctionne offline après la première visite

### Stratégies de Cache Configurées

- **Fonts Google** : `CacheFirst` (1 an)
- **API Calls** : `NetworkFirst` avec fallback cache (5 min)
- **Assets statiques** : Pré-cachés au premier chargement

---

## 📱 Tester la PWA

### Sur Desktop (Chrome/Edge)
1. Lance `npm run dev`
2. Ouvre DevTools → Application → Service Workers
3. Tu devrais voir le SW enregistré
4. Teste le mode offline dans DevTools → Network → Offline

### Sur Mobile (Développement)
1. Assure-toi que ton mobile et PC sont sur le même réseau
2. Dans `capacitor.config.ts`, décommente et configure :
   ```typescript
   server: {
     url: 'http://192.168.1.X:8080',  // Ton IP locale
     cleartext: true
   }
   ```
3. Lance `npm run cap:run:android`

### Installation PWA
- **Desktop** : Icône "Installer" dans la barre d'adresse
- **Mobile** : "Ajouter à l'écran d'accueil" dans le menu du navigateur

---

## 🏗️ Build et Déploiement

### Pour le Web (PWA)
```bash
npm run build
# Les fichiers sont dans dist/
# Deploy dist/ sur ton hébergeur (Netlify, Vercel, etc.)
```

### Pour Android
```bash
npm run cap:sync          # Synchronise le code web avec Android
npm run cap:android       # Ouvre dans Android Studio
# Puis build l'APK/AAB depuis Android Studio
```

---

## ✨ Fonctionnalités PWA Activées

- ✅ **Installation** : L'app peut être installée sur mobile/desktop
- ✅ **Offline** : Fonctionne sans connexion après la première visite
- ✅ **Auto-update** : Mises à jour automatiques en arrière-plan
- ✅ **Cache intelligent** : Workbox optimise les performances
- ✅ **Mobile-first** : Optimisé pour les appareils mobiles
- ✅ **Safe areas** : Support des notches (iPhone X+)
- ✅ **No zoom** : Expérience native (user-scalable=no)

---

## 🐛 Debug et Logs

Les logs du Service Worker apparaissent dans la console :
- ✅ Service Worker enregistré
- 🔄 Nouvelle version disponible
- ✅ Application prête hors ligne
- ❌ Erreurs éventuelles

Pour voir plus de détails :
- Chrome DevTools → Application → Service Workers
- Chrome DevTools → Application → Manifest

---

## 📚 Ressources Utiles

- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [PWA Builder](https://www.pwabuilder.com/)
- [Workbox](https://developers.google.com/web/tools/workbox)

---

## 🎯 Prochaines Étapes

1. **Génère les icônes PWA** (voir section ci-dessus)
2. **Teste en local** : `npm run dev`
3. **Build** : `npm run build`
4. **Teste la PWA** : `npm run preview`
5. **Sync avec Android** : `npm run cap:sync`
6. **Test sur mobile** : `npm run cap:run:android`

---

## ⚠️ Notes Importantes

### Architecture Lovable Préservée
- ✅ Aucun fichier de l'architecture Lovable n'a été modifié
- ✅ Seuls les fichiers de configuration ont été touchés
- ✅ Le code source React reste intact

### CORS et Sécurité
- Le `androidScheme: 'https'` évite les problèmes CORS sur mobile
- En production, assure-toi que ton API accepte les requêtes HTTPS

### Performance
- Le code splitting est configuré (vendor chunk séparé)
- Les fonts et assets sont cachés intelligemment
- L'app se charge rapidement même offline

---

Bon développement ! 🚀
