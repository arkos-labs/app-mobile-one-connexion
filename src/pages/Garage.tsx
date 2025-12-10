import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, FileText, Plus, ChevronRight, AlertCircle, IdCard, Shield } from 'lucide-react';
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
    isActive: boolean;
}

interface Document {
    id: string;
    type: string;
    name: string;
    status: DocumentStatus;
    expiryDate?: string;
}

const DEMO_VEHICLES: Vehicle[] = [
    {
        id: '1',
        brand: 'Peugeot',
        model: '308',
        licensePlate: 'AB-123-CD',
        color: 'Noir',
        year: 2020,
        isActive: true,
    },
    {
        id: '2',
        brand: 'Renault',
        model: 'Clio',
        licensePlate: 'EF-456-GH',
        color: 'Blanc',
        year: 2019,
        isActive: false,
    },
];

const DEMO_DOCUMENTS: Document[] = [
    { id: 'driving_license', type: 'driving_license', name: 'Permis de conduire', status: 'validated', expiryDate: '2025-12-31' },
    { id: 'identity_card', type: 'identity_card', name: 'Carte d\'identité / Passeport', status: 'pending' },
    { id: 'insurance', type: 'insurance', name: 'Assurance RC Pro', status: 'missing' },
    { id: 'vehicle_registration', type: 'vehicle_registration', name: 'Carte Grise', status: 'missing' },
];

const STATUS_CONFIG = {
    validated: { label: 'Validé', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: '✅' },
    pending: { label: 'En attente', className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: '⏳' },
    rejected: { label: 'Rejeté', className: 'bg-red-500/10 text-red-400 border-red-500/20', icon: '❌' },
    missing: { label: 'Manquant', className: 'bg-slate-500/10 text-slate-400 border-slate-500/20', icon: '📄' },
};

export default function Garage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('vehicles');

    const validatedDocs = DEMO_DOCUMENTS.filter(d => d.status === 'validated').length;
    const totalDocs = DEMO_DOCUMENTS.length;

    return (
        <div className="min-h-screen bg-slate-950 pb-24">
            <Header />

            <main className="px-4 py-6 max-w-lg mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Mon Dossier Pro</h1>
                    <p className="text-slate-400 text-sm">
                        Gérez vos véhicules et documents
                    </p>
                </div>

                {/* Toggle / Segmented Control */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-2">
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                className={cn(
                                    "flex-1 h-10 transition-all",
                                    activeTab === 'vehicles'
                                        ? "bg-yellow-400 text-slate-950 hover:bg-yellow-500 font-semibold"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                )}
                                onClick={() => setActiveTab('vehicles')}
                            >
                                <Car className="w-4 h-4 mr-2" />
                                Véhicules
                            </Button>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "flex-1 h-10 transition-all",
                                    activeTab === 'documents'
                                        ? "bg-yellow-400 text-slate-950 hover:bg-yellow-500 font-semibold"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                )}
                                onClick={() => setActiveTab('documents')}
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                Documents
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Content: Vehicles */}
                {activeTab === 'vehicles' && (
                    <div className="space-y-4">
                        {/* Add Vehicle Button */}
                        <Button
                            onClick={() => navigate('/vehicles/add')}
                            className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-semibold"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Ajouter un véhicule
                        </Button>

                        {/* Vehicles List */}
                        <div className="space-y-3">
                            <h2 className="text-xs tracking-widest font-bold text-slate-400 uppercase">
                                Mes Véhicules ({DEMO_VEHICLES.length})
                            </h2>

                            {DEMO_VEHICLES.map((vehicle) => (
                                <Card
                                    key={vehicle.id}
                                    className="bg-slate-900 border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors"
                                    onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            {/* Icon */}
                                            <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
                                                <Car className="w-6 h-6 text-yellow-400" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-white">
                                                        {vehicle.brand} {vehicle.model}
                                                    </h3>
                                                    {vehicle.isActive && (
                                                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                                                            Actif
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-400">
                                                    {vehicle.licensePlate} • {vehicle.color} • {vehicle.year}
                                                </p>
                                            </div>

                                            {/* Arrow */}
                                            <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Content: Documents */}
                {activeTab === 'documents' && (
                    <div className="space-y-4">
                        {/* Progress Card */}
                        <Card className="bg-slate-900 border-slate-800">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-slate-400">Progression</span>
                                    <span className="text-sm font-semibold text-white">
                                        {validatedDocs}/{totalDocs} validés
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-400 transition-all duration-300"
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
                                                Veuillez uploader tous les documents requis
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
                                        className="bg-slate-900 border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors"
                                        onClick={() => navigate(`/documents/upload/${document.id}`)}
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
                                                        <p className="text-xs text-slate-400">
                                                            Expire le {new Date(document.expiryDate).toLocaleDateString('fr-FR')}
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
                            })}
                        </div>
                    </div>
                )}
            </main>

            <BottomNav />
        </div>
    );
}
