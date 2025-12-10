import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, FileText, Plus, ChevronRight, AlertCircle, IdCard, Shield, Edit } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Tab = 'vehicles' | 'documents';
type DocumentStatus = 'validated' | 'pending' | 'rejected' | 'missing';

interface Vehicle {
    id: string;
    brand: string;
    model: string;
    licensePlate: string;
    color: string;
    year: number;
    imageUrl?: string;
}

interface Document {
    id: string;
    type: string;
    name: string;
    status: DocumentStatus;
    expiryDate?: string;
}

// Demo: Un seul véhicule (ou null si aucun)
const DEMO_VEHICLE: Vehicle | null = {
    id: '1',
    brand: 'Peugeot',
    model: '308',
    licensePlate: 'AB-123-CD',
    color: 'Noir',
    year: 2020,
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=300&fit=crop',
};

// Demo: 5 documents obligatoires (ajout de Kbis)
const DEMO_DOCUMENTS: Document[] = [
    { id: 'driving_license', type: 'driving_license', name: 'Permis de conduire', status: 'validated', expiryDate: '2025-12-31' },
    { id: 'identity_card', type: 'identity_card', name: 'Carte d\'identité / Passeport', status: 'pending' },
    { id: 'insurance', type: 'insurance', name: 'Assurance RC Pro', status: 'missing' },
    { id: 'vehicle_registration', type: 'vehicle_registration', name: 'Carte Grise', status: 'missing' },
    { id: 'kbis', type: 'kbis', name: 'Extrait Kbis', status: 'missing' },
];

const STATUS_CONFIG = {
    validated: { label: 'Validé', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: '✅' },
    pending: { label: 'En attente', className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: '⏳' },
    rejected: { label: 'Rejeté', className: 'bg-red-500/10 text-red-400 border-red-500/20', icon: '❌' },
    missing: { label: 'Manquant', className: 'bg-slate-500/10 text-slate-400 border-slate-500/20', icon: '📄' },
};

export default function AdminHub() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('vehicles');
    const [vehicle] = useState<Vehicle | null>(DEMO_VEHICLE);

    const validatedDocs = DEMO_DOCUMENTS.filter(d => d.status === 'validated').length;
    const totalDocs = DEMO_DOCUMENTS.length;

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-slate-950">
            <Header />

            <main className="flex-1 overflow-y-auto px-4 py-6 max-w-lg mx-auto space-y-6 w-full pb-24 scrollbar-hide">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Mon Dossier Pro</h1>
                    <p className="text-slate-400 text-sm">
                        Véhicules, Permis, Assurance
                    </p>
                </div>

                {/* Toggle / Segmented Control */}
                <Card className="bg-[#0F172A] border border-white/10 shadow-sm">
                    <CardContent className="p-2">
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                className={cn(
                                    "flex-1 h-11 transition-all rounded-lg font-medium",
                                    activeTab === 'vehicles'
                                        ? "bg-[#FCD34D] text-slate-950 shadow-sm"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                                onClick={() => setActiveTab('vehicles')}
                            >
                                <Car className="w-5 h-5 mr-2" />
                                Véhicule
                            </Button>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "flex-1 h-11 transition-all rounded-lg font-medium",
                                    activeTab === 'documents'
                                        ? "bg-[#FCD34D] text-slate-950 shadow-sm"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                                onClick={() => setActiveTab('documents')}
                            >
                                <FileText className="w-5 h-5 mr-2" />
                                Documents
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Content: Vehicle (Single) */}
                {activeTab === 'vehicles' && (
                    <div className="space-y-4">
                        {vehicle ? (
                            <>
                                {/* Active Vehicle Card */}
                                <Card className="bg-[#0F172A] border border-white/10 overflow-hidden shadow-sm">
                                    <CardContent className="p-0">
                                        {/* Vehicle Image */}
                                        {vehicle.imageUrl && (
                                            <div className="relative h-48 w-full overflow-hidden">
                                                <img
                                                    src={vehicle.imageUrl}
                                                    alt={`${vehicle.brand} ${vehicle.model}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent opacity-60" />
                                                <div className="absolute top-3 right-3">
                                                    <Badge className="bg-emerald-500 text-white border-0 shadow-lg">
                                                        Véhicule Actif
                                                    </Badge>
                                                </div>
                                            </div>
                                        )}

                                        {/* Vehicle Info */}
                                        <div className="p-5">
                                            <div className="flex items-start gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-[#FCD34D]/10 flex items-center justify-center flex-shrink-0 border border-[#FCD34D]/20">
                                                    <Car className="w-7 h-7 text-[#FCD34D]" />
                                                </div>

                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                                                        {vehicle.brand} {vehicle.model}
                                                    </h3>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex items-center justify-between p-2 rounded-lg bg-[#1E293B] border border-white/5">
                                                            <span className="text-slate-400">Immatriculation</span>
                                                            <span className="text-white font-mono font-medium">{vehicle.licensePlate}</span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="flex flex-col p-2 rounded-lg bg-[#1E293B] border border-white/5">
                                                                <span className="text-[10px] text-slate-500 uppercase">Couleur</span>
                                                                <span className="text-white font-medium">{vehicle.color}</span>
                                                            </div>
                                                            <div className="flex flex-col p-2 rounded-lg bg-[#1E293B] border border-white/5">
                                                                <span className="text-[10px] text-slate-500 uppercase">Année</span>
                                                                <span className="text-white font-medium">{vehicle.year}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Modify/Replace Button */}
                                <Button
                                    onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}
                                    className="w-full h-14 rounded-xl border border-slate-700 bg-transparent text-white hover:bg-slate-800 font-medium transition-all"
                                >
                                    <Edit className="w-5 h-5 mr-2 text-slate-400" />
                                    Modifier / Remplacer mon véhicule
                                </Button>
                            </>
                        ) : (
                            /* No Vehicle - Empty State */
                            <Card className="bg-[#0F172A] border border-white/10 border-dashed">
                                <CardContent className="p-12">
                                    <div className="text-center space-y-6">
                                        <div className="w-20 h-20 rounded-full bg-[#1E293B] flex items-center justify-center mx-auto border border-white/5">
                                            <Car className="w-10 h-10 text-slate-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-2">
                                                Aucun véhicule enregistré
                                            </h3>
                                            <p className="text-sm text-slate-400 max-w-xs mx-auto">
                                                Ajoutez votre véhicule pour commencer à accepter des courses
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() => navigate('/vehicles/add')}
                                            className="w-full h-14 bg-[#FCD34D] hover:bg-[#FCD34D]/90 text-slate-950 font-bold text-base rounded-xl shadow-lg"
                                        >
                                            <Plus className="w-6 h-6 mr-2" />
                                            Ajouter mon véhicule
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Info Card */}
                        <Card className="bg-[#0F172A] border border-white/10">
                            <CardContent className="p-4">
                                <p className="text-xs text-slate-400 text-center leading-relaxed">
                                    💡 Vous ne pouvez avoir qu'un seul véhicule actif à la fois. Pour changer de véhicule, modifiez les informations ci-dessus.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Content: Documents */}
                {activeTab === 'documents' && (
                    <div className="space-y-4">
                        {/* Progress Card */}
                        <Card className="bg-[#0F172A] border border-white/10 shadow-sm">
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-slate-400">Progression du dossier</span>
                                    <span className="text-sm font-bold text-white">
                                        {validatedDocs}/{totalDocs} validés
                                    </span>
                                </div>
                                <div className="w-full h-2.5 bg-[#1E293B] rounded-full overflow-hidden border border-white/5">
                                    <div
                                        className="h-full bg-[#FCD34D] transition-all duration-500 ease-out shadow-[0_0_10px_#FCD34D]"
                                        style={{ width: `${(validatedDocs / totalDocs) * 100}%` }}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Alert if documents missing */}
                        {validatedDocs < totalDocs && (
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
                                Documents Obligatoires ({totalDocs})
                            </h2>

                            {DEMO_DOCUMENTS.map((document) => {
                                const statusConfig = STATUS_CONFIG[document.status];
                                const Icon = document.type === 'driving_license' || document.type === 'identity_card'
                                    ? IdCard
                                    : document.type === 'insurance'
                                        ? Shield
                                        : FileText;

                                return (
                                    <Card
                                        key={document.id}
                                        className="bg-[#0F172A] border border-white/10 cursor-pointer hover:bg-[#1E293B] hover:border-white/20 transition-all duration-200 group shadow-sm"
                                        onClick={() => navigate(`/documents/upload/${document.id}`)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-4">
                                                {/* Icon */}
                                                <div className="w-12 h-12 rounded-xl bg-[#FCD34D]/10 flex items-center justify-center flex-shrink-0 border border-[#FCD34D]/20 group-hover:bg-[#FCD34D]/20 transition-colors">
                                                    <Icon className="w-6 h-6 text-[#FCD34D]" />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-white mb-1 group-hover:text-[#FCD34D] transition-colors">
                                                        {document.name}
                                                    </h3>
                                                    {document.expiryDate && (
                                                        <p className="text-xs text-slate-400">
                                                            Expire le {new Date(document.expiryDate).toLocaleDateString('fr-FR')}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Status Badge */}
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    <Badge variant="outline" className={cn(statusConfig.className, "h-8 px-3")}>
                                                        {statusConfig.icon} <span className="ml-1.5">{statusConfig.label}</span>
                                                    </Badge>
                                                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>

            <BottomNav />
        </div>
    );
}
