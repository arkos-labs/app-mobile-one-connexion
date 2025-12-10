import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, Save, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Vehicle {
    id: string;
    brand: string;
    model: string;
    licensePlate: string;
    color: string;
    type: string;
    imageUrl?: string;
}

const VEHICLE_TYPES = [
    { value: 'scooter', label: 'Scooter' },
    { value: 'moto', label: 'Moto' },
    { value: 'voiture', label: 'Voiture' },
];

export default function EditVehicle() {
    const navigate = useNavigate();
    const { vehicleId } = useParams<{ vehicleId: string }>();
    const { toast } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        loadVehicle();

        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [vehicleId]);

    const loadVehicle = async () => {
        setLoading(true);

        // In production: Load from Supabase
        // const { data, error } = await supabase
        //   .from('vehicles')
        //   .select('*')
        //   .eq('id', vehicleId)
        //   .single();
        //
        // if (error) {
        //   toast({ title: 'Erreur', description: 'Impossible de charger le véhicule' });
        //   navigate('/admin-hub');
        //   return;
        // }
        //
        // setVehicle(data);

        // Demo data
        const demoVehicle: Vehicle = {
            id: vehicleId || '1',
            brand: 'Peugeot',
            model: '308',
            licensePlate: 'AB-123-CD',
            color: 'Noir',
            type: 'voiture',
            imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=600&fit=crop',
        };

        setVehicle(demoVehicle);
        setLoading(false);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast({
                title: 'Erreur',
                description: 'L\'image ne doit pas dépasser 10MB',
                variant: 'destructive',
            });
            return;
        }

        setSelectedImage(file);

        // Create preview
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        const newPreviewUrl = URL.createObjectURL(file);
        setPreviewUrl(newPreviewUrl);
    };

    const uploadImage = async (file: File): Promise<string> => {
        // In production: Upload to Supabase Storage
        // const fileExt = file.name.split('.').pop();
        // const fileName = `${vehicle?.id}/vehicle.${fileExt}`;
        //
        // const { data, error } = await supabase.storage
        //   .from('vehicles')
        //   .upload(fileName, file, { upsert: true });
        //
        // if (error) throw error;
        //
        // const { data: { publicUrl } } = supabase.storage
        //   .from('vehicles')
        //   .getPublicUrl(fileName);
        //
        // return publicUrl;

        // Demo: Return preview URL
        return URL.createObjectURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vehicle) return;

        setSaving(true);

        try {
            let imageUrl = vehicle.imageUrl;

            // Upload new image if selected
            if (selectedImage) {
                imageUrl = await uploadImage(selectedImage);
            }

            // Update vehicle in database
            // In production:
            // const { error } = await supabase
            //   .from('vehicles')
            //   .update({
            //     brand: vehicle.brand,
            //     model: vehicle.model,
            //     license_plate: vehicle.licensePlate,
            //     color: vehicle.color,
            //     type: vehicle.type,
            //     image_url: imageUrl,
            //     updated_at: new Date().toISOString(),
            //   })
            //   .eq('id', vehicle.id);
            //
            // if (error) throw error;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast({
                title: 'Véhicule mis à jour !',
                description: 'Les modifications ont été enregistrées',
            });

            // Navigate back
            setTimeout(() => {
                navigate('/admin-hub');
            }, 1000);

        } catch (error) {
            console.error('Error updating vehicle:', error);
            toast({
                title: 'Erreur',
                description: 'Une erreur est survenue lors de la sauvegarde',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: keyof Vehicle, value: string) => {
        if (!vehicle) return;

        // Auto-uppercase for license plate
        if (field === 'licensePlate') {
            value = value.toUpperCase();
        }

        setVehicle({ ...vehicle, [field]: value });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Chargement...</p>
                </div>
            </div>
        );
    }

    if (!vehicle) {
        return null;
    }

    const displayImageUrl = previewUrl || vehicle.imageUrl;

    return (
        <div className="min-h-screen bg-slate-950 pb-24">
            <Header />

            <main className="px-4 py-6 max-w-lg mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Modifier mon véhicule</h1>
                    <p className="text-slate-400 text-sm">
                        Mettez à jour les informations de votre véhicule
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Photo Section */}
                    <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                        <CardContent className="p-0">
                            <div className="relative h-64 w-full">
                                {displayImageUrl ? (
                                    <img
                                        src={displayImageUrl}
                                        alt="Véhicule"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                        <Camera className="w-12 h-12 text-slate-600" />
                                    </div>
                                )}

                                {/* Change Photo Button */}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <input
                                        type="file"
                                        id="vehicle-photo"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageSelect}
                                        disabled={saving}
                                    />
                                    <label
                                        htmlFor="vehicle-photo"
                                        className="cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-lg flex items-center gap-2"
                                    >
                                        <Camera className="w-5 h-5" />
                                        Changer la photo
                                    </label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Form Fields */}
                    <Card className="bg-slate-900 border-slate-800">
                        <CardContent className="p-4 space-y-4">
                            {/* Brand */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                    Marque *
                                </label>
                                <Input
                                    value={vehicle.brand}
                                    onChange={(e) => handleChange('brand', e.target.value)}
                                    placeholder="Ex: Peugeot, Yamaha..."
                                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                                    required
                                    disabled={saving}
                                />
                            </div>

                            {/* Model */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                    Modèle *
                                </label>
                                <Input
                                    value={vehicle.model}
                                    onChange={(e) => handleChange('model', e.target.value)}
                                    placeholder="Ex: 308, XMAX 300..."
                                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                                    required
                                    disabled={saving}
                                />
                            </div>

                            {/* License Plate */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                    Immatriculation *
                                </label>
                                <Input
                                    value={vehicle.licensePlate}
                                    onChange={(e) => handleChange('licensePlate', e.target.value)}
                                    placeholder="Ex: AB-123-CD"
                                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 uppercase"
                                    required
                                    disabled={saving}
                                    maxLength={20}
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Sera automatiquement converti en majuscules
                                </p>
                            </div>

                            {/* Color */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                    Couleur *
                                </label>
                                <Input
                                    value={vehicle.color}
                                    onChange={(e) => handleChange('color', e.target.value)}
                                    placeholder="Ex: Noir, Blanc, Rouge..."
                                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                                    required
                                    disabled={saving}
                                />
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                    Type de véhicule *
                                </label>
                                <Select
                                    value={vehicle.type}
                                    onValueChange={(value) => handleChange('type', value)}
                                    disabled={saving}
                                >
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                        <SelectValue placeholder="Sélectionnez un type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700">
                                        {VEHICLE_TYPES.map((type) => (
                                            <SelectItem
                                                key={type.value}
                                                value={type.value}
                                                className="text-white hover:bg-slate-700"
                                            >
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Save Button */}
                    <Button
                        type="submit"
                        disabled={saving}
                        className="w-full h-14 bg-[#FCD34D] hover:bg-[#FCD34D]/90 text-black font-bold text-base"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Enregistrement en cours...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                Enregistrer les modifications
                            </>
                        )}
                    </Button>
                </form>
            </main>

            <BottomNav />
        </div>
    );
}
