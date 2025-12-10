import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Euro, Navigation, ChevronRight, MapPin } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { StatusSwitch } from '@/components/StatusSwitch';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { useLocationStore } from '@/store/locationStore';
import type { DriverStatus, Order } from '@/types';

// Demo next order
const DEMO_NEXT_ORDER: Order = {
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
  package_description: 'Documents urgents',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { driver, setDriver } = useAuthStore();
  const { dailyStats } = useOrderStore();
  const { setTracking, setLocation } = useLocationStore();

  const [nextOrder] = useState<Order | null>(DEMO_NEXT_ORDER);

  const handleStatusChange = async (newStatus: DriverStatus) => {
    if (!driver) return;

    // Start/stop location tracking
    if (newStatus === 'available') {
      // Request geolocation permission and start tracking
      if ('geolocation' in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
            });
          });

          setLocation(position.coords.latitude, position.coords.longitude);
          setTracking(true);

          toast({
            title: 'Vous êtes en ligne',
            description: 'Vous pouvez maintenant recevoir des courses',
          });
        } catch (error) {
          toast({
            title: 'Erreur de localisation',
            description: 'Impossible d\'activer le suivi GPS',
            variant: 'destructive',
          });
          return;
        }
      }
    } else {
      setTracking(false);
      toast({
        title: 'Vous êtes hors ligne',
        description: 'Vous ne recevrez plus de courses',
      });
    }

    // Update driver status
    setDriver({ ...driver, status: newStatus });
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-950">
      <Header notificationCount={2} />

      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 max-w-lg mx-auto w-full pb-24 scrollbar-hide">
        {/* Status Switch */}
        <section className="flex justify-center py-4">
          <StatusSwitch
            status={driver?.status || 'offline'}
            onStatusChange={handleStatusChange}
            disabled={driver?.status === 'suspended'}
          />
        </section>

        {/* Daily Stats */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Aujourd'hui
          </h2>
          <div className="flex gap-3">
            <StatCard
              icon={Package}
              label="Courses"
              value={dailyStats.completedOrders || 5}
              variant="primary"
            />
            <StatCard
              icon={Euro}
              label="Gains"
              value={dailyStats.totalEarnings || 87.50}
              suffix="€"
              variant="success"
            />
            <StatCard
              icon={Navigation}
              label="Distance"
              value={dailyStats.totalDistance || 32}
              suffix="km"
              variant="default"
            />
          </div>
        </section>

        {/* Next Order */}
        {nextOrder && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Prochaine course
            </h2>
            <Card
              variant="interactive"
              onClick={() => navigate(`/order/${nextOrder.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{nextOrder.reference}</CardTitle>
                    <Badge variant="warning">En route</Badge>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Addresses */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-success" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Récupération</p>
                      <p className="text-sm font-medium text-foreground">{nextOrder.pickup_address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Livraison</p>
                      <p className="text-sm font-medium text-foreground">{nextOrder.delivery_address}</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-sm">{nextOrder.delivery_type}</span>
                    <span>•</span>
                    <span className="text-sm">{nextOrder.client_name}</span>
                  </div>
                  <span className="text-xl font-bold text-primary">
                    {nextOrder.price.toFixed(2)}€
                  </span>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Quick Actions */}

      </main>

      <BottomNav />
    </div>
  );
}
