import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Lock,
    Fingerprint,
    Phone,
    ChevronRight,
    AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
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

export default function SecuritySettings() {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const toggleBiometric = () => {
        setBiometricEnabled(!biometricEnabled);

        toast({
            title: biometricEnabled ? 'Biométrie désactivée' : 'Biométrie activée',
            description: biometricEnabled
                ? 'Vous devrez utiliser votre mot de passe pour vous connecter'
                : 'Vous pourrez vous connecter avec FaceID/TouchID',
        });
    };

    const handleChangePassword = () => {
        navigate('/security/change-password');
    };

    const handleEmergencyContact = () => {
        toast({
            title: 'Bientôt disponible',
            description: 'La gestion des contacts d\'urgence arrive prochainement',
        });
    };

    const handleDeleteAccount = () => {
        setShowDeleteDialog(false);

        toast({
            title: 'Compte supprimé',
            description: 'Votre compte a été supprimé avec succès',
            variant: 'destructive',
        });

        // Simulate account deletion and redirect to login
        setTimeout(() => {
            navigate('/login');
        }, 2000);
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-slate-950">
            <Header />

            <main className="flex-1 overflow-y-auto px-4 py-6 max-w-lg mx-auto space-y-8 w-full pb-24 scrollbar-hide">
                {/* Section: AUTHENTIFICATION */}
                <div>
                    <h2 className="text-xs tracking-widest font-bold text-slate-400 uppercase mb-3">
                        Authentification
                    </h2>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
                                        <Fingerprint className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-white mb-1">
                                            Connexion biométrique
                                        </h3>
                                        <p className="text-sm text-slate-400">
                                            Se connecter sans mot de passe (FaceID / TouchID)
                                        </p>
                                    </div>
                                </div>
                                <Switch
                                    checked={biometricEnabled}
                                    onCheckedChange={toggleBiometric}
                                    className="data-[state=checked]:bg-yellow-400 flex-shrink-0"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Section: MOT DE PASSE */}
                <div>
                    <h2 className="text-xs tracking-widest font-bold text-slate-400 uppercase mb-3">
                        Mot de passe
                    </h2>

                    <Card
                        className="bg-slate-900 border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors"
                        onClick={handleChangePassword}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center">
                                    <Lock className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-white mb-1">
                                        Modifier mon mot de passe
                                    </h3>
                                    <p className="text-sm text-slate-400">
                                        Dernière modification il y a 3 mois
                                    </p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Section: SÉCURITÉ TRAJET */}
                <div>
                    <h2 className="text-xs tracking-widest font-bold text-slate-400 uppercase mb-3">
                        Sécurité Trajet
                    </h2>

                    <div className="space-y-3">
                        {/* Contact d'urgence */}
                        <Card
                            className="bg-slate-900 border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors"
                            onClick={handleEmergencyContact}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-white mb-1">
                                            Contact d'urgence (SOS)
                                        </h3>
                                        <p className="text-sm text-slate-400">
                                            Personne à prévenir en cas d'incident
                                        </p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-400" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Section: ZONE DE DANGER */}
                <div>
                    <h2 className="text-xs tracking-widest font-bold text-slate-400 uppercase mb-3">
                        Zone de danger
                    </h2>

                    <Card
                        className="bg-slate-900 border-red-500/30 cursor-pointer hover:bg-red-500/5 transition-colors"
                        onClick={() => setShowDeleteDialog(true)}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-red-500 mb-1">
                                        Supprimer mon compte
                                    </h3>
                                    <p className="text-sm text-slate-400">
                                        Cette action est irréversible
                                    </p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-red-500/50" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Info Footer */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <p className="text-xs text-slate-400 text-center">
                        🔒 Vos données sont chiffrées et sécurisées. One Connexion ne partage jamais vos informations personnelles.
                    </p>
                </div>
            </main>

            {/* Delete Account Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="bg-slate-900 border-slate-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                            Supprimer votre compte ?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            Cette action est <span className="text-red-500 font-semibold">irréversible</span>.
                            Toutes vos données, historique de courses et informations personnelles seront définitivement supprimées.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700">
                            Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-red-500 text-white hover:bg-red-600"
                        >
                            Confirmer la suppression
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <BottomNav />
        </div>
    );
}
