# 🔧 Guide d'Intégration Supabase - Edit Profile

## ✅ Fonctionnalités Implémentées

La page **Edit Profile** est maintenant complète avec :

- ✅ **react-hook-form** pour la gestion du formulaire
- ✅ **Upload d'avatar** avec prévisualisation
- ✅ **Validation des champs** (prénom, nom, téléphone)
- ✅ **Email en lecture seule** (sécurité)
- ✅ **Spinner de chargement** pendant la sauvegarde
- ✅ **Design system dark** avec accents jaunes

---

## 🎨 Design Appliqué

### Couleurs
- **Fond** : `bg-slate-950` (#020617)
- **Inputs** : `bg-slate-900` (#0f172a)
- **Focus** : `border-yellow-400` (#facc15)
- **Bouton Enregistrer** : `bg-[#FCD34D]` avec `text-slate-950`

### Structure
```
┌─────────────────────────────────────┐
│  ← Modifier le profil               │
├─────────────────────────────────────┤
│         🟡 Avatar + 📷              │
│                                     │
│  Prénom                             │
│  ┌─────────────────────────────┐   │
│  │ Jean                         │   │
│  └─────────────────────────────┘   │
│                                     │
│  Nom                                │
│  ┌─────────────────────────────┐   │
│  │ Dupont                       │   │
│  └─────────────────────────────┘   │
│                                     │
│  Téléphone                          │
│  ┌─────────────────────────────┐   │
│  │ +33 6 12 34 56 78            │   │
│  └─────────────────────────────┘   │
│                                     │
│  Email (Lecture seule)              │
│  ┌─────────────────────────────┐   │
│  │ email@example.com            │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│  [Annuler]      [🟡 Enregistrer]    │
└─────────────────────────────────────┘
```

---

## 📦 Intégration Supabase (À Faire)

### 1️⃣ Installation

```bash
npm install @supabase/supabase-js
```

### 2️⃣ Configuration

Crée `src/lib/supabase.ts` :

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Ajoute dans `.env` :

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3️⃣ Structure de la Table `drivers`

```sql
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  vehicle_type TEXT,
  vehicle_plate TEXT,
  status TEXT DEFAULT 'offline'
);
```

### 4️⃣ Bucket Storage pour les Avatars

Dans Supabase Dashboard :
1. Va dans **Storage**
2. Crée un bucket `avatars`
3. Configure les permissions :

```sql
-- Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access
CREATE POLICY "Public avatar access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

---

## 🔧 Code à Remplacer dans EditProfile.tsx

### Upload Avatar (Ligne ~70)

**Remplace :**
```typescript
const uploadAvatar = async (file: File): Promise<string> => {
  // Simulate upload to Supabase Storage
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(previewUrl || '');
    }, 1000);
  });
};
```

**Par :**
```typescript
const uploadAvatar = async (file: File): Promise<string> => {
  if (!driver?.id) throw new Error('No driver ID');

  const fileExt = file.name.split('.').pop();
  const fileName = `${driver.id}/${Date.now()}.${fileExt}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  return publicUrl;
};
```

### Sauvegarde du Profil (Ligne ~90)

**Remplace :**
```typescript
// Simulate Supabase update
// In real app:
// const { error } = await supabase
//   .from('drivers')
//   .update({...})
//   .eq('id', driver?.id);
```

**Par :**
```typescript
// Update driver in Supabase
const { error } = await supabase
  .from('drivers')
  .update({
    first_name: data.firstName,
    last_name: data.lastName,
    phone: data.phone,
    avatar_url: newAvatarUrl,
    updated_at: new Date().toISOString(),
  })
  .eq('id', driver?.id);

if (error) throw error;
```

---

## 📱 Fonctionnalités Actuelles

### ✅ Upload d'Avatar
- Sélection de fichier via input file
- Validation du type (images uniquement)
- Validation de la taille (max 5MB)
- Prévisualisation instantanée
- Cleanup de l'URL de prévisualisation

### ✅ Validation du Formulaire
- **Prénom** : Requis, min 2 caractères
- **Nom** : Requis, min 2 caractères
- **Téléphone** : Requis, format français (+33 ou 0)
- **Email** : Lecture seule (non modifiable)

### ✅ UX
- Spinner pendant le chargement
- Toast de confirmation
- Désactivation des champs pendant la sauvegarde
- Redirection automatique vers le profil

---

## 🧪 Tester

1. **Va sur Profile** : http://localhost:8080/profile
2. **Clique sur "Modifier mon profil"**
3. **Change l'avatar** : Clique sur l'icône caméra
4. **Modifie les champs** : Prénom, Nom, Téléphone
5. **Clique sur "Enregistrer"**
6. **Vérifie** : Tu es redirigé vers le profil avec les nouvelles données

---

## 🔐 Sécurité

### Email en Lecture Seule
L'email ne peut pas être modifié pour éviter :
- Les problèmes d'authentification
- Les conflits de données
- Les erreurs de sécurité

### Validation Côté Client
- Formats de téléphone français
- Taille d'image limitée
- Types de fichiers restreints

### À Ajouter (Supabase)
- Row Level Security (RLS)
- Validation côté serveur
- Rate limiting sur l'upload

---

## 📊 État de l'Implémentation

| Fonctionnalité | Statut | Notes |
|----------------|--------|-------|
| **UI/UX** | ✅ Terminé | Design dark avec accents jaunes |
| **Formulaire** | ✅ Terminé | react-hook-form + validation |
| **Upload Avatar** | ✅ Terminé | Prévisualisation + validation |
| **Supabase Storage** | ⚠️ À faire | Code préparé, à activer |
| **Supabase Database** | ⚠️ À faire | Code préparé, à activer |
| **RLS Policies** | ⚠️ À faire | Sécurité à configurer |

---

## 🚀 Prochaines Étapes

1. **Configure Supabase** :
   - Crée un projet Supabase
   - Configure la table `drivers`
   - Crée le bucket `avatars`

2. **Ajoute les Variables d'Environnement** :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

3. **Remplace le Code Simulé** :
   - Upload d'avatar
   - Update de la base de données

4. **Teste en Production** :
   - Upload d'images réelles
   - Mise à jour des données

---

## 💡 Améliorations Futures

- [ ] Compression d'images avant upload
- [ ] Crop d'avatar (format carré)
- [ ] Historique des modifications
- [ ] Validation du numéro de téléphone via API
- [ ] Support de plusieurs formats d'image (WebP, AVIF)

---

**Page Edit Profile prête pour l'intégration Supabase ! 🚀**
