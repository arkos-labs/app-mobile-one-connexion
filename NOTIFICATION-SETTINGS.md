# 🔔 Réglages des Notifications - Documentation

## ✅ Écran Créé

La page **Notification Settings** est maintenant disponible ! 🎉

---

## 🎨 Design System Appliqué

### Couleurs
- **Fond** : `bg-slate-950` (#020617)
- **Cartes** : `bg-slate-900` (#0f172a)
- **Bordures** : `border-slate-800` (#1e293b)
- **Titres de section** : `text-slate-400` (gris clair)
- **Texte principal** : `text-white`
- **Descriptions** : `text-slate-400`
- **Switch ON** : `bg-yellow-400` (#facc15)
- **Switch OFF** : Gris sombre par défaut

---

## 📱 Structure de l'Écran

```
┌─────────────────────────────────────┐
│  ← Préférences Notifications        │
├─────────────────────────────────────┤
│                                     │
│  🔔 COURSES                         │
│  ┌─────────────────────────────┐   │
│  │ Nouvelle proposition        🟡│  │
│  │ Soyez alerté dès qu'une...  │  │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ Annulation / Modification   🟡│  │
│  │ Si le client change...      │  │
│  └─────────────────────────────┘   │
│                                     │
│  💬 MESSAGES                        │
│  ┌─────────────────────────────┐   │
│  │ Messages Clients            🟡│  │
│  │ Chat en direct...           │  │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ Support One Connexion       🟡│  │
│  │ Messages importants...      │  │
│  └─────────────────────────────┘   │
│                                     │
│  💰 ADMINISTRATIF                   │
│  ┌─────────────────────────────┐   │
│  │ Paiements Reçus             🟡│  │
│  │ Notif quand un virement...  │  │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ Alertes Documents           🟡│  │
│  │ Rappels avant expiration... │  │
│  └─────────────────────────────┘   │
│                                     │
│  💡 Les notifications de nouvelles │
│     courses sont recommandées...   │
└─────────────────────────────────────┘
```

---

## 🔧 Fonctionnalités

### 3 Sections Organisées

#### 1️⃣ **COURSES** (Critique)
- ✅ **Nouvelle proposition de course**
  - Description : Soyez alerté dès qu'une course est disponible autour de vous
  - Par défaut : **ON** (critique pour le business)
  
- ✅ **Annulation / Modification**
  - Description : Si le client change l'adresse ou annule
  - Par défaut : **ON**

#### 2️⃣ **MESSAGES**
- ✅ **Messages Clients**
  - Description : Chat en direct pendant une livraison
  - Par défaut : **ON**
  
- ✅ **Support One Connexion**
  - Description : Messages importants de l'administration
  - Par défaut : **ON**

#### 3️⃣ **ADMINISTRATIF**
- ✅ **Paiements Reçus**
  - Description : Notif quand un virement arrive sur votre compte
  - Par défaut : **ON**
  
- ✅ **Alertes Documents**
  - Description : Rappels avant expiration du permis ou assurance
  - Par défaut : **ON**

---

## ⚙️ Logique Technique

### État Local
```tsx
const [settings, setSettings] = useState<NotificationSettings>({
  // Courses
  newOrder: true,
  orderCancellation: true,
  
  // Messages
  clientMessages: true,
  supportMessages: true,
  
  // Administratif
  payments: true,
  documentAlerts: true,
});
```

### Toggle Switch
```tsx
const toggleSwitch = (key: keyof NotificationSettings) => {
  setSettings(prev => {
    const newSettings = { ...prev, [key]: !prev[key] };
    
    // Simulate saving to backend
    // In production: await supabase.from('driver_settings').update(...)
    
    toast({
      title: 'Préférences mises à jour',
      description: `Notifications ${newSettings[key] ? 'activées' : 'désactivées'}`,
    });
    
    return newSettings;
  });
};
```

---

## 🔗 Navigation

### Depuis Profile
```tsx
// Dans Profile.tsx
if (action === 'notifications') {
  navigate('/notifications/settings');
  return;
}
```

### Route
```tsx
// Dans App.tsx
<Route path="/notifications/settings" element={
  <ProtectedRoute>
    <NotificationSettings />
  </ProtectedRoute>
} />
```

---

## 🎯 UX/UI

### Switches Jaunes
- **ON** : `bg-yellow-400` (jaune vif)
- **OFF** : Gris sombre par défaut
- Animation fluide au toggle

### Toast de Confirmation
Chaque changement affiche un toast :
- "Préférences mises à jour"
- "Notifications activées" ou "Notifications désactivées"

### Info Footer
Message informatif en bas :
> 💡 Les notifications de nouvelles courses sont fortement recommandées pour ne manquer aucune opportunité.

---

## 📊 Intégration Supabase (À Faire)

### Table `driver_settings`

```sql
CREATE TABLE driver_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  
  -- Courses
  new_order_notif BOOLEAN DEFAULT true,
  order_cancellation_notif BOOLEAN DEFAULT true,
  
  -- Messages
  client_messages_notif BOOLEAN DEFAULT true,
  support_messages_notif BOOLEAN DEFAULT true,
  
  -- Administratif
  payments_notif BOOLEAN DEFAULT true,
  document_alerts_notif BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(driver_id)
);
```

### Code de Sauvegarde

**Remplacer dans `toggleSwitch()` :**

```tsx
// Simulate saving to backend
// In production:
const { error } = await supabase
  .from('driver_settings')
  .upsert({
    driver_id: driver?.id,
    new_order_notif: newSettings.newOrder,
    order_cancellation_notif: newSettings.orderCancellation,
    client_messages_notif: newSettings.clientMessages,
    support_messages_notif: newSettings.supportMessages,
    payments_notif: newSettings.payments,
    document_alerts_notif: newSettings.documentAlerts,
    updated_at: new Date().toISOString(),
  }, {
    onConflict: 'driver_id'
  });

if (error) {
  console.error('Error saving settings:', error);
  toast({
    title: 'Erreur',
    description: 'Impossible de sauvegarder les préférences',
    variant: 'destructive',
  });
  return prev; // Revert changes
}
```

### Chargement Initial

**Ajouter dans `useEffect()` :**

```tsx
useEffect(() => {
  const loadSettings = async () => {
    const { data, error } = await supabase
      .from('driver_settings')
      .select('*')
      .eq('driver_id', driver?.id)
      .single();

    if (data) {
      setSettings({
        newOrder: data.new_order_notif,
        orderCancellation: data.order_cancellation_notif,
        clientMessages: data.client_messages_notif,
        supportMessages: data.support_messages_notif,
        payments: data.payments_notif,
        documentAlerts: data.document_alerts_notif,
      });
    }
  };

  if (driver?.id) {
    loadSettings();
  }
}, [driver?.id]);
```

---

## 🧪 Tester

Le serveur est lancé sur **http://localhost:8080**

1. **Connecte-toi** (auto-login ✅)
2. **Va sur Profile**
3. **Clique sur "Notifications"**
4. **Teste les switches** :
   - Clique pour activer/désactiver
   - Vérifie le toast de confirmation
   - Vérifie le changement de couleur (jaune/gris)

---

## ✨ Points Forts

- ✅ **Design cohérent** avec le reste de l'app
- ✅ **3 sections claires** (Courses, Messages, Administratif)
- ✅ **Switches jaunes** pour la marque
- ✅ **Toast de confirmation** à chaque changement
- ✅ **Descriptions claires** pour chaque option
- ✅ **Icônes** pour identifier les sections
- ✅ **Info footer** pour guider l'utilisateur
- ✅ **Prêt pour Supabase** (code préparé)

---

## 📋 Checklist

- [x] Page créée (`NotificationSettings.tsx`)
- [x] Route ajoutée (`/notifications/settings`)
- [x] Navigation depuis Profile
- [x] Design dark appliqué
- [x] Switches fonctionnels
- [x] Toast de confirmation
- [x] 6 options de notifications
- [x] 3 sections organisées
- [ ] Intégration Supabase (à faire)
- [ ] Notifications push natives (à faire)

---

**Page de réglages des notifications terminée ! 🔔✨**
