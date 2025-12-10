import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Shield, LogOut, ChevronRight, Globe, Moon } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';

const APP_VERSION = '1.0.4';
const BUILD_NUMBER = '2024';

export default function Settings() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { logout } = useAuthStore();

    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [darkMode] = useState(true); // Locked to true (dark mode only)

    const handleLanguageClick = () => {
        toast({
            title: 'Bientôt disponible',
            description: 'La sélection de langue arrive prochainement',
        });
    };

    const handleCGUClick = () => {
        // Open CGU in new tab
        window.open('https://oneconnexion.fr/cgu', '_blank');
    };

    const handlePrivacyClick = () => {
        // Open Privacy Policy in new tab
        window.open('https://oneconnexion.fr/politique-confidentialite', '_blank');
    };

    const handleLogout = async () => {
        setShowLogoutDialog(false);

        try {
            // In production: Call Supabase signOut
            // const { error } = await supabase.auth.signOut();
            // if (error) throw error;

            // Simulate logout
            await new Promise(resolve => setTimeout(resolve, 500));

            logout();

            toast({
                title: 'Déconnexion réussie',
                description: 'À bientôt !',
            });

            // Redirect to login
            setTimeout(() => {
                navigate('/login');
            }, 1000);

        } catch (error) {
            console.error('Error logging out:', error);
            toast({
                title: 'Erreur',
                description: 'Une erreur est survenue lors de la déconnexion',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 pb-24">
            <Header />

            <main className="px-4 py-6 max-w-lg mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Paramètres</h1>
                    <p className="text-slate-400 text-sm">
                        Gérez vos préférences et informations
                    </p>
                </div>

                {/* Section: PRÉFÉRENCES */}
                <div className="space-y-3">
                    <h2 className="text-xs tracking-widest font-bold text-slate-400 uppercase">
                        Préférences
                    </h2>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardContent className="p-0">
                            {/* Language */}
                            <div
                                className="p-4 cursor-pointer hover:bg-slate-800 transition-colors border-b border-slate-800"
                                onClick={handleLanguageClick}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                                            <Globe className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-white">Langue</h3>
                                            <p className="text-sm text-slate-400">Français</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-400" />
                                </div>
                            </div>

                            {/* Dark Mode */}
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                                            <Moon className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-white">Mode Sombre</h3>
                                            <p className="text-sm text-slate-400">Toujours activé</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={darkMode}
                                        disabled
                                        className="data-[state=checked]:bg-yellow-400 opacity-50 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Section: INFORMATIONS LÉGALES */}
                <div className="space-y-3">
                    <h2 className="text-xs tracking-widest font-bold text-slate-400 uppercase">
                        Informations Légales
                    </h2>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardContent className="p-0">
                            {/* CGU */}
                            <div
                                className="p-4 cursor-pointer hover:bg-slate-800 transition-colors border-b border-slate-800"
                                onClick={handleCGUClick}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-white">
                                            Conditions Générales d'Utilisation
                                        </h3>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                </div>
                            </div>

                            {/* Privacy Policy */}
                            <div
                                className="p-4 cursor-pointer hover:bg-slate-800 transition-colors"
                                onClick={handlePrivacyClick}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-white">
                                            Politique de Confidentialité
                                        </h3>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* App Version */}
                    <div className="text-center py-2">
                        <p className="text-xs text-slate-500">
                            Version {APP_VERSION} (Build {BUILD_NUMBER})
                        </p>
                    </div>
                </div>

                {/* Section: DÉCONNEXION */}
                <div className="space-y-3 pt-4">
                    <Button
                        variant="outline"
                        onClick={() => setShowLogoutDialog(true)}
                        className="w-full h-14 border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-500 font-bold"
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        Se déconnecter
                    </Button>
                </div>
            </main>

            <BottomNav />

            {/* Logout Confirmation Dialog */}
            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogContent className="bg-slate-900 border-slate-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                            Confirmer la déconnexion
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            Voulez-vous vraiment vous déconnecter ? Vous devrez vous reconnecter pour accéder à l'application.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                            Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            Se déconnecter
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
