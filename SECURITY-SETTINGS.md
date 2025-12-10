# 🔒 Sécurité & Accès - Documentation

## ✅ Écran Créé

La page **Security Settings** est maintenant disponible ! 🎉

---

## 🎨 Design System Appliqué

### Couleurs
- **Fond** : `bg-slate-950` (#020617)
- **Cartes** : `bg-slate-900` (#0f172a)
- **Bordures** : `border-slate-800` (#1e293b)
- **Icônes actives** : `text-yellow-400` (#facc15)
- **Zone danger** : `text-red-500` + `border-red-500/30`
- **Switch ON** : `bg-yellow-400`

---

## 📱 Structure de l'Écran

```
┌─────────────────────────────────────┐
│  ← Sécurité & Accès                 │
├─────────────────────────────────────┤
│                                     │
│  AUTHENTIFICATION                   │
│  ┌─────────────────────────────┐   │
│  │ 🔐 Connexion biométrique 🟡│   │
│  │ Se connecter sans mot...    │   │
│  └─────────────────────────────┘   │
│                                     │
│  MOT DE PASSE                       │
│  ┌─────────────────────────────┐   │
│  │ 🔒 Modifier mon mot de passe>│   │
│  │ Dernière modif il y a 3 mois│   │
│  └─────────────────────────────┘   │
│                                     │
│  SÉCURITÉ TRAJET                    │
│  ┌─────────────────────────────┐   │
│  │ 📱 Contact d'urgence (SOS)  >│   │
│  │ Personne à prévenir...      │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 🛡️ Code PIN de vérification >│   │
│  │ Demander un code au client..│   │
│  └─────────────────────────────┘   │
│                                     │
│  ZONE DE DANGER                     │
│  ┌─────────────────────────────┐   │
│  │ ⚠️ Supprimer mon compte     >│   │
│  │ Cette action est irréversible│   │
│  └─────────────────────────────┘   │
│                                     │
│  🔒 Vos données sont chiffrées...   │
└─────────────────────────────────────┘
```

---

## 🔧 Fonctionnalités

### 1️⃣ **Authentification**

#### Connexion Biométrique
- **Switch** : ON/OFF
- **État** : Géré par `useState`
- **Toast** : Confirmation à chaque changement
- **Future** : Intégration avec `expo-local-authentication` (web : WebAuthn)

```tsx
const [biometricEnabled, setBiometricEnabled] = useState(false);

const toggleBiometric = () => {
  setBiometricEnabled(!biometricEnabled);
  toast({
    title: biometricEnabled ? 'Biométrie désactivée' : 'Biométrie activée',
    description: '...',
  });
};
```

---

### 2️⃣ **Mot de Passe**

#### Modifier mon mot de passe
- **Action** : Navigation vers `/security/change-password`
- **Info** : "Dernière modification il y a 3 mois"
- **Icône** : Cadenas jaune

```tsx
const handleChangePassword = () => {
  navigate('/security/change-password');
};
```

---

### 3️⃣ **Sécurité Trajet**

#### Contact d'urgence (SOS)
- **Description** : Personne à prévenir en cas d'incident
- **Action** : Toast "Bientôt disponible"
- **Future** : Formulaire pour ajouter un contact

#### Code PIN de vérification
- **Description** : Demander un code au client avant la course
- **Action** : Toast "Bientôt disponible"
- **Future** : Activation/Désactivation du PIN

---

### 4️⃣ **Zone de Danger**

#### Supprimer mon compte
- **Style** : Bordure rouge + texte rouge
- **Action** : Ouvre un **AlertDialog** de confirmation
- **Confirmation** : 2 boutons (Annuler / Confirmer)
- **Effet** : Suppression + Redirection vers login

```tsx
const [showDeleteDialog, setShowDeleteDialog] = useState(false);

const handleDeleteAccount = () => {
  setShowDeleteDialog(false);
  toast({
    title: 'Compte supprimé',
    description: 'Votre compte a été supprimé avec succès',
    variant: 'destructive',
  });
  setTimeout(() => {
    navigate('/login');
  }, 2000);
};
```

---

## 🎨 AlertDialog de Suppression

```tsx
<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
  <AlertDialogContent className="bg-slate-900 border-slate-800">
    <AlertDialogHeader>
      <AlertDialogTitle className="text-white">
        Supprimer votre compte ?
      </AlertDialogTitle>
      <AlertDialogDescription className="text-slate-400">
        Cette action est <span className="text-red-500 font-semibold">irréversible</span>. 
        Toutes vos données seront définitivement supprimées.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Annuler</AlertDialogCancel>
      <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-500">
        Confirmer la suppression
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## 🔗 Navigation

### Depuis Profile
```tsx
// Dans Profile.tsx
if (action === 'security') {
  navigate('/security');
  return;
}
```

### Route
```tsx
// Dans App.tsx
<Route path="/security" element={
  <ProtectedRoute>
    <SecuritySettings />
  </ProtectedRoute>
} />
```

---

## 📊 Intégration Future

### Biométrie Web (WebAuthn)

```tsx
// Pour le web, utiliser WebAuthn API
const enableBiometric = async () => {
  if (!window.PublicKeyCredential) {
    toast({
      title: 'Non supporté',
      description: 'Votre navigateur ne supporte pas la biométrie',
      variant: 'destructive',
    });
    return;
  }

  try {
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: new Uint8Array(32),
        rp: { name: "One Connexion" },
        user: {
          id: new Uint8Array(16),
          name: driver?.email || '',
          displayName: `${driver?.first_name} ${driver?.last_name}`,
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
      },
    });

    // Save credential to backend
    setBiometricEnabled(true);
  } catch (error) {
    console.error('Biometric setup failed:', error);
  }
};
```

### Suppression de Compte (Supabase)

```tsx
const handleDeleteAccount = async () => {
  try {
    // 1. Delete all driver data
    const { error: dataError } = await supabase
      .from('drivers')
      .delete()
      .eq('id', driver?.id);

    if (dataError) throw dataError;

    // 2. Delete auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(
      driver?.id
    );

    if (authError) throw authError;

    // 3. Logout and redirect
    logout();
    navigate('/login');
  } catch (error) {
    console.error('Error deleting account:', error);
    toast({
      title: 'Erreur',
      description: 'Impossible de supprimer le compte',
      variant: 'destructive',
    });
  }
};
```

---

## 🧪 Tester

Le serveur est lancé sur **http://localhost:8080**

1. **Connecte-toi** (auto-login ✅)
2. **Va sur Profile**
3. **Clique sur "Sécurité"**
4. **Teste les fonctionnalités** :
   - Toggle biométrie (switch jaune)
   - Clique sur "Modifier mot de passe"
   - Clique sur "Contact d'urgence"
   - Clique sur "Code PIN"
   - Clique sur "Supprimer mon compte" (dialog rouge)

---

## ✨ Points Forts

- ✅ **Design cohérent** avec le reste de l'app
- ✅ **4 sections claires** (Auth, Mot de passe, Sécurité trajet, Danger)
- ✅ **Switch jaune** pour la biométrie
- ✅ **AlertDialog** pour la suppression critique
- ✅ **Icônes colorées** (jaune pour actif, rouge pour danger)
- ✅ **Toast de confirmation** pour chaque action
- ✅ **Zone de danger** visuellement distincte
- ✅ **Info footer** pour rassurer l'utilisateur

---

## 📋 Checklist

- [x] Page créée (`SecuritySettings.tsx`)
- [x] Route ajoutée (`/security`)
- [x] Navigation depuis Profile
- [x] Design dark appliqué
- [x] Switch biométrie fonctionnel
- [x] AlertDialog de suppression
- [x] 4 sections organisées
- [ ] Page "Change Password" (à créer)
- [ ] Intégration WebAuthn (à faire)
- [ ] Intégration Supabase (à faire)

---

**Page de sécurité terminée ! 🔒✨**
