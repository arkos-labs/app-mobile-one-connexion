# ⚙️ Paramètres - Documentation

## ✅ Page Créée

**Route** : `/settings`

---

## 📱 Aperçu Visuel

```
┌─────────────────────────────────────┐
│  ←    Paramètres                🔔  │
├─────────────────────────────────────┤
│  Paramètres                         │
│  Gérez vos préférences...           │
│                                     │
│  PRÉFÉRENCES                        │
│  ┌─────────────────────────────┐   │
│  │ 🌍 Langue                   │   │
│  │    Français              >  │   │
│  ├─────────────────────────────┤   │
│  │ 🌙 Mode Sombre              │   │
│  │    Toujours activé      ⚪  │   │  ← Switch disabled
│  └─────────────────────────────┘   │
│                                     │
│  INFORMATIONS LÉGALES               │
│  ┌─────────────────────────────┐   │
│  │ 📄 Conditions Générales    >│   │
│  ├─────────────────────────────┤   │
│  │ 🛡️ Politique Confidentialité>│   │
│  └─────────────────────────────┘   │
│                                     │
│  Version 1.0.4 (Build 2024)         │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🚪 Se déconnecter           │   │  ← Bouton rouge
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 🔧 Sections

### 1️⃣ **PRÉFÉRENCES**

#### Langue
```tsx
<div onClick={handleLanguageClick}>
  <Globe className="w-5 h-5 text-slate-400" />
  <div>
    <h3>Langue</h3>
    <p>Français</p>
  </div>
  <ChevronRight />
</div>
```
- **État** : Mocké (toast "Bientôt disponible")
- **Futur** : Sélecteur de langue

#### Mode Sombre
```tsx
<div>
  <Moon className="w-5 h-5 text-slate-400" />
  <div>
    <h3>Mode Sombre</h3>
    <p>Toujours activé</p>
  </div>
  <Switch checked={true} disabled />
</div>
```
- **État** : Verrouillé sur `true`
- **Raison** : App dark mode uniquement

---

### 2️⃣ **INFORMATIONS LÉGALES**

#### CGU
```tsx
<div onClick={handleCGUClick}>
  <FileText className="w-5 h-5 text-slate-400" />
  <h3>Conditions Générales d'Utilisation</h3>
  <ChevronRight />
</div>
```
- **Action** : `window.open('https://oneconnexion.fr/cgu', '_blank')`

#### Politique de Confidentialité
```tsx
<div onClick={handlePrivacyClick}>
  <Shield className="w-5 h-5 text-slate-400" />
  <h3>Politique de Confidentialité</h3>
  <ChevronRight />
</div>
```
- **Action** : `window.open('https://oneconnexion.fr/politique-confidentialite', '_blank')`

#### Version
```tsx
<p className="text-xs text-slate-500">
  Version {APP_VERSION} (Build {BUILD_NUMBER})
</p>
```
- **Constantes** : `APP_VERSION = '1.0.4'`, `BUILD_NUMBER = '2024'`

---

### 3️⃣ **DÉCONNEXION**

#### Bouton
```tsx
<Button
  variant="outline"
  onClick={() => setShowLogoutDialog(true)}
  className="border-red-500 text-red-500 hover:bg-red-500/10"
>
  <LogOut className="w-5 h-5 mr-2" />
  Se déconnecter
</Button>
```

#### Dialog de Confirmation
```tsx
<AlertDialog open={showLogoutDialog}>
  <AlertDialogHeader>
    <AlertDialogTitle>Confirmer la déconnexion</AlertDialogTitle>
    <AlertDialogDescription>
      Voulez-vous vraiment vous déconnecter ?
    </AlertDialogDescription>
  </AlertDialogHeader>
  <AlertDialogFooter>
    <AlertDialogCancel>Annuler</AlertDialogCancel>
    <AlertDialogAction onClick={handleLogout}>
      Se déconnecter
    </AlertDialogAction>
  </AlertDialogFooter>
</AlertDialog>
```

#### Logique de Déconnexion
```tsx
const handleLogout = async () => {
  setShowLogoutDialog(false);

  try {
    // Supabase signOut
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Clear local state
    logout();

    toast({ title: 'Déconnexion réussie', description: 'À bientôt !' });

    // Redirect to login
    setTimeout(() => navigate('/login'), 1000);

  } catch (error) {
    toast({ title: 'Erreur', variant: 'destructive' });
  }
};
```

---

## 🎨 Design System

### Cards
```tsx
<Card className="bg-slate-900 border-slate-800">
  <CardContent className="p-0">
    {/* Items */}
  </CardContent>
</Card>
```

### Item avec Séparateur
```tsx
<div className="p-4 border-b border-slate-800">
  {/* Content */}
</div>
<div className="p-4">
  {/* Last item (no border) */}
</div>
```

### Bouton Déconnexion
```tsx
<Button className="border-red-500 text-red-500 hover:bg-red-500/10">
  <LogOut className="text-red-500" />
  Se déconnecter
</Button>
```

### Dialog
```tsx
<AlertDialogContent className="bg-slate-900 border-slate-800">
  <AlertDialogTitle className="text-white" />
  <AlertDialogDescription className="text-slate-400" />
  <AlertDialogCancel className="bg-slate-800 text-white" />
  <AlertDialogAction className="bg-red-500 text-white" />
</AlertDialogContent>
```

---

## 🧪 Tester

Le serveur est lancé sur **http://localhost:8080**

1. **Profile** → "Paramètres Application"
2. **Page Settings** s'ouvre ✅
3. **Teste Langue** :
   - Clique → Toast "Bientôt disponible" ✅
4. **Teste Mode Sombre** :
   - Switch disabled ✅
5. **Teste CGU** :
   - Clique → Ouvre nouvel onglet ✅
6. **Teste Politique** :
   - Clique → Ouvre nouvel onglet ✅
7. **Teste Déconnexion** :
   - Clique "Se déconnecter" → Dialog ✅
   - Clique "Annuler" → Dialog se ferme ✅
   - Clique "Se déconnecter" → Toast + Redirect ✅

---

## 📊 Flux de Déconnexion

```
Settings
  ↓
[Se déconnecter]
  ↓
AlertDialog
  ├─ "Annuler" → Ferme dialog
  └─ "Se déconnecter"
      ↓
    Supabase.auth.signOut()
      ↓
    logout() (clear state)
      ↓
    Toast "Déconnexion réussie"
      ↓
    navigate('/login')
      ↓
    Login Page
```

---

## ✨ Fonctionnalités

### Liens Externes
- ✅ CGU : `window.open(url, '_blank')`
- ✅ Politique : `window.open(url, '_blank')`

### Switch Disabled
```tsx
<Switch
  checked={darkMode}
  disabled
  className="opacity-50 cursor-not-allowed"
/>
```

### Confirmation Déconnexion
- ✅ AlertDialog
- ✅ Deux boutons (Annuler / Confirmer)
- ✅ Couleurs distinctes

### Toast Feedback
- ✅ "Déconnexion réussie"
- ✅ "Erreur" si problème

---

## 📋 Checklist

- [x] Page Settings créée
- [x] Route /settings ajoutée
- [x] Section Préférences
- [x] Langue (mocké)
- [x] Mode Sombre (locked)
- [x] Section Légale
- [x] CGU (lien externe)
- [x] Politique (lien externe)
- [x] Version affichée
- [x] Bouton Déconnexion
- [x] AlertDialog confirmation
- [x] Supabase signOut
- [x] Redirection login
- [x] Design dark cohérent

---

## 🎯 Résumé

| Section | Éléments |
|---------|----------|
| **Préférences** | Langue (mocké), Mode Sombre (locked) |
| **Légal** | CGU, Politique, Version |
| **Déconnexion** | Bouton rouge + Confirmation |

---

**Page Paramètres terminée ! ⚙️✨**
