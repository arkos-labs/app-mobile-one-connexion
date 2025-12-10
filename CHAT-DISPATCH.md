# 💬 Chat avec le Dispatch - Documentation

## ✅ Fonctionnalité Créée

**Route** : `/chat`

---

## 📱 Aperçu Visuel

### Support.tsx (Point d'entrée)
```
┌─────────────────────────────────────┐
│  Aide & Support                     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 💬 Contacter le Dispatch    │   │  ← Prioritaire
│  │    Chat en direct • Réponse │   │
│  │    immédiate             🔴>│   │  ← Badge non lu
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Besoin d'aide immédiate ?   │   │
│  │ [📞 Appeler le Support]     │   │
│  │ [📧 Envoyer un Email]       │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Chat.tsx (Interface de chat)
```
┌─────────────────────────────────────┐
│  ←    Dispatch                  🔔  │
│       🟢 En ligne                   │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────┐           │
│  │ Bonjour Jean,       │           │  ← Dispatch (gris)
│  │ comment allez-vous? │           │
│  │ 13:30               │           │
│  └─────────────────────┘           │
│                                     │
│           ┌─────────────────────┐  │
│           │ Très bien merci !   │  │  ← Moi (jaune)
│           │ Je suis prêt.       │  │
│           │ 13:31               │  │
│           └─────────────────────┘  │
│                                     │
│  ┌─────────────────────┐           │
│  │ Parfait ! Nouvelle  │           │
│  │ course assignée.    │           │
│  │ 14:00               │           │
│  └─────────────────────┘           │
│                                     │
│           ┌─────────────────────┐  │
│           │ J'arrive dans 5min  │  │
│           │ 14:01               │  │
│           └─────────────────────┘  │
│                                     │
├─────────────────────────────────────┤
│  [Écrivez votre message...]    [✈️] │  ← Input bar
└─────────────────────────────────────┘
```

---

## 🔧 Fonctionnalités

### 1️⃣ **Bouton Chat dans Support**

```tsx
<Card className="bg-slate-800 border-yellow-500/50">
  <div onClick={() => navigate('/chat')}>
    <div className="relative">
      <MessageCircle className="text-yellow-400 fill-yellow-400" />
      {/* Badge non lu */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
    </div>
    <div>
      <h3>Contacter le Dispatch</h3>
      <p>Chat en direct • Réponse immédiate</p>
    </div>
    <ChevronRight className="text-yellow-400" />
  </div>
</Card>
```

**Design** :
- Fond : `bg-slate-800` (plus clair)
- Bordure : `border-yellow-500/50` (jaune)
- Icône : Remplie jaune
- Badge : Point rouge si non lu

---

### 2️⃣ **Interface de Chat**

#### Header
```tsx
<div className="bg-slate-900 border-b border-slate-800">
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-yellow-400">D</div>
    <div>
      <h2>Dispatch</h2>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span>En ligne</span>
      </div>
    </div>
  </div>
</div>
```

#### Messages
```tsx
interface Message {
  id: string;
  content: string;
  sender: 'driver' | 'dispatch';
  timestamp: Date;
  read: boolean;
}
```

**Bulles** :
```tsx
// Dispatch (gauche, gris)
<div className="justify-start">
  <div className="bg-slate-800 text-white rounded-2xl rounded-bl-sm">
    <p>{content}</p>
    <p className="text-slate-400">{time}</p>
  </div>
</div>

// Driver (droite, jaune)
<div className="justify-end">
  <div className="bg-[#FCD34D] text-black rounded-2xl rounded-br-sm">
    <p>{content}</p>
    <p className="text-black/60">{time}</p>
  </div>
</div>
```

#### Input Bar
```tsx
<div className="fixed bottom-0 bg-slate-900 border-t border-slate-800">
  <div className="flex items-end gap-3">
    <div className="flex-1 bg-slate-800 rounded-2xl">
      <Input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Écrivez votre message..."
      />
    </div>
    <Button
      onClick={handleSend}
      disabled={!newMessage.trim()}
      className="h-12 w-12 rounded-full bg-[#FCD34D]"
    >
      <Send className="w-5 h-5" />
    </Button>
  </div>
</div>
```

---

### 3️⃣ **Logique d'Envoi**

```tsx
const handleSend = async () => {
  if (!newMessage.trim() || isSending) return;

  setIsSending(true);

  // Create message
  const message: Message = {
    id: Date.now().toString(),
    content: newMessage.trim(),
    sender: 'driver',
    timestamp: new Date(),
    read: false,
  };

  // Add to messages
  setMessages(prev => [...prev, message]);
  setNewMessage('');

  // In production: Send to Supabase
  // await supabase.from('messages').insert({
  //   content: message.content,
  //   sender_id: driver?.id,
  //   sender_type: 'driver',
  //   conversation_id: 'dispatch',
  //   created_at: message.timestamp.toISOString(),
  // });

  setIsSending(false);
};
```

---

### 4️⃣ **Auto-Scroll**

```tsx
const messagesEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  scrollToBottom();
}, [messages]);

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
};

// Dans le JSX
<div ref={messagesEndRef} />
```

---

### 5️⃣ **Enter pour Envoyer**

```tsx
const handleKeyPress = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
};
```

---

## 🎨 Design System

### Bulles de Message

#### Dispatch (Gauche)
```tsx
className="bg-slate-800 text-white rounded-2xl rounded-bl-sm px-4 py-3"
```

#### Driver (Droite)
```tsx
className="bg-[#FCD34D] text-black rounded-2xl rounded-br-sm px-4 py-3"
```

### Input Bar
```tsx
<div className="bg-slate-900 border-t border-slate-800 px-4 py-4">
  <Input className="bg-slate-800 text-white" />
  <Button className="bg-[#FCD34D] text-black rounded-full" />
</div>
```

---

## 🧪 Tester

Le serveur est lancé sur **http://localhost:8080**

1. **Support** → "Contacter le Dispatch"
2. **Page Chat** s'ouvre ✅
3. **Vérifie messages** :
   - Dispatch à gauche (gris) ✅
   - Driver à droite (jaune) ✅
   - Heures affichées ✅
4. **Écris un message** :
   - Entre du texte ✅
   - Appuie Enter → Envoyé ✅
   - Auto-scroll en bas ✅
5. **Bouton Send** :
   - Disabled si vide ✅
   - Clique → Envoyé ✅

---

## 📊 Flux Utilisateur

```
Support
  ↓
[Contacter le Dispatch]
  ↓
/chat
  ↓
Messages affichés
  ├─ Dispatch (gauche, gris)
  └─ Driver (droite, jaune)
  ↓
[Écris message]
  ↓
Enter ou Clique Send
  ↓
Message ajouté
  ↓
Auto-scroll en bas
```

---

## ⚙️ Intégration Supabase (Préparation)

### Table `messages`
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  sender_id UUID NOT NULL,
  sender_type VARCHAR(20) NOT NULL, -- 'driver' or 'dispatch'
  conversation_id VARCHAR(50) NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Realtime Subscription
```tsx
useEffect(() => {
  // Subscribe to new messages
  const subscription = supabase
    .channel('messages')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.dispatch`,
    }, (payload) => {
      const newMessage = payload.new as Message;
      setMessages(prev => [...prev, newMessage]);
    })
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

---

## ✨ Fonctionnalités Avancées

### Badge Non Lu
```tsx
<div className="relative">
  <MessageCircle />
  {hasUnread && (
    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
  )}
</div>
```

### Format Heure
```tsx
const formatTime = (date: Date) => {
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
```

### Max Width Bulles
```tsx
className="max-w-[75%]"
```

---

## 📋 Checklist

- [x] Page Chat créée
- [x] Route /chat ajoutée
- [x] Bouton dans Support
- [x] Badge non lu (mock)
- [x] Header avec statut
- [x] Bulles colorées
- [x] Auto-scroll
- [x] Input bar
- [x] Enter pour envoyer
- [x] Bouton Send
- [x] Mock messages
- [x] Supabase ready

---

## 🎯 Résumé

| Élément | Implémenté |
|---------|------------|
| **Bouton Support** | ✅ Prioritaire + Badge |
| **Interface Chat** | ✅ Style WhatsApp |
| **Bulles** | ✅ Jaune/Gris |
| **Auto-scroll** | ✅ |
| **Input** | ✅ Enter + Button |
| **Supabase** | ✅ Code prêt |

---

**Chat avec le Dispatch terminé ! 💬🎉**
