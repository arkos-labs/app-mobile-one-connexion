# 🆘 Onglet Aide & Support - Documentation

## ✅ Modifications Effectuées

L'onglet **"Véhicules"** a été remplacé par **"Aide"** dans le BottomNav ! 🎉

---

## 🎨 Nouveau BottomNav

### Avant
```
🏠 Accueil  |  📦 Courses  |  🚗 Véhicules  |  👤 Profil
```

### Après
```
🏠 Accueil  |  📦 Courses  |  🆘 Aide  |  👤 Profil
```

---

## 📱 Structure

### BottomNav Mis à Jour
```tsx
const navItems = [
  { to: '/', icon: Home, label: 'Accueil' },
  { to: '/orders', icon: Package, label: 'Courses' },
  { to: '/support', icon: LifeBuoy, label: 'Aide' },      // ← Nouveau !
  { to: '/profile', icon: User, label: 'Profil' },
];
```

---

## 🆘 Page Support (`/support`)

### Sections

#### 1️⃣ **Bouton d'Urgence**
Gros bouton jaune pour appeler le support :
```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │  📞 Appeler le Support      │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│  📞 Disponible 24h/24, 7j/7         │
└─────────────────────────────────────┘
```

#### 2️⃣ **Actions Rapides**
```
┌─────────────────┬─────────────────┐
│  💬 Message     │  📧 Email       │
└─────────────────┴─────────────────┘
```

#### 3️⃣ **FAQ (Questions Fréquentes)**
- 📦 Problème avec une course
- 💰 Paiement non reçu
- 🚗 Mon véhicule
- 👤 Mon compte
- 📄 Documents

#### 4️⃣ **Informations de Contact**
- **Téléphone** : +33 1 23 45 67 89
- **Email** : support@oneconnexion.fr
- **Horaires** : 24h/24, 7j/7

---

## 🎨 Design Appliqué

### Bouton d'Urgence
```tsx
<Card className="bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border-yellow-400/30">
  <Button className="w-full h-16 bg-yellow-400 hover:bg-yellow-500 text-slate-950">
    <Phone className="w-6 h-6 mr-3" />
    Appeler le Support
  </Button>
</Card>
```

### Items FAQ
```tsx
<Card className="bg-slate-900 border-slate-800 hover:bg-slate-800">
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl bg-yellow-400/10">
      <Icon className="w-6 h-6 text-yellow-400" />
    </div>
    <div>
      <h3 className="text-white">Titre</h3>
      <p className="text-slate-400">Description</p>
    </div>
    <ChevronRight className="text-slate-400" />
  </div>
</Card>
```

---

## 📊 Aperçu Complet

```
┌─────────────────────────────────────┐
│  👤 Jean Dupont    One Connexion 🔔│
├─────────────────────────────────────┤
│  🆘 Aide & Support                  │
│  Nous sommes là pour vous aider     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  📞 Appeler le Support      │   │
│  │  📞 Disponible 24h/24       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌──────────┬──────────┐           │
│  │ 💬 Message│ 📧 Email │           │
│  └──────────┴──────────┘           │
│                                     │
│  ❓ QUESTIONS FRÉQUENTES            │
│  ┌─────────────────────────────┐   │
│  │ 📦 Problème avec course    >│   │
│  │ 💰 Paiement non reçu       >│   │
│  │ 🚗 Mon véhicule            >│   │
│  │ 👤 Mon compte              >│   │
│  │ 📄 Documents               >│   │
│  └─────────────────────────────┘   │
│                                     │
│  📞 Informations de Contact         │
│  Téléphone: +33 1 23 45 67 89       │
│  Email: support@oneconnexion.fr     │
│  Horaires: 24h/24, 7j/7             │
│                                     │
│  💡 Temps de réponse: < 5 min       │
│                                     │
├─────────────────────────────────────┤
│  🏠  📦  🟡🆘  👤                   │
└─────────────────────────────────────┘
```

---

## 🔧 Fonctionnalités

### Bouton d'Appel
```tsx
const handleEmergencyCall = () => {
  setCalling(true);
  
  toast({
    title: 'Appel en cours...',
    description: 'Connexion au support One Connexion',
  });

  // In production:
  window.location.href = 'tel:+33123456789';
  
  setTimeout(() => setCalling(false), 2000);
};
```

### Envoyer un Email
```tsx
<Button onClick={() => window.location.href = 'mailto:support@oneconnexion.fr'}>
  <Mail className="w-8 h-8" />
  Email
</Button>
```

### FAQ Cliquable
```tsx
const handleFaqClick = (faqId: string) => {
  // Navigate to FAQ article
  // navigate(`/support/faq/${faqId}`);
  
  toast({
    title: 'Bientôt disponible',
    description: 'Les articles d\'aide arrivent prochainement',
  });
};
```

---

## 🧪 Tester

Le serveur est lancé sur **http://localhost:8080**

1. **Rafraîchis la page** (Ctrl+R)
2. **Regarde le BottomNav** → Icône 🆘 Aide au lieu de 🚗 Véhicules ✅
3. **Clique sur "Aide"** → Page Support s'affiche ✅
4. **Teste le bouton "Appeler"** → Toast de confirmation ✅
5. **Clique sur "Message"** → Toast "Bientôt disponible" ✅
6. **Clique sur "Email"** → Ouvre le client email ✅
7. **Clique sur une FAQ** → Toast "Bientôt disponible" ✅

---

## ✨ Avantages

### Meilleure Accessibilité
- ✅ **Support toujours accessible** depuis le footer
- ✅ **Appel d'urgence** en un clic
- ✅ **Plusieurs canaux** (téléphone, message, email)

### Expérience Utilisateur
- ✅ **Rassurant** : support visible 24/7
- ✅ **Rapide** : accès direct aux FAQ
- ✅ **Clair** : informations de contact visibles

---

## 📋 Checklist

- [x] BottomNav mis à jour (Véhicules → Aide)
- [x] Icône LifeBuoy (bouée de sauvetage)
- [x] Page Support créée
- [x] Route /support ajoutée
- [x] Header mis à jour
- [x] Bouton d'appel d'urgence
- [x] Actions rapides (Message, Email)
- [x] FAQ avec 5 catégories
- [x] Informations de contact
- [x] Design dark cohérent

---

## 🔄 Accès aux Véhicules

L'onglet Véhicules n'est plus dans le footer, mais reste accessible via :
- **Profile** → Menu "Véhicules"
- **URL directe** : `/vehicles`

---

## 📊 Résumé

| Avant | Après |
|-------|-------|
| 🏠 Accueil | 🏠 Accueil |
| 📦 Courses | 📦 Courses |
| 🚗 **Véhicules** | 🆘 **Aide** ← Nouveau ! |
| 👤 Profil | 👤 Profil |

---

**Onglet Aide & Support ajouté ! 🆘🎉**
