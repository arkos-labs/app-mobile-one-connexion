import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, IdCard, Shield, Car, ChevronRight, AlertCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';

type DocumentStatus = 'validated' | 'pending' | 'rejected' | 'missing';

interface Document {
    id: string;
    type: string;
    name: string;
    status: DocumentStatus;
    expiryDate?: string;
    uploadedAt?: string;
}

const DOCUMENT_TYPES = [
    { id: 'driving_license', name: 'Permis de conduire', icon: IdCard, required: true },
    { id: 'identity_card', name: 'Carte d\'identité / Passeport', icon: IdCard, required: true },
    { id: 'insurance', name: 'Assurance RC Pro', icon: Shield, required: true },
    { id: 'vehicle_registration', name: 'Carte Grise', icon: Car, required: true },
];

const STATUS_CONFIG = {
    validated: {
        label: 'Validé',
        className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        icon: '✅',
    },
    pending: {
        label: 'En attente',
        className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        icon: '⏳',
    },
    rejected: {
        label: 'Rejeté',
        className: 'bg-red-500/10 text-red-400 border-red-500/20',
        icon: '❌',
    },
    missing: {
        label: 'Manquant',
        className: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        icon: '📄',
    },
};

export default function Documents() {
    const navigate = useNavigate();
    const { driver } = useAuthStore();

    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDocuments();
    }, [driver?.id]);

    const loadDocuments = async () => {
        setLoading(true);

        // Simulate loading from Supabase
        // In production:
        // const { data, error } = await supabase
        //   .from('driver_documents')
        //   .select('*')
        //   .eq('driver_id', driver?.id);

        // Demo data
        const demoDocuments: Document[] = DOCUMENT_TYPES.map((type, index) => ({
            id: type.id,
            type: type.id,
            name: type.name,
            status: index === 0 ? 'validated' : index === 1 ? 'pending' : 'missing',
            expiryDate: index === 0 ? '2025-12-31' : undefined,
            uploadedAt: index === 0 || index === 1 ? new Date().toISOString() : undefined,
        }));

        setDocuments(demoDocuments);
        setLoading(false);
    };

    const handleDocumentClick = (document: Document) => {
        navigate(`/documents/upload/${document.id}`);
    };

    const isExpiringSoon = (expiryDate?: string) => {
        if (!expiryDate) return false;
        const expiry = new Date(expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    };

    const getDocumentIcon = (typeId: string) => {
        const type = DOCUMENT_TYPES.find(t => t.id === typeId);
        return type?.icon || FileText;
    };

    const validatedCount = documents.filter(d => d.status === 'validated').length;
    const totalCount = documents.length;

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-slate-950">
            <Header />

            <main className="flex-1 overflow-y-auto px-4 py-6 max-w-lg mx-auto space-y-6 w-full pb-24 scrollbar-hide">
                {/* Header Section */}
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Mes Documents</h1>
                    <p className="text-slate-400 text-sm">
                        Assurez-vous que tous vos documents sont à jour
                    </p>
                </div>

                {/* Progress Card */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-400">Progression</span>
                            <span className="text-sm font-semibold text-white">
                                {validatedCount}/{totalCount} validés
                            </span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-400 transition-all duration-300"
                                style={{ width: `${(validatedCount / totalCount) * 100}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Alert if documents missing */}
                {validatedCount < totalCount && (
                    <Card className="bg-yellow-500/10 border-yellow-500/20">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-medium text-yellow-400 mb-1">
                                        Documents manquants
                                    </h3>
                                    <p className="text-sm text-yellow-400/80">
                                        Veuillez uploader tous les documents requis pour activer votre compte
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Documents List */}
                <div className="space-y-3">
                    <h2 className="text-xs tracking-widest font-bold text-slate-400 uppercase">
                        Documents Obligatoires
                    </h2>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        documents.map((document) => {
                            const Icon = getDocumentIcon(document.type);
                            const statusConfig = STATUS_CONFIG[document.status];
                            const expiringSoon = isExpiringSoon(document.expiryDate);

                            return (
                                <Card
                                    key={document.id}
                                    className="bg-slate-900 border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors"
                                    onClick={() => handleDocumentClick(document)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            {/* Icon */}
                                            <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-6 h-6 text-yellow-400" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-white mb-1">
                                                    {document.name}
                                                </h3>
                                                {document.expiryDate && (
                                                    <p className={`text-xs ${expiringSoon ? 'text-orange-400' : 'text-slate-400'}`}>
                                                        {expiringSoon && '⚠️ '}
                                                        Expire le {new Date(document.expiryDate).toLocaleDateString('fr-FR')}
                                                    </p>
                                                )}
                                                {!document.expiryDate && document.uploadedAt && (
                                                    <p className="text-xs text-slate-400">
                                                        Uploadé le {new Date(document.uploadedAt).toLocaleDateString('fr-FR')}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Status Badge */}
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <Badge variant="outline" className={statusConfig.className}>
                                                    {statusConfig.icon} {statusConfig.label}
                                                </Badge>
                                                <ChevronRight className="w-5 h-5 text-slate-400" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>

                {/* Info Footer */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4">
                        <p className="text-xs text-slate-400 text-center">
                            💡 Les documents sont vérifiés sous 24-48h. Assurez-vous que les photos sont claires et lisibles.
                        </p>
                    </CardContent>
                </Card>
            </main>

            <BottomNav />
        </div>
    );
}
