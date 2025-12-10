import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

interface Message {
    id: string;
    content: string;
    sender: 'driver' | 'dispatch';
    timestamp: Date;
    read: boolean;
}

// Mock initial messages
const INITIAL_MESSAGES: Message[] = [
    {
        id: '1',
        content: 'Bonjour Jean, comment allez-vous aujourd\'hui ?',
        sender: 'dispatch',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        read: true,
    },
    {
        id: '2',
        content: 'Bonjour ! Très bien merci. Je suis prêt pour ma journée.',
        sender: 'driver',
        timestamp: new Date(Date.now() - 3500000),
        read: true,
    },
    {
        id: '3',
        content: 'Parfait ! Vous avez une nouvelle course assignée. Pouvez-vous confirmer la prise en charge ?',
        sender: 'dispatch',
        timestamp: new Date(Date.now() - 1800000), // 30 min ago
        read: true,
    },
    {
        id: '4',
        content: 'Oui, je confirme. J\'arrive au point de collecte dans 5 minutes.',
        sender: 'driver',
        timestamp: new Date(Date.now() - 1700000),
        read: true,
    },
];

export default function Chat() {
    const { driver } = useAuthStore();
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async () => {
        if (!newMessage.trim() || isSending) return;

        setIsSending(true);

        // Create new message
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

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsSending(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-slate-950">
            <Header />

            {/* Chat Header */}
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-4 shrink-0">
                <div className="max-w-lg mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-black">
                            D
                        </div>
                        <div className="flex-1">
                            <h2 className="font-semibold text-white">Dispatch</h2>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-xs text-slate-400">En ligne</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
                <div className="max-w-lg mx-auto space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                "flex",
                                message.sender === 'driver' ? 'justify-end' : 'justify-start'
                            )}
                        >
                            <div
                                className={cn(
                                    "max-w-[75%] rounded-2xl px-4 py-3",
                                    message.sender === 'driver'
                                        ? "bg-[#FCD34D] text-black rounded-br-sm"
                                        : "bg-slate-800 text-white rounded-bl-sm"
                                )}
                            >
                                <p className="text-sm whitespace-pre-wrap break-words">
                                    {message.content}
                                </p>
                                <p
                                    className={cn(
                                        "text-xs mt-1",
                                        message.sender === 'driver'
                                            ? "text-black/60"
                                            : "text-slate-400"
                                    )}
                                >
                                    {formatTime(message.timestamp)}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Bar */}
            <div className="bg-slate-900 border-t border-slate-800 px-4 py-4 pb-24 shrink-0">
                <div className="max-w-lg mx-auto flex items-end gap-3">
                    <div className="flex-1 bg-slate-800 rounded-2xl px-4 py-3">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Écrivez votre message..."
                            className="bg-transparent border-0 text-white placeholder:text-slate-500 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                            disabled={isSending}
                        />
                    </div>
                    <Button
                        onClick={handleSend}
                        disabled={!newMessage.trim() || isSending}
                        className="h-12 w-12 rounded-full bg-[#FCD34D] hover:bg-[#FCD34D]/90 text-black p-0 flex-shrink-0 disabled:opacity-50"
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
