import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';

interface ProfileFormData {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
}

export default function EditProfile() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { driver, setDriver } = useAuthStore();

    const [isLoading, setIsLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(driver?.avatar_url || '');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
        defaultValues: {
            firstName: driver?.first_name || '',
            lastName: driver?.last_name || '',
            phone: driver?.phone || '',
            email: driver?.email || '',
        }
    });

    // Cleanup preview URL on unmount
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast({
                title: 'Erreur',
                description: 'Veuillez sélectionner une image',
                variant: 'destructive',
            });
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: 'Erreur',
                description: 'L\'image ne doit pas dépasser 5MB',
                variant: 'destructive',
            });
            return;
        }

        setAvatarFile(file);

        // Create preview URL
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        const newPreviewUrl = URL.createObjectURL(file);
        setPreviewUrl(newPreviewUrl);
    };

    const uploadAvatar = async (file: File): Promise<string> => {
        // Simulate upload to Supabase Storage
        // In real app, this would upload to Supabase Storage bucket "avatars"

        // For demo, we'll just use the preview URL
        // In production:
        // const { data, error } = await supabase.storage
        //   .from('avatars')
        //   .upload(`${driver?.id}/${Date.now()}.jpg`, file);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(previewUrl || '');
            }, 1000);
        });
    };

    const onSubmit = async (data: ProfileFormData) => {
        setIsLoading(true);

        try {
            let newAvatarUrl = avatarUrl;

            // Upload avatar if changed
            if (avatarFile && previewUrl) {
                newAvatarUrl = await uploadAvatar(avatarFile);
            }

            // Simulate Supabase update
            // In real app:
            // const { error } = await supabase
            //   .from('drivers')
            //   .update({
            //     first_name: data.firstName,
            //     last_name: data.lastName,
            //     phone: data.phone,
            //     avatar_url: newAvatarUrl,
            //   })
            //   .eq('id', driver?.id);

            // Update local state
            if (driver) {
                const updatedDriver = {
                    ...driver,
                    first_name: data.firstName,
                    last_name: data.lastName,
                    phone: data.phone,
                    avatar_url: newAvatarUrl,
                };
                setDriver(updatedDriver);
            }

            toast({
                title: 'Profil mis à jour',
                description: 'Vos modifications ont été enregistrées avec succès',
            });

            // Wait a bit for the toast to show
            setTimeout(() => {
                navigate('/profile');
            }, 500);

        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                title: 'Erreur',
                description: 'Une erreur est survenue lors de la mise à jour',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/profile');
    };

    const initials = driver
        ? `${driver.first_name[0]}${driver.last_name[0]}`.toUpperCase()
        : 'OC';

    const displayAvatarUrl = previewUrl || avatarUrl;

    return (
        <div className="min-h-screen bg-slate-950 pb-24">
            <Header />

            <main className="px-4 py-6 max-w-lg mx-auto pb-32">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Avatar Section */}
                    <div className="text-center">
                        <div className="relative inline-block">
                            <Avatar className="w-32 h-32 border-4 border-yellow-400 bg-yellow-400">
                                {displayAvatarUrl ? (
                                    <AvatarImage src={displayAvatarUrl} alt={driver?.first_name} />
                                ) : null}
                                <AvatarFallback className="bg-yellow-400 text-black font-bold text-3xl">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>

                            {/* Camera Button */}
                            <label
                                htmlFor="avatar-upload"
                                className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-yellow-400 hover:bg-yellow-500 flex items-center justify-center cursor-pointer shadow-lg transition-colors"
                            >
                                <Camera className="w-5 h-5 text-black" />
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                    disabled={isLoading}
                                />
                            </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Cliquez sur l'icône pour changer votre photo
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-5">
                        {/* Prénom */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">
                                Prénom
                            </label>
                            <Input
                                {...register('firstName', {
                                    required: 'Le prénom est requis',
                                    minLength: { value: 2, message: 'Minimum 2 caractères' }
                                })}
                                className="h-12 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-yellow-400 rounded-xl"
                                placeholder="Jean"
                                disabled={isLoading}
                            />
                            {errors.firstName && (
                                <p className="text-xs text-red-400">{errors.firstName.message}</p>
                            )}
                        </div>

                        {/* Nom */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">
                                Nom
                            </label>
                            <Input
                                {...register('lastName', {
                                    required: 'Le nom est requis',
                                    minLength: { value: 2, message: 'Minimum 2 caractères' }
                                })}
                                className="h-12 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-yellow-400 rounded-xl"
                                placeholder="Dupont"
                                disabled={isLoading}
                            />
                            {errors.lastName && (
                                <p className="text-xs text-red-400">{errors.lastName.message}</p>
                            )}
                        </div>

                        {/* Téléphone */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">
                                Téléphone
                            </label>
                            <Input
                                {...register('phone', {
                                    required: 'Le téléphone est requis',
                                    pattern: {
                                        value: /^(\+33|0)[1-9](\d{2}){4}$/,
                                        message: 'Format invalide (ex: +33612345678)'
                                    }
                                })}
                                type="tel"
                                className="h-12 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-yellow-400 rounded-xl"
                                placeholder="+33 6 12 34 56 78"
                                disabled={isLoading}
                            />
                            {errors.phone && (
                                <p className="text-xs text-red-400">{errors.phone.message}</p>
                            )}
                        </div>

                        {/* Email (Read-only) */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">
                                Email
                            </label>
                            <Input
                                {...register('email')}
                                type="email"
                                className="h-12 bg-slate-800 border-slate-700 text-gray-400 cursor-not-allowed opacity-50 rounded-xl"
                                readOnly
                                disabled
                            />
                            <p className="text-xs text-gray-500">
                                L'email ne peut pas être modifié pour des raisons de sécurité
                            </p>
                        </div>
                    </div>
                </form>
            </main>

            {/* Fixed Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-4 safe-bottom">
                <div className="max-w-lg mx-auto grid grid-cols-2 gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="rounded-full border-slate-700 text-white hover:bg-slate-800 h-14"
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        size="lg"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isLoading}
                        className="rounded-full bg-[#FCD34D] hover:bg-yellow-500 text-slate-950 font-bold h-14"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Enregistrement...
                            </>
                        ) : (
                            'Enregistrer'
                        )}
                    </Button>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
