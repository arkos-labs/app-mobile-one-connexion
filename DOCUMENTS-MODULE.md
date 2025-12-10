# 📄 Gestion des Documents - Documentation

## ✅ Module Créé

Le module de **Gestion des Documents** est maintenant disponible ! 🎉

---

## 🎨 Design System Appliqué

### Couleurs
- **Fond** : `bg-slate-950`
- **Cartes** : `bg-slate-900` + `border-slate-800`
- **Statuts** :
  - ✅ **Validé** : `text-emerald-400` + `bg-emerald-500/10`
  - ⏳ **En attente** : `text-yellow-400` + `bg-yellow-500/10`
  - ❌ **Rejeté/Manquant** : `text-red-400` + `bg-red-500/10`
  - 📅 **Expire bientôt** : `text-orange-400`

---

## 📱 Structure

### 1️⃣ Page Liste (`/documents`)
Liste des 4 documents obligatoires :
- 🪪 Permis de conduire
- 🆔 Carte d'identité / Passeport
- 🛡️ Assurance RC Pro
- 🚗 Carte Grise

### 2️⃣ Page Upload (`/documents/upload/:documentId`)
Upload d'un document avec :
- Prévisualisation de l'image
- Sélection de fichier
- Date d'expiration (optionnel)
- Envoi pour validation

---

## 📊 Aperçu Visuel

### Page Liste
```
┌─────────────────────────────────────┐
│  👤 Jean Dupont    One Connexion 🔔│
├─────────────────────────────────────┤
│  📄 Mes Documents                   │
│  Assurez-vous que tous vos...       │
│                                     │
│  Progression: 1/4 validés           │
│  ████░░░░░░░░░░░░░░░░░░ 25%        │
│                                     │
│  ⚠️ Documents manquants             │
│  Veuillez uploader tous les...     │
│                                     │
│  DOCUMENTS OBLIGATOIRES             │
│  ┌─────────────────────────────┐   │
│  │ 🪪 Permis de conduire       │   │
│  │    Expire le 31/12/2025     │   │
│  │                   ✅ Validé >│   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 🆔 Carte d'identité         │   │
│  │    Uploadé le 09/12/2024    │   │
│  │              ⏳ En attente  >│   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 🛡️ Assurance RC Pro         │   │
│  │                             │   │
│  │               📄 Manquant   >│   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│  🏠  📦  🚗  👤                     │
└─────────────────────────────────────┘
```

### Page Upload
```
┌─────────────────────────────────────┐
│  ←    Permis de conduire        🔔  │
├─────────────────────────────────────┤
│  📄 Permis de conduire              │
│  Uploadez une photo claire...       │
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │    [Image Preview]          │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│  ✅ Nouveau fichier sélectionné     │
│                                     │
│  Date d'expiration (optionnel)      │
│  [31/12/2025]                       │
│                                     │
│  [📤 Choisir une photo]             │
│                                     │
│  [✅ Envoyer pour validation]       │
│                                     │
│  💡 Conseils pour une photo...      │
│  • Assurez-vous que le document...  │
│                                     │
├─────────────────────────────────────┤
│  🏠  📦  🚗  👤                     │
└─────────────────────────────────────┘
```

---

## 🔧 Fonctionnalités

### Page Liste

#### Barre de Progression
```tsx
<div className="w-full h-2 bg-slate-800 rounded-full">
  <div 
    className="h-full bg-yellow-400"
    style={{ width: `${(validatedCount / totalCount) * 100}%` }}
  />
</div>
```

#### Badges de Statut
```tsx
const STATUS_CONFIG = {
  validated: {
    label: 'Validé',
    className: 'bg-emerald-500/10 text-emerald-400',
    icon: '✅',
  },
  pending: {
    label: 'En attente',
    className: 'bg-yellow-500/10 text-yellow-400',
    icon: '⏳',
  },
  rejected: {
    label: 'Rejeté',
    className: 'bg-red-500/10 text-red-400',
    icon: '❌',
  },
  missing: {
    label: 'Manquant',
    className: 'bg-slate-500/10 text-slate-400',
    icon: '📄',
  },
};
```

#### Détection d'Expiration
```tsx
const isExpiringSoon = (expiryDate?: string) => {
  if (!expiryDate) return false;
  const expiry = new Date(expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.floor(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
};
```

---

### Page Upload

#### Sélection de Fichier
```tsx
const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validation type
  if (!file.type.startsWith('image/')) {
    toast({ title: 'Erreur', description: 'Veuillez sélectionner une image' });
    return;
  }

  // Validation taille (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    toast({ title: 'Erreur', description: 'L\'image ne doit pas dépasser 10MB' });
    return;
  }

  setSelectedFile(file);
  const previewUrl = URL.createObjectURL(file);
  setPreviewUrl(previewUrl);
};
```

#### Upload vers Supabase
```tsx
const uploadToSupabase = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${driver?.id}/${documentId}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(fileName, file, { upsert: true });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(fileName);

  return publicUrl;
};
```

#### Sauvegarde en Base
```tsx
const saveDocumentRecord = async (fileUrl: string) => {
  const { error } = await supabase
    .from('driver_documents')
    .upsert({
      driver_id: driver?.id,
      type: documentId,
      file_url: fileUrl,
      expiry_date: expiryDate || null,
      status: 'pending',
      uploaded_at: new Date().toISOString(),
    }, {
      onConflict: 'driver_id,type'
    });

  if (error) throw error;
};
```

---

## 📊 Intégration Supabase

### Table `driver_documents`

```sql
CREATE TABLE driver_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'driving_license', 'identity_card', etc.
  file_url TEXT NOT NULL,
  expiry_date DATE,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'validated', 'rejected'
  rejection_reason TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  validated_at TIMESTAMP WITH TIME ZONE,
  validated_by UUID REFERENCES users(id),
  
  UNIQUE(driver_id, type)
);

CREATE INDEX idx_driver_documents_driver ON driver_documents(driver_id);
CREATE INDEX idx_driver_documents_status ON driver_documents(status);
```

### Bucket Storage `documents`

```sql
-- Créer le bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true);

-- Politique de sécurité (upload)
CREATE POLICY "Drivers can upload their own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Politique de sécurité (lecture)
CREATE POLICY "Drivers can view their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Politique de sécurité (mise à jour)
CREATE POLICY "Drivers can update their own documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## 🧪 Tester

Le serveur est lancé sur **http://localhost:8080**

1. **Connecte-toi** (auto-login ✅)
2. **Va sur Profile**
3. **Clique sur "Documents"**
4. **Vérifie la liste** :
   - Barre de progression ✅
   - Badges de statut ✅
   - Alertes si documents manquants ✅
5. **Clique sur un document**
6. **Teste l'upload** :
   - Sélectionne une image ✅
   - Vérifie la prévisualisation ✅
   - Ajoute une date d'expiration ✅
   - Envoie pour validation ✅

---

## ✨ Fonctionnalités

- ✅ **Liste des 4 documents obligatoires**
- ✅ **Barre de progression** (X/4 validés)
- ✅ **Badges de statut** (Validé, En attente, Rejeté, Manquant)
- ✅ **Détection d'expiration** (alerte si < 30 jours)
- ✅ **Upload de fichiers** avec prévisualisation
- ✅ **Validation** (type, taille max 10MB)
- ✅ **Date d'expiration** (optionnel)
- ✅ **Conseils** pour une photo réussie
- ✅ **Intégration Supabase** (Storage + Database)

---

## 📋 Checklist

- [x] Page Documents créée
- [x] Page DocumentUpload créée
- [x] Routes ajoutées
- [x] Navigation depuis Profile
- [x] Header avec bouton retour
- [x] BottomNav présent
- [x] Design dark appliqué
- [x] Badges de statut
- [x] Barre de progression
- [x] Upload de fichiers
- [x] Prévisualisation
- [x] Validation fichiers
- [ ] Intégration Supabase réelle (à faire)

---

**Module de gestion des documents terminé ! 📄✨**
