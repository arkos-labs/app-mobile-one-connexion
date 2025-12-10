import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, Camera, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';

const DOCUMENT_NAMES: Record<string, string> = {
    driving_license: 'Permis de conduire',
    identity_card: 'Carte d\'identité / Passeport',
    insurance: 'Assurance RC Pro',
    vehicle_registration: 'Carte Grise',
};

export default function DocumentUpload() {
    const navigate = useNavigate();
    const { documentId } = useParams<{ documentId: string }>();
    const { toast } = useToast();
    const { driver } = useAuthStore();

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [expiryDate, setExpiryDate] = useState('');

    const documentName = documentId ? DOCUMENT_NAMES[documentId] : 'Document';

    useEffect(() => {
        loadCurrentDocument();

        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [documentId]);

    const loadCurrentDocument = async () => {
        setLoading(true);

        // Simulate loading from Supabase
        // In production:
        // const { data, error } = await supabase
        //   .from('driver_documents')
        //   .select('*')
        //   .eq('driver_id', driver?.id)
        //   .eq('type', documentId)
        //   .single();

        // if (data?.file_url) {
        //   setCurrentImageUrl(data.file_url);
        //   setExpiryDate(data.expiry_date || '');
        // }

        // Demo: Simulate existing document for driving_license
        if (documentId === 'driving_license') {
            setCurrentImageUrl('https://via.placeholder.com/400x300?text=Permis+de+conduire');
            setExpiryDate('2025-12-31');
        }

        setLoading(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        setSelectedFile(file);

        // Create preview
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        const newPreviewUrl = URL.createObjectURL(file);
        setPreviewUrl(newPreviewUrl);
    };

    const uploadToSupabase = async (file: File): Promise<string> => {
        // Simulate upload to Supabase Storage
        // In production:
        // const fileExt = file.name.split('.').pop();
        // const fileName = `${driver?.id}/${documentId}.${fileExt}`;
        // 
        // const { data, error } = await supabase.storage
        //   .from('documents')
        //   .upload(fileName, file, { upsert: true });
        //
        // if (error) throw error;
        //
        // const { data: { publicUrl } } = supabase.storage
        //   .from('documents')
        //   .getPublicUrl(fileName);
        //
        // return publicUrl;

        // Demo: Simulate upload delay
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(URL.createObjectURL(file));
            }, 2000);
        });
    };

    const saveDocumentRecord = async (fileUrl: string) => {
        // Save to database
        // In production:
        // const { error } = await supabase
        //   .from('driver_documents')
        //   .upsert({
        //     driver_id: driver?.id,
        //     type: documentId,
        //     file_url: fileUrl,
        //     expiry_date: expiryDate || null,
        //     status: 'pending',
        //     uploaded_at: new Date().toISOString(),
        //   }, {
        //     onConflict: 'driver_id,type'
        //   });
        //
        // if (error) throw error;

        // Demo: Just log
        console.log('Document saved:', { fileUrl, expiryDate, status: 'pending' });
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            toast({
                title: 'Erreur',
                description: 'Veuillez sélectionner un fichier',
                variant: 'destructive',
            });
            return;
        }

        setUploading(true);

        try {
            // Upload file to Supabase Storage
            const fileUrl = await uploadToSupabase(selectedFile);

            // Save document record to database
            await saveDocumentRecord(fileUrl);

            toast({
                title: 'Document envoyé !',
                description: 'Votre document a été envoyé pour validation',
            });

            // Wait a bit for the toast to show
            setTimeout(() => {
                navigate('/documents');
            }, 1500);

        } catch (error) {
            console.error('Error uploading document:', error);
            toast({
                title: 'Erreur',
                description: 'Une erreur est survenue lors de l\'upload',
                variant: 'destructive',
            });
        } finally {
            setUploading(false);
        }
    };

    const displayImageUrl = previewUrl || currentImageUrl;

    return (
        <div className="min-h-screen bg-slate-950 pb-24">
            <Header />

            <main className="px-4 py-6 max-w-lg mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">{documentName}</h1>
                    <p className="text-slate-400 text-sm">
                        Uploadez une photo claire et lisible de votre document
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Preview Area */}
                        <Card className="bg-slate-900 border-slate-800">
                            <CardContent className="p-6">
                                {displayImageUrl ? (
                                    <div className="space-y-4">
                                        <img
                                            src={displayImageUrl}
                                            alt={documentName}
                                            className="w-full h-64 object-cover rounded-lg border-2 border-slate-700"
                                        />
                                        {selectedFile && (
                                            <div className="flex items-center gap-2 text-sm text-green-400">
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Nouveau fichier sélectionné</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-slate-700 rounded-lg p-12 text-center">
                                        <Camera className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                                        <p className="text-slate-400 mb-2">Aucun document uploadé</p>
                                        <p className="text-xs text-slate-500">
                                            Appuyez sur le bouton ci-dessous pour ajouter une photo
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Expiry Date (for documents that expire) */}
                        {(documentId === 'driving_license' || documentId === 'identity_card' || documentId === 'insurance') && (
                            <Card className="bg-slate-900 border-slate-800">
                                <CardContent className="p-4">
                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                        Date d'expiration (optionnel)
                                    </label>
                                    <Input
                                        type="date"
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(e.target.value)}
                                        className="bg-slate-800 border-slate-700 text-white"
                                        disabled={uploading}
                                    />
                                    <p className="text-xs text-slate-500 mt-2">
                                        Nous vous rappellerons avant l'expiration
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* File Input */}
                        <div>
                            <input
                                type="file"
                                id="file-upload"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileSelect}
                                disabled={uploading}
                            />
                            <label htmlFor="file-upload">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-14 border-slate-700 text-white hover:bg-slate-800"
                                    disabled={uploading}
                                    asChild
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <Upload className="w-5 h-5" />
                                        Choisir une photo
                                    </span>
                                </Button>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <Button
                            onClick={handleSubmit}
                            disabled={!selectedFile || uploading}
                            className="w-full h-14 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Envoi en cours...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Envoyer pour validation
                                </>
                            )}
                        </Button>

                        {/* Info */}
                        <Card className="bg-slate-900 border-slate-800">
                            <CardContent className="p-4">
                                <h3 className="font-medium text-white mb-2 flex items-center gap-2">
                                    <Upload className="w-4 h-4 text-yellow-400" />
                                    Conseils pour une photo réussie
                                </h3>
                                <ul className="space-y-1 text-xs text-slate-400">
                                    <li>• Assurez-vous que le document est bien éclairé</li>
                                    <li>• Toutes les informations doivent être lisibles</li>
                                    <li>• Évitez les reflets et les ombres</li>
                                    <li>• Le document doit être à plat et complet</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </>
                )}
            </main>

            <BottomNav />
        </div>
    );
}
