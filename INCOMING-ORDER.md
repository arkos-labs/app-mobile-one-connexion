# 🚨 Commande en Temps Réel - Documentation

## ✅ Fonctionnalité Créée

**Composant** : `IncomingOrderModal` (Global)
**Contexte** : `OrderContext`

---

## 📱 Aperçu Visuel

```
┌─────────────────────────────────────┐
│  [Contenu de l'App en arrière-plan] │
│  (Profil, Garage, Support...)       │
│                                     │
│  ┌───────────────────────────────┐  │
│  │       Gain estimé             │  │
│  │         45.50€                │  │  ← Très gros, Jaune
│  │                               │  │
│  │  🟢 Départ                    │  │
│  │     Gare de Lyon, Paris       │  │
│  │                               │  │
│  │     [ 45 min • 32.5 km ]      │  │
│  │                               │  │
│  │  🔴 Arrivée                   │  │
│  │     Aéroport CDG - T2E        │  │
│  │                               │  │
│  │  ⚠️ Acceptez vite !   24s     │  │
│  │  [====================----]   │  │  ← Progress Bar (Verte -> Rouge)
│  │                               │  │
│  │  [Refuser]    [ACCEPTER]      │  │
│  │               (Pulsation)     │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## 🔧 Architecture

### 1️⃣ **OrderContext (Cerveau)**
Gère l'état global de la commande entrante.

- **State** :
  - `incomingOrder`: Objet commande (ou null)
  - `timeLeft`: Compteur (30s)
- **Logique** :
  - Timer automatique dès qu'une commande arrive.
  - Auto-rejet à 0s.
  - `simulateNewOrder()` : Pour tester (dev).

### 2️⃣ **IncomingOrderModal (Visuel)**
Composant "Bottom Sheet" qui s'affiche par-dessus tout.

- **Position** : `fixed inset-0 z-50`
- **Animation** : `slide-in-from-bottom`
- **Design** :
  - Bordure haute jaune (`border-t-4 border-yellow-400`)
  - Fond sombre (`bg-slate-900`)
  - Bouton Accepter géant et animé

### 3️⃣ **Intégration Racine**
Dans `App.tsx`, le `OrderProvider` enveloppe toute l'application, permettant à la modale d'apparaître sur n'importe quel écran.

```tsx
<BrowserRouter>
  <OrderProvider>
    <IncomingOrderModal /> {/* Toujours présent, visible si order != null */}
    <Routes>
      {/* ... */}
    </Routes>
  </OrderProvider>
</BrowserRouter>
```

---

## 🧪 Comment Tester

Le serveur est lancé sur **http://localhost:8080**

1. **Ouvrir la Console DevTools** (F12).
2. **Simuler une commande** :
   Pour l'instant, la simulation est déclenchée via le code ou peut être ajoutée à un bouton temporaire.
   
   *Astuce Dev* : Vous pouvez ajouter un bouton temporaire dans `src/pages/Index.tsx` (Dashboard) :
   ```tsx
   const { simulateNewOrder } = useOrder();
   // ...
   <Button onClick={simulateNewOrder}>Simuler Commande</Button>
   ```

3. **Scénario 1 : Accepter**
   - La modale apparaît.
   - Le compteur descend.
   - Cliquez sur **ACCEPTER**.
   - Toast "Course acceptée" + Redirection (future).

4. **Scénario 2 : Refuser**
   - La modale apparaît.
   - Cliquez sur **Refuser** (ou cliquez sur l'overlay sombre).
   - La modale disparaît.

5. **Scénario 3 : Timeout**
   - La modale apparaît.
   - Attendez 30 secondes.
   - La modale disparaît automatiquement + Toast "Temps écoulé".

---

## 🎨 Design System

### Prix
```tsx
className="text-6xl font-extrabold text-[#FCD34D]"
```

### Progress Bar
- **> 10s** : Verte (`bg-green-500`)
- **< 10s** : Rouge (`bg-red-500`) + Texte clignotant (`animate-pulse`)

### Bouton Accepter
```tsx
className="bg-[#FCD34D] text-black h-16 text-xl font-black animate-pulse shadow-[0_0_20px_rgba(252,211,77,0.3)]"
```

---

## 📋 Checklist

- [x] Contexte `OrderContext` créé
- [x] Timer 30s implémenté
- [x] Auto-rejet implémenté
- [x] Composant `IncomingOrderModal` créé
- [x] Design Bottom Sheet
- [x] Animation Slide Up
- [x] Intégration dans `App.tsx`
- [x] Simulation prête

---

**Système de Commande en Temps Réel prêt ! 🚨**
