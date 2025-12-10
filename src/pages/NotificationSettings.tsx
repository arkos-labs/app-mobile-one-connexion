import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, MessageSquare, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettings {
    // Courses
    newOrder: boolean;
    orderCancellation: boolean;

    // Messages
    clientMessages: boolean;
    supportMessages: boolean;

    // Administratif
    payments: boolean;
    documentAlerts: boolean;
}

export default function NotificationSettings() {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [settings, setSettings] = useState<NotificationSettings>({
        // Courses (activées par défaut - critiques)
        newOrder: true,
        orderCancellation: true,

        // Messages
        clientMessages: true,
        supportMessages: true,

        // Administratif
        payments: true,
        documentAlerts: true,
    });

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

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-slate-950">
            <Header />

            <main className="flex-1 overflow-y-auto px-4 py-6 max-w-lg mx-auto space-y-8 w-full pb-24 scrollbar-hide">
                {/* Section: COURSES */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Bell className="w-4 h-4 text-yellow-400" />
                        <h2 className="text-xs tracking-widest font-bold text-slate-400 uppercase">
                            Courses
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {/* Nouvelle proposition de course */}
                        <Card className="bg-slate-900 border-slate-800">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-white mb-1">
                                            Nouvelle proposition de course
                                        </h3>
                                        <p className="text-sm text-slate-400">
                                            Soyez alerté dès qu'une course est disponible autour de vous.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.newOrder}
                                        onCheckedChange={() => toggleSwitch('newOrder')}
                                        className="data-[state=checked]:bg-yellow-400"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Annulation / Modification */}
                        <Card className="bg-slate-900 border-slate-800">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-white mb-1">
                                            Annulation / Modification
                                        </h3>
                                        <p className="text-sm text-slate-400">
                                            Si le client change l'adresse ou annule.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.orderCancellation}
                                        onCheckedChange={() => toggleSwitch('orderCancellation')}
                                        className="data-[state=checked]:bg-yellow-400"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Section: MESSAGES */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="w-4 h-4 text-yellow-400" />
                        <h2 className="text-xs tracking-widest font-bold text-slate-400 uppercase">
                            Messages
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {/* Messages Clients */}
                        <Card className="bg-slate-900 border-slate-800">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-white mb-1">
                                            Messages Clients
                                        </h3>
                                        <p className="text-sm text-slate-400">
                                            Chat en direct pendant une livraison.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.clientMessages}
                                        onCheckedChange={() => toggleSwitch('clientMessages')}
                                        className="data-[state=checked]:bg-yellow-400"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Support One Connexion */}
                        <Card className="bg-slate-900 border-slate-800">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-white mb-1">
                                            Support One Connexion
                                        </h3>
                                        <p className="text-sm text-slate-400">
                                            Messages importants de l'administration.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.supportMessages}
                                        onCheckedChange={() => toggleSwitch('supportMessages')}
                                        className="data-[state=checked]:bg-yellow-400"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Section: ADMINISTRATIF */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="w-4 h-4 text-yellow-400" />
                        <h2 className="text-xs tracking-widest font-bold text-slate-400 uppercase">
                            Administratif
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {/* Paiements Reçus */}
                        <Card className="bg-slate-900 border-slate-800">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-white mb-1">
                                            Paiements Reçus
                                        </h3>
                                        <p className="text-sm text-slate-400">
                                            Notif quand un virement arrive sur votre compte.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.payments}
                                        onCheckedChange={() => toggleSwitch('payments')}
                                        className="data-[state=checked]:bg-yellow-400"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Alertes Documents */}
                        <Card className="bg-slate-900 border-slate-800">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-white mb-1">
                                            Alertes Documents
                                        </h3>
                                        <p className="text-sm text-slate-400">
                                            Rappels avant expiration du permis ou assurance.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.documentAlerts}
                                        onCheckedChange={() => toggleSwitch('documentAlerts')}
                                        className="data-[state=checked]:bg-yellow-400"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Info Footer */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <p className="text-xs text-slate-400 text-center">
                        💡 Les notifications de nouvelles courses sont fortement recommandées pour ne manquer aucune opportunité.
                    </p>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
