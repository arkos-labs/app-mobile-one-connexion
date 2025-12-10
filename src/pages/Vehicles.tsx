import { useState } from 'react';
import { Plus, Car, Bike, FileText, AlertTriangle, Check, Clock, ChevronRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { Vehicle, DriverDocument, VehicleType, DocumentType } from '@/types';

const vehicleIcons: Record<VehicleType, typeof Car> = {
  scooter: Bike,
  moto: Bike,
  voiture: Car,
  velo: Bike,
};

const vehicleTypeLabels: Record<VehicleType, string> = {
  scooter: 'Scooter',
  moto: 'Moto',
  voiture: 'Voiture',
  velo: 'Vélo',
};

const documentTypeLabels: Record<DocumentType, string> = {
  license: 'Permis de conduire',
  registration: 'Carte grise',
  insurance: 'Assurance',
  identity: 'Pièce d\'identité',
};

// Demo data
const DEMO_VEHICLES: Vehicle[] = [
  {
    id: 'vehicle-001',
    driver_id: 'demo-driver-001',
    brand: 'Yamaha',
    model: 'XMAX 300',
    plate_number: 'AB-123-CD',
    type: 'scooter',
    color: 'Noir',
    status: 'active',
    is_primary: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'vehicle-002',
    driver_id: 'demo-driver-001',
    brand: 'Peugeot',
    model: 'Django 125',
    plate_number: 'EF-456-GH',
    type: 'scooter',
    color: 'Blanc',
    status: 'inactive',
    is_primary: false,
    created_at: new Date().toISOString(),
  },
];

const DEMO_DOCUMENTS: DriverDocument[] = [
  {
    id: 'doc-001',
    driver_id: 'demo-driver-001',
    document_type: 'license',
    file_url: '#',
    expiry_date: '2026-05-15',
    status: 'approved',
    uploaded_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'doc-002',
    driver_id: 'demo-driver-001',
    document_type: 'insurance',
    file_url: '#',
    expiry_date: '2025-01-20',
    status: 'approved',
    uploaded_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'doc-003',
    driver_id: 'demo-driver-001',
    document_type: 'registration',
    file_url: '#',
    status: 'pending',
    uploaded_at: '2024-12-01T10:00:00Z',
  },
  {
    id: 'doc-004',
    driver_id: 'demo-driver-001',
    document_type: 'identity',
    file_url: '#',
    expiry_date: '2024-06-30',
    status: 'expired',
    uploaded_at: '2023-01-15T10:00:00Z',
  },
];

export default function Vehicles() {
  const [activeTab, setActiveTab] = useState('vehicles');

  const getExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return null;

    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 30) return 'expiring';
    return 'valid';
  };

  const expiringDocuments = DEMO_DOCUMENTS.filter(doc => {
    const status = getExpiryStatus(doc.expiry_date);
    return status === 'expired' || status === 'expiring' || doc.status === 'pending';
  });

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Header />

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-lg mx-auto w-full pb-24 scrollbar-hide">
        {/* Alert for expiring documents */}
        {expiringDocuments.length > 0 && (
          <Card className="bg-warning/10 border-warning/30">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {expiringDocuments.length} document(s) à vérifier
                </p>
                <p className="text-xs text-muted-foreground">
                  Certains documents expirent bientôt ou sont en attente
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="vehicles">
              <Car className="w-4 h-4 mr-2" />
              Véhicules
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="w-4 h-4 mr-2" />
              Documents
            </TabsTrigger>
          </TabsList>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles" className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Mes véhicules
              </h2>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>

            <div className="space-y-3">
              {DEMO_VEHICLES.map((vehicle) => {
                const Icon = vehicleIcons[vehicle.type];
                return (
                  <Card key={vehicle.id} variant="interactive">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          vehicle.status === 'active' ? "bg-primary/10" : "bg-muted"
                        )}>
                          <Icon className={cn(
                            "w-6 h-6",
                            vehicle.status === 'active' ? "text-primary" : "text-muted-foreground"
                          )} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">
                              {vehicle.brand} {vehicle.model}
                            </h3>
                            {vehicle.is_primary && (
                              <Badge variant="success" className="text-[10px]">Actif</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.plate_number} • {vehicleTypeLabels[vehicle.type]} {vehicle.color && `• ${vehicle.color}`}
                          </p>
                        </div>

                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Mes documents
              </h2>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Uploader
              </Button>
            </div>

            <div className="space-y-3">
              {DEMO_DOCUMENTS.map((doc) => {
                const expiryStatus = getExpiryStatus(doc.expiry_date);

                let statusBadge;
                if (doc.status === 'pending') {
                  statusBadge = <Badge variant="warning"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
                } else if (doc.status === 'rejected') {
                  statusBadge = <Badge variant="destructive">Rejeté</Badge>;
                } else if (expiryStatus === 'expired' || doc.status === 'expired') {
                  statusBadge = <Badge variant="destructive">Expiré</Badge>;
                } else if (expiryStatus === 'expiring') {
                  statusBadge = <Badge variant="warning"><AlertTriangle className="w-3 h-3 mr-1" />Expire bientôt</Badge>;
                } else {
                  statusBadge = <Badge variant="success"><Check className="w-3 h-3 mr-1" />Valide</Badge>;
                }

                return (
                  <Card key={doc.id} variant="interactive">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                          <FileText className="w-6 h-6 text-muted-foreground" />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">
                            {documentTypeLabels[doc.document_type]}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            {statusBadge}
                            {doc.expiry_date && (
                              <span className="text-xs text-muted-foreground">
                                Exp: {new Date(doc.expiry_date).toLocaleDateString('fr-FR')}
                              </span>
                            )}
                          </div>
                        </div>

                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
}
