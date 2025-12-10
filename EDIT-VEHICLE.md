# 🚗 Édition de Véhicule - Documentation

## ✅ Page Créée

**Route** : `/vehicles/:vehicleId/edit`

---

## 📱 Aperçu Visuel

```
┌─────────────────────────────────────┐
│  ←  Modifier mon véhicule       🔔  │
├─────────────────────────────────────┤
│  Modifier mon véhicule              │
│  Mettez à jour les informations...  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [Photo du véhicule]         │   │
│  │                             │   │
│  │  [📷 Changer la photo]      │   │  ← Overlay hover
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Marque *                    │   │
│  │ [Peugeot____________]       │   │
│  │                             │   │
│  │ Modèle *                    │   │
│  │ [308_________________]      │   │
│  │                             │   │
│  │ Immatriculation *           │   │
│  │ [AB-123-CD__________]       │   │  ← Auto-uppercase
│  │ Sera converti en majuscules │   │
│  │                             │   │
│  │ Couleur *                   │   │
│  │ [Noir_______________]       │   │
│  │                             │   │
│  │ Type de véhicule *          │   │
│  │ [Voiture ▼__________]       │   │  ← Select
│  └─────────────────────────────┘   │
│                                     │
│  [💾 Enregistrer les modifications] │
└─────────────────────────────────────┘
```

---

## 🔧 Fonctionnalités

### 1️⃣ **Chargement des Données**

```tsx
useEffect(() => {
  loadVehicle();
}, [vehicleId]);

const loadVehicle = async () => {
  // Production: Load from Supabase
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', vehicleId)
    .single();

  if (error) {
    toast({ title: 'Erreur' });
    navigate('/admin-hub');
    return;
  }

  setVehicle(data);
};
```

### 2️⃣ **Upload de Photo**

#### Sélection
```tsx
const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  
  // Validation type
  if (!file.type.startsWith('image/')) {
    toast({ title: 'Erreur', description: 'Image requise' });
    return;
  }

  // Validation taille (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    toast({ title: 'Erreur', description: 'Max 10MB' });
    return;
  }

  setSelectedImage(file);
  setPreviewUrl(URL.createObjectURL(file));
};
```

#### Upload Supabase
```tsx
const uploadImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${vehicle?.id}/vehicle.${fileExt}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('vehicles')
    .upload(fileName, file, { upsert: true });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('vehicles')
    .getPublicUrl(fileName);

  return publicUrl;
};
```

### 3️⃣ **Auto-Uppercase Plaque**

```tsx
const handleChange = (field: keyof Vehicle, value: string) => {
  // Auto-uppercase for license plate
  if (field === 'licensePlate') {
    value = value.toUpperCase();
  }

  setVehicle({ ...vehicle, [field]: value });
};
```

### 4️⃣ **Sauvegarde**

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);

  try {
    // Upload new image if selected
    let imageUrl = vehicle.imageUrl;
    if (selectedImage) {
      imageUrl = await uploadImage(selectedImage);
    }

    // Update vehicle in database
    const { error } = await supabase
      .from('vehicles')
      .update({
        brand: vehicle.brand,
        model: vehicle.model,
        license_plate: vehicle.licensePlate,
        color: vehicle.color,
        type: vehicle.type,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', vehicle.id);

    if (error) throw error;

    toast({ title: 'Véhicule mis à jour !' });
    navigate('/admin-hub');

  } catch (error) {
    toast({ title: 'Erreur', variant: 'destructive' });
  } finally {
    setSaving(false);
  }
};
```

---

## 🎨 Design System

### Photo Section
```tsx
<Card className="bg-slate-900 border-slate-800 overflow-hidden">
  <div className="relative h-64 w-full">
    <img src={displayImageUrl} className="w-full h-full object-cover" />
    
    {/* Overlay hover */}
    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100">
      <label className="bg-yellow-400 text-black font-bold">
        <Camera className="w-5 h-5" />
        Changer la photo
      </label>
    </div>
  </div>
</Card>
```

### Form Inputs
```tsx
<Input
  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
  placeholder="Ex: Peugeot"
/>
```

### Select
```tsx
<Select>
  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
    <SelectValue />
  </SelectTrigger>
  <SelectContent className="bg-slate-800 border-slate-700">
    <SelectItem value="scooter">Scooter</SelectItem>
    <SelectItem value="moto">Moto</SelectItem>
    <SelectItem value="voiture">Voiture</SelectItem>
  </SelectContent>
</Select>
```

### Save Button
```tsx
<Button className="bg-[#FCD34D] hover:bg-[#FCD34D]/90 text-black font-bold">
  {saving ? (
    <>
      <Loader2 className="animate-spin mr-2" />
      Enregistrement...
    </>
  ) : (
    <>
      <Save className="mr-2" />
      Enregistrer
    </>
  )}
</Button>
```

---

## 🧪 Tester

Le serveur est lancé sur **http://localhost:8080**

1. **Profile** → "Mon Dossier Pro"
2. **Toggle Véhicule**
3. **Clique sur "Modifier / Remplacer"** → Page d'édition ✅
4. **Teste l'upload photo** :
   - Hover sur photo → Overlay apparaît ✅
   - Clique "Changer la photo" → File picker ✅
   - Sélectionne une image → Preview s'affiche ✅
5. **Teste les champs** :
   - Modifie la marque → OK ✅
   - Entre "ab-123-cd" dans plaque → Converti en "AB-123-CD" ✅
   - Change le type → Select fonctionne ✅
6. **Sauvegarde** :
   - Clique "Enregistrer" → Loader ✅
   - Toast "Véhicule mis à jour !" ✅
   - Redirection vers /admin-hub ✅

---

## 📊 Flux Utilisateur

```
Admin Hub
  ↓
[Modifier / Remplacer mon véhicule]
  ↓
/vehicles/:id/edit
  ↓
Chargement des données
  ↓
Formulaire pré-rempli
  ├─ Photo actuelle affichée
  ├─ Champs remplis
  └─ Type sélectionné
  ↓
Modifications
  ├─ Changer photo (optionnel)
  ├─ Modifier champs
  └─ Validation auto-uppercase
  ↓
[Enregistrer]
  ├─ Upload photo si nouvelle
  ├─ Update database
  └─ Toast + Redirection
  ↓
Admin Hub (véhicule mis à jour)
```

---

## ✨ Fonctionnalités Avancées

### Validation Photo
- ✅ Type : Seulement images
- ✅ Taille : Max 10MB
- ✅ Preview : Affichage immédiat

### Auto-Uppercase
```tsx
// Input
value="ab-123-cd"

// onChange
value.toUpperCase() // "AB-123-CD"
```

### États du Bouton
- **Normal** : "Enregistrer les modifications"
- **Loading** : "Enregistrement en cours..." + Spinner
- **Disabled** : Pendant sauvegarde

### Cleanup
```tsx
useEffect(() => {
  return () => {
    // Cleanup preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };
}, [previewUrl]);
```

---

## 📋 Checklist

- [x] Page EditVehicle créée
- [x] Route /vehicles/:id/edit ajoutée
- [x] Chargement données Supabase
- [x] Upload photo avec validation
- [x] Preview photo
- [x] Auto-uppercase plaque
- [x] Select type véhicule
- [x] Sauvegarde Supabase
- [x] Toast feedback
- [x] Redirection après succès
- [x] Design dark cohérent
- [x] Bouton jaune #FCD34D
- [x] AdminHub mis à jour

---

## 🎯 Résumé

| Élément | Implémenté |
|---------|------------|
| **Upload photo** | ✅ Avec validation |
| **Preview** | ✅ Temps réel |
| **Auto-uppercase** | ✅ Plaque |
| **Select type** | ✅ 3 options |
| **Supabase** | ✅ Code prêt |
| **UX** | ✅ Feedback complet |

---

**Page d'édition de véhicule terminée ! 🚗✨**
