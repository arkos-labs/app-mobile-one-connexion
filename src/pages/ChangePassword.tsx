import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X, Lock } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PasswordCriteria {
    minLength: boolean;
    hasUppercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
}

export default function ChangePassword() {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [criteria, setCriteria] = useState<PasswordCriteria>({
        minLength: false,
        hasUppercase: false,
        hasNumber: false,
        hasSpecialChar: false,
    });

    // Validate password criteria in real-time
    useEffect(() => {
        setCriteria({
            minLength: newPassword.length >= 8,
            hasUppercase: /[A-Z]/.test(newPassword),
            hasNumber: /[0-9]/.test(newPassword),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
        });
    }, [newPassword]);

    const allCriteriaMet = Object.values(criteria).every(Boolean);
    const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!allCriteriaMet) {
            toast({
                title: 'Mot de passe invalide',
                description: 'Veuillez respecter tous les critères de sécurité',
                variant: 'destructive',
            });
            return;
        }

        if (!passwordsMatch) {
            toast({
                title: 'Erreur',
                description: 'Les mots de passe ne correspondent pas',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // In production: Update password with Supabase
            // const { error } = await supabase.auth.updateUser({
            //   password: newPassword
            // });
            // 
            // if (error) throw error;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast({
                title: 'Mot de passe modifié !',
                description: 'Votre mot de passe a été mis à jour avec succès',
            });

            // Redirect to security settings
            setTimeout(() => {
                navigate('/security');
            }, 1000);

        } catch (error) {
            console.error('Error updating password:', error);
            toast({
                title: 'Erreur',
                description: 'Une erreur est survenue lors de la modification',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 pb-24">
            <Header />

            <main className="px-4 py-6 max-w-lg mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Nouveau mot de passe</h1>
                    <p className="text-slate-400 text-sm">
                        Choisissez un mot de passe sécurisé
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* New Password */}
                    <Card className="bg-slate-900 border-slate-800">
                        <CardContent className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                    Nouveau mot de passe
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Entrez votre nouveau mot de passe"
                                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Password Criteria */}
                            {newPassword.length > 0 && (
                                <div className="space-y-2 pt-2 border-t border-slate-800">
                                    <p className="text-xs font-medium text-slate-400 mb-2">
                                        Critères de sécurité :
                                    </p>

                                    <CriteriaItem
                                        met={criteria.minLength}
                                        label="Au moins 8 caractères"
                                    />
                                    <CriteriaItem
                                        met={criteria.hasUppercase}
                                        label="Au moins 1 lettre majuscule"
                                    />
                                    <CriteriaItem
                                        met={criteria.hasNumber}
                                        label="Au moins 1 chiffre"
                                    />
                                    <CriteriaItem
                                        met={criteria.hasSpecialChar}
                                        label="Au moins 1 caractère spécial (!@#$%...)"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Confirm Password */}
                    <Card className="bg-slate-900 border-slate-800">
                        <CardContent className="p-4">
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                Confirmer le mot de passe
                            </label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirmez votre mot de passe"
                                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>

                            {/* Match Indicator */}
                            {confirmPassword.length > 0 && (
                                <div className="mt-3 flex items-center gap-2">
                                    {passwordsMatch ? (
                                        <>
                                            <Check className="w-4 h-4 text-green-400" />
                                            <span className="text-xs text-green-400">
                                                Les mots de passe correspondent
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <X className="w-4 h-4 text-red-400" />
                                            <span className="text-xs text-red-400">
                                                Les mots de passe ne correspondent pas
                                            </span>
                                        </>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={!allCriteriaMet || !passwordsMatch || isSubmitting}
                        className="w-full h-14 bg-[#FCD34D] hover:bg-[#FCD34D]/90 text-black font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                                Modification en cours...
                            </>
                        ) : (
                            <>
                                <Lock className="w-5 h-5 mr-2" />
                                Modifier mon mot de passe
                            </>
                        )}
                    </Button>

                    {/* Info */}
                    <Card className="bg-slate-900 border-slate-800">
                        <CardContent className="p-4">
                            <p className="text-xs text-slate-400 text-center">
                                💡 Choisissez un mot de passe unique que vous n'utilisez pas ailleurs
                            </p>
                        </CardContent>
                    </Card>
                </form>
            </main>

            <BottomNav />
        </div>
    );
}

// Criteria Item Component
interface CriteriaItemProps {
    met: boolean;
    label: string;
}

function CriteriaItem({ met, label }: CriteriaItemProps) {
    return (
        <div className="flex items-center gap-2">
            <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                met ? "bg-green-500/20" : "bg-slate-800"
            )}>
                {met ? (
                    <Check className="w-3 h-3 text-green-400" />
                ) : (
                    <X className="w-3 h-3 text-slate-500" />
                )}
            </div>
            <span className={cn(
                "text-xs",
                met ? "text-green-400 font-medium" : "text-slate-500"
            )}>
                {label}
            </span>
        </div>
    );
}
