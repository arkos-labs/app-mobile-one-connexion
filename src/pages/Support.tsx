import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, HelpCircle, ChevronDown, ChevronRight, MessageCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface FaqItem {
    id: string;
    question: string;
    answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
    {
        id: 'documents',
        question: 'Comment modifier mes documents ?',
        answer: 'Rendez-vous dans votre Profil > Mon Dossier Pro pour mettre à jour vos documents (permis, assurance, carte grise).',
    },
    {
        id: 'vehicle',
        question: 'Comment changer de véhicule ?',
        answer: 'Allez dans Profil > Mon Dossier Pro > Véhicules pour ajouter, modifier ou supprimer un véhicule.',
    },
    {
        id: 'payment',
        question: 'Quand vais-je recevoir mon paiement ?',
        answer: 'Les paiements sont effectués chaque semaine le vendredi. Vous recevrez un email de confirmation. En cas de retard, contactez-nous via le bouton "Appeler le Support".',
    },
    {
        id: 'course-problem',
        question: 'Que faire si j\'ai un problème avec une course ?',
        answer: 'En cas de problème (client absent, adresse incorrecte, etc.), appelez immédiatement le support via le bouton ci-dessus. Nous vous aiderons en temps réel.',
    },
    {
        id: 'account',
        question: 'Comment modifier mes informations personnelles ?',
        answer: 'Pour modifier votre nom, email ou téléphone, allez dans Profil et cliquez sur "Modifier mon profil". Pour la sécurité (mot de passe, biométrie), allez dans Profil > Sécurité & Connexion.',
    },
    {
        id: 'notifications',
        question: 'Comment gérer mes notifications ?',
        answer: 'Rendez-vous dans Profil > Préférences Notifications pour activer ou désactiver les alertes de courses, messages et paiements.',
    },
];

export default function Support() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [calling, setCalling] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

    const handleEmergencyCall = () => {
        setCalling(true);

        toast({
            title: 'Appel en cours...',
            description: 'Connexion au support One Connexion',
        });

        // In production: window.location.href = 'tel:+33123456789';

        setTimeout(() => {
            setCalling(false);
        }, 2000);
    };

    const handleEmail = () => {
        window.location.href = 'mailto:support@oneconnexion.fr?subject=Demande d\'aide chauffeur';
    };

    const toggleFaq = (faqId: string) => {
        setExpandedFaq(expandedFaq === faqId ? null : faqId);
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-slate-950">
            <Header />

            <main className="flex-1 overflow-y-auto px-4 py-6 max-w-lg mx-auto space-y-6 w-full pb-24 scrollbar-hide">
                {/* Header Section */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Aide & Support</h1>
                    <p className="text-slate-400 text-sm">
                        Nous sommes là pour vous aider 24/7
                    </p>
                </div>

                {/* Chat en Direct - Priority */}
                <Card className="bg-slate-800 border-yellow-500/50">
                    <CardContent className="p-4">
                        <div
                            className="flex items-center gap-4 cursor-pointer"
                            onClick={() => navigate('/chat')}
                        >
                            <div className="w-14 h-14 rounded-xl bg-yellow-400/20 flex items-center justify-center flex-shrink-0 relative">
                                <MessageCircle className="w-7 h-7 text-yellow-400 fill-yellow-400" />
                                {/* Unread badge (mock) */}
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-800" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-white mb-1">Contacter le Dispatch</h3>
                                <p className="text-sm text-slate-400">
                                    Chat en direct • Réponse immédiate
                                </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Buttons */}
                <Card className="bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border-yellow-400/30">
                    <CardContent className="p-6 space-y-3">
                        <h2 className="text-sm font-semibold text-yellow-400 mb-3 text-center">
                            Besoin d'aide immédiate ?
                        </h2>

                        <Button
                            onClick={handleEmergencyCall}
                            disabled={calling}
                            className="w-full h-14 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold text-base"
                        >
                            <Phone className="w-5 h-5 mr-2" />
                            {calling ? 'Appel en cours...' : 'Appeler le Support'}
                        </Button>

                        <Button
                            onClick={handleEmail}
                            variant="outline"
                            className="w-full h-12 border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
                        >
                            <Mail className="w-5 h-5 mr-2" />
                            Envoyer un Email
                        </Button>

                        <p className="text-xs text-yellow-400/70 text-center mt-2">
                            📞 Disponible 24h/24, 7j/7
                        </p>
                    </CardContent>
                </Card>

                {/* FAQ Section */}
                <div className="space-y-3">
                    <h2 className="text-xs tracking-widest font-bold text-slate-400 uppercase flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        Questions Fréquentes
                    </h2>

                    {FAQ_ITEMS.map((item) => {
                        const isExpanded = expandedFaq === item.id;

                        return (
                            <Card
                                key={item.id}
                                className="bg-slate-900 border-slate-800"
                            >
                                <CardContent className="p-0">
                                    {/* Question (Clickable) */}
                                    <div
                                        className="p-4 cursor-pointer hover:bg-slate-800 transition-colors"
                                        onClick={() => toggleFaq(item.id)}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <h3 className="font-medium text-white flex-1">
                                                {item.question}
                                            </h3>
                                            {isExpanded ? (
                                                <ChevronDown className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                                            ) : (
                                                <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Answer (Expandable) */}
                                    {isExpanded && (
                                        <div className="px-4 pb-4 pt-2 border-t border-slate-800 bg-slate-800/50">
                                            <p className="text-sm text-slate-300 leading-relaxed">
                                                {item.answer}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Contact Info */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4 space-y-3">
                        <h3 className="font-medium text-white flex items-center gap-2">
                            <Phone className="w-4 h-4 text-yellow-400" />
                            Informations de Contact
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Téléphone</span>
                                <a href="tel:+33123456789" className="text-yellow-400 font-medium hover:underline">
                                    +33 1 23 45 67 89
                                </a>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Email</span>
                                <a href="mailto:support@oneconnexion.fr" className="text-yellow-400 font-medium hover:underline">
                                    support@oneconnexion.fr
                                </a>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Horaires</span>
                                <span className="text-white font-medium">24h/24, 7j/7</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Info Footer */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4">
                        <p className="text-xs text-slate-400 text-center">
                            💡 Temps de réponse moyen : <span className="text-yellow-400 font-semibold">moins de 5 minutes</span>
                        </p>
                    </CardContent>
                </Card>
            </main>

            <BottomNav />
        </div>
    );
}
