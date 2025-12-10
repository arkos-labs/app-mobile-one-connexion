import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Phone, 
  Navigation, 
  MapPin, 
  Clock, 
  Package, 
  User,
  CheckCircle,
  Camera,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';

// Demo order detail
const DEMO_ORDER: Order = {
  id: 'order-001',
  reference: 'OC-2024-0042',
  pickup_address: '15 Rue de la Paix, 75002 Paris',
  delivery_address: '28 Avenue des Champs-Élysées, 75008 Paris',
  pickup_lat: 48.8687,
  pickup_lng: 2.3293,
  delivery_lat: 48.8698,
  delivery_lng: 2.3075,
  delivery_type: 'Express',
  price: 18.50,
  status: 'dispatched',
  created_at: new Date().toISOString(),
  client_name: 'Sophie Martin',
  client_phone: '+33 6 12 34 56 78',
  package_description: 'Documents urgents - Enveloppe A4',
  notes: 'Interphone code 1234. Laisser chez le gardien si absent.',
};

const statusConfig: Record<OrderStatus, { label: string; variant: 'pending' | 'info' | 'warning' | 'success' | 'destructive' }> = {
  pending_acceptance: { label: 'En attente', variant: 'pending' },
  accepted: { label: 'Acceptée', variant: 'info' },
  dispatched: { label: 'En route vers pickup', variant: 'warning' },
  in_progress: { label: 'Colis récupéré', variant: 'warning' },
  delivered: { label: 'Livrée', variant: 'success' },
  cancelled: { label: 'Annulée', variant: 'destructive' },
};

export default function OrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  
  const [order, setOrder] = useState<Order>(DEMO_ORDER);
  const [isLoading, setIsLoading] = useState(false);
  
  const statusInfo = statusConfig[order.status];
  
  const handleCall = () => {
    if (order.client_phone) {
      window.open(`tel:${order.client_phone}`, '_self');
    } else {
      toast({
        title: 'Numéro non disponible',
        description: 'Le numéro du client n\'est pas renseigné',
        variant: 'destructive',
      });
    }
  };
  
  const handleOpenGPS = (type: 'pickup' | 'delivery') => {
    const lat = type === 'pickup' ? order.pickup_lat : order.delivery_lat;
    const lng = type === 'pickup' ? order.pickup_lng : order.delivery_lng;
    const address = type === 'pickup' ? order.pickup_address : order.delivery_address;
    
    // Try to open in native maps app
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };
  
  const handleAcceptOrder = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOrder({ ...order, status: 'accepted', accepted_at: new Date().toISOString() });
    toast({
      title: 'Course acceptée',
      description: 'En attente du dispatch admin',
    });
    setIsLoading(false);
  };
  
  const handlePickupConfirm = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOrder({ ...order, status: 'in_progress' });
    toast({
      title: 'Colis récupéré',
      description: 'Dirigez-vous vers l\'adresse de livraison',
    });
    setIsLoading(false);
  };
  
  const handleDeliveryComplete = () => {
    navigate(`/order/${order.id}/proof`);
  };
  
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border safe-top">
        <div className="flex items-center gap-4 h-14 px-4">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">{order.reference}</h1>
          </div>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
      </header>
      
      <main className="px-4 py-4 space-y-4 max-w-lg mx-auto">
        {/* Map Placeholder */}
        <Card className="overflow-hidden">
          <div className="h-48 bg-muted flex items-center justify-center relative">
            <div className="text-center">
              <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Carte de l'itinéraire
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                (Intégration Mapbox requise)
              </p>
            </div>
            
            {/* Quick GPS buttons overlay */}
            <div className="absolute bottom-3 right-3 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleOpenGPS('pickup')}
              >
                <Navigation className="w-4 h-4 mr-1" />
                Pickup
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleOpenGPS('delivery')}
              >
                <Navigation className="w-4 h-4 mr-1" />
                Livraison
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Addresses */}
        <Card>
          <CardContent className="p-4 space-y-4">
            {/* Pickup */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-success border-2 border-card shadow" />
                <div className="w-0.5 h-full bg-border flex-1 my-1" />
              </div>
              <div className="flex-1 pb-4">
                <p className="text-xs font-medium text-success uppercase tracking-wide">Récupération</p>
                <p className="text-sm font-medium text-foreground mt-1">{order.pickup_address}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-8 text-primary"
                  onClick={() => handleOpenGPS('pickup')}
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  Ouvrir dans Maps
                </Button>
              </div>
            </div>
            
            {/* Delivery */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-destructive border-2 border-card shadow" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-destructive uppercase tracking-wide">Livraison</p>
                <p className="text-sm font-medium text-foreground mt-1">{order.delivery_address}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-8 text-primary"
                  onClick={() => handleOpenGPS('delivery')}
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  Ouvrir dans Maps
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Order Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="text-sm">Client</span>
              </div>
              <span className="text-sm font-medium text-foreground">{order.client_name}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Créée à</span>
              </div>
              <span className="text-sm font-medium text-foreground">{formatTime(order.created_at)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="w-4 h-4" />
                <span className="text-sm">Type</span>
              </div>
              <Badge variant="outline">{order.delivery_type}</Badge>
            </div>
            
            {order.package_description && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Description du colis</p>
                <p className="text-sm text-foreground">{order.package_description}</p>
              </div>
            )}
            
            {order.notes && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Notes</p>
                <p className="text-sm text-foreground">{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Price */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Montant de la course</span>
            <span className="text-2xl font-bold text-primary">{order.price.toFixed(2)}€</span>
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={handleCall}
            >
              <Phone className="w-5 h-5" />
              Appeler
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
            >
              <MessageSquare className="w-5 h-5" />
              Message
            </Button>
          </div>
        )}
        
        {/* Action Buttons based on status */}
        <div className="pt-2">
          {order.status === 'pending_acceptance' && (
            <Button
              size="xl"
              className="w-full"
              onClick={handleAcceptOrder}
              disabled={isLoading}
            >
              <CheckCircle className="w-6 h-6" />
              Accepter la course
            </Button>
          )}
          
          {order.status === 'accepted' && (
            <div className="text-center p-4 bg-info/10 rounded-xl border border-info/20">
              <p className="text-info font-medium">En attente de dispatch</p>
              <p className="text-sm text-muted-foreground mt-1">
                L'administrateur va bientôt vous assigner cette course
              </p>
            </div>
          )}
          
          {order.status === 'dispatched' && (
            <Button
              size="xl"
              className="w-full"
              variant="success"
              onClick={handlePickupConfirm}
              disabled={isLoading}
            >
              <Package className="w-6 h-6" />
              J'ai récupéré le colis
            </Button>
          )}
          
          {order.status === 'in_progress' && (
            <Button
              size="xl"
              className="w-full"
              variant="accent"
              onClick={handleDeliveryComplete}
              disabled={isLoading}
            >
              <Camera className="w-6 h-6" />
              Marquer comme livré
            </Button>
          )}
          
          {order.status === 'delivered' && (
            <div className="text-center p-4 bg-success/10 rounded-xl border border-success/20">
              <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="text-success font-medium">Course livrée</p>
              <p className="text-sm text-muted-foreground mt-1">
                Livrée le {order.delivered_at && new Date(order.delivered_at).toLocaleString('fr-FR')}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
