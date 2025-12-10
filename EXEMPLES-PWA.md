# 💡 Exemples d'Intégration PWA

Ce fichier contient des exemples de code pour intégrer les fonctionnalités PWA dans ton application.

---

## 1️⃣ Ajouter le Bouton d'Installation PWA

### Dans ton Layout Principal ou App.tsx

```tsx
import { PWAStatus } from '@/components/PWAStatus';

function App() {
  return (
    <div className="min-h-screen">
      {/* Ton contenu existant */}
      <YourRoutes />
      
      {/* Composant PWA - Affiche automatiquement le bouton d'installation */}
      <PWAStatus />
    </div>
  );
}
```

---

## 2️⃣ Utiliser le Hook usePWA dans un Composant

### Exemple : Afficher un Badge "Offline"

```tsx
import { usePWA } from '@/hooks/usePWA';
import { WifiOff } from 'lucide-react';

function Header() {
  const { isOnline } = usePWA();

  return (
    <header className="flex items-center justify-between p-4">
      <h1>One Connexion Driver</h1>
      
      {!isOnline && (
        <div className="flex items-center gap-2 bg-yellow-500 text-white px-3 py-1 rounded-full">
          <WifiOff className="h-4 w-4" />
          <span className="text-sm">Hors ligne</span>
        </div>
      )}
    </header>
  );
}
```

### Exemple : Bouton d'Installation Personnalisé

```tsx
import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

function InstallButton() {
  const { canInstall, installPWA, isInstalled } = usePWA();

  if (isInstalled || !canInstall) {
    return null; // Ne rien afficher si déjà installé ou pas disponible
  }

  return (
    <Button 
      onClick={installPWA}
      variant="default"
      className="fixed bottom-4 right-4 shadow-lg"
    >
      <Download className="mr-2 h-4 w-4" />
      Installer l'application
    </Button>
  );
}
```

---

## 3️⃣ Afficher une Notification de Mise à Jour

### Créer un Composant UpdateNotification

```tsx
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    // Écouter l'événement de mise à jour du Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setShowUpdate(true);
      });
    }
  }, []);

  const handleUpdate = () => {
    window.location.reload();
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-blue-500 text-white p-4 rounded-lg shadow-lg max-w-sm">
      <div className="flex items-start gap-3">
        <RefreshCw className="h-5 w-5 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Mise à jour disponible</h3>
          <p className="text-sm mb-3">
            Une nouvelle version de l'application est disponible.
          </p>
          <Button 
            onClick={handleUpdate}
            variant="secondary"
            size="sm"
            className="w-full"
          >
            Mettre à jour maintenant
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### Utilisation

```tsx
import { UpdateNotification } from '@/components/UpdateNotification';

function App() {
  return (
    <div>
      <UpdateNotification />
      {/* Reste de ton app */}
    </div>
  );
}
```

---

## 4️⃣ Gérer le Mode Offline dans tes Composants

### Exemple : Désactiver un Formulaire en Mode Offline

```tsx
import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function CreateOrderForm() {
  const { isOnline } = usePWA();

  return (
    <form>
      <Input 
        placeholder="Adresse de livraison"
        disabled={!isOnline}
      />
      
      <Button 
        type="submit"
        disabled={!isOnline}
      >
        {isOnline ? 'Créer la course' : 'Connexion requise'}
      </Button>
      
      {!isOnline && (
        <p className="text-sm text-yellow-600 mt-2">
          ⚠️ Vous devez être en ligne pour créer une course
        </p>
      )}
    </form>
  );
}
```

---

## 5️⃣ Afficher un Indicateur de Connexion Global

### Créer un Toast de Connexion

```tsx
import { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { toast } from 'sonner';

export function ConnectionMonitor() {
  const { isOnline } = usePWA();

  useEffect(() => {
    if (isOnline) {
      toast.success('Connexion rétablie', {
        description: 'Vous êtes de nouveau en ligne',
        icon: '✅',
      });
    } else {
      toast.warning('Connexion perdue', {
        description: 'Vous êtes en mode hors ligne',
        icon: '⚠️',
        duration: Infinity, // Reste affiché jusqu'à reconnexion
      });
    }
  }, [isOnline]);

  return null; // Composant invisible
}
```

### Utilisation

```tsx
import { ConnectionMonitor } from '@/components/ConnectionMonitor';

function App() {
  return (
    <div>
      <ConnectionMonitor />
      {/* Reste de ton app */}
    </div>
  );
}
```

---

## 6️⃣ Vérifier si l'App est Installée

### Exemple : Afficher un Message Différent

```tsx
import { usePWA } from '@/hooks/usePWA';

function WelcomeMessage() {
  const { isInstalled } = usePWA();

  return (
    <div>
      {isInstalled ? (
        <h1>Bienvenue dans l'application One Connexion ! 🎉</h1>
      ) : (
        <div>
          <h1>Bienvenue sur One Connexion</h1>
          <p>💡 Installez l'application pour une meilleure expérience</p>
        </div>
      )}
    </div>
  );
}
```

---

## 7️⃣ Détecter le Type d'Affichage (PWA vs Navigateur)

### Exemple : Analytics ou Comportement Différent

```tsx
import { useEffect, useState } from 'react';

function useDisplayMode() {
  const [displayMode, setDisplayMode] = useState<'browser' | 'standalone' | 'twa'>('browser');

  useEffect(() => {
    // Détecte si l'app est lancée en mode standalone (PWA installée)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setDisplayMode('standalone');
    }
    // Détecte si c'est une Trusted Web Activity (Android)
    else if (document.referrer.includes('android-app://')) {
      setDisplayMode('twa');
    }
  }, []);

  return displayMode;
}

// Utilisation
function App() {
  const displayMode = useDisplayMode();

  useEffect(() => {
    console.log('App lancée en mode:', displayMode);
    // Tu peux envoyer cette info à ton analytics
  }, [displayMode]);

  return <div>{/* Ton app */}</div>;
}
```

---

## 8️⃣ Gérer le Cache Manuellement (Avancé)

### Exemple : Pré-charger des Données Importantes

```tsx
import { useEffect } from 'react';

function usePreloadData() {
  useEffect(() => {
    // Pré-charge des données importantes en arrière-plan
    const preloadData = async () => {
      try {
        // Exemple : pré-charger la liste des courses
        await fetch('/api/courses');
        console.log('✅ Données pré-chargées pour le mode offline');
      } catch (error) {
        console.log('❌ Erreur lors du pré-chargement:', error);
      }
    };

    // Pré-charge après 2 secondes pour ne pas ralentir le chargement initial
    const timer = setTimeout(preloadData, 2000);
    return () => clearTimeout(timer);
  }, []);
}

// Utilisation dans App.tsx
function App() {
  usePreloadData();
  return <div>{/* Ton app */}</div>;
}
```

---

## 9️⃣ Exemple Complet : Layout avec PWA

```tsx
import { PWAStatus } from '@/components/PWAStatus';
import { UpdateNotification } from '@/components/UpdateNotification';
import { ConnectionMonitor } from '@/components/ConnectionMonitor';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notifications PWA */}
      <UpdateNotification />
      <ConnectionMonitor />
      
      {/* Header */}
      <header className="bg-blue-900 text-white p-4">
        <h1>One Connexion Driver</h1>
      </header>
      
      {/* Contenu principal */}
      <main className="container mx-auto p-4">
        {children}
      </main>
      
      {/* Bouton d'installation PWA */}
      <PWAStatus />
    </div>
  );
}
```

---

## 🎯 Recommandations

### Pour une Expérience Optimale

1. **Ajoute `<PWAStatus />`** dans ton layout principal
2. **Ajoute `<ConnectionMonitor />`** pour notifier les changements de connexion
3. **Utilise `usePWA()`** pour adapter l'UI selon le statut (online/offline)
4. **Désactive les actions critiques** en mode offline (création de course, paiement, etc.)
5. **Affiche des messages clairs** quand l'utilisateur est hors ligne

### Pour le Développement

1. **Teste en mode offline** : DevTools → Network → Offline
2. **Vérifie le cache** : DevTools → Application → Cache Storage
3. **Surveille les logs** : Console → Messages du Service Worker
4. **Teste l'installation** : Icône "Installer" dans la barre d'adresse

---

## 📚 Ressources

- Hook `usePWA` : `src/hooks/usePWA.ts`
- Composant `PWAStatus` : `src/components/PWAStatus.tsx`
- Documentation complète : `PWA-SETUP.md`

---

Bon développement ! 🚀
