import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Search, Filter } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { OrderCard } from '@/components/OrderCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { Order } from '@/types';

// Demo orders
const DEMO_ORDERS: Order[] = [
  {
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
  },
  {
    id: 'order-002',
    reference: 'OC-2024-0041',
    pickup_address: '42 Boulevard Haussmann, 75009 Paris',
    delivery_address: '8 Place de la Bastille, 75011 Paris',
    pickup_lat: 48.8738,
    pickup_lng: 2.3380,
    delivery_lat: 48.8531,
    delivery_lng: 2.3693,
    delivery_type: 'Standard',
    price: 12.00,
    status: 'pending_acceptance',
    created_at: new Date(Date.now() - 300000).toISOString(),
    client_name: 'Pierre Durand',
  },
  {
    id: 'order-003',
    reference: 'OC-2024-0040',
    pickup_address: '1 Place du Trocadéro, 75016 Paris',
    delivery_address: '55 Rue du Faubourg Saint-Honoré, 75008 Paris',
    pickup_lat: 48.8627,
    pickup_lng: 2.2876,
    delivery_lat: 48.8704,
    delivery_lng: 2.3119,
    delivery_type: 'Flash Express',
    price: 35.00,
    status: 'accepted',
    created_at: new Date(Date.now() - 600000).toISOString(),
    client_name: 'Marie Laurent',
    package_description: 'Colis fragile - Bijoux',
  },
  {
    id: 'order-004',
    reference: 'OC-2024-0039',
    pickup_address: '20 Rue de Rivoli, 75004 Paris',
    delivery_address: '10 Rue de Varenne, 75007 Paris',
    delivery_type: 'Standard',
    price: 14.50,
    status: 'delivered',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    delivered_at: new Date(Date.now() - 1800000).toISOString(),
    client_name: 'François Blanc',
  },
  {
    id: 'order-005',
    reference: 'OC-2024-0038',
    pickup_address: '33 Avenue de l\'Opéra, 75002 Paris',
    delivery_address: '5 Rue de Castiglione, 75001 Paris',
    delivery_type: 'Express',
    price: 22.00,
    status: 'delivered',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    delivered_at: new Date(Date.now() - 5400000).toISOString(),
    client_name: 'Claire Moreau',
  },
];

export default function Orders() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  const filterOrders = (status: 'upcoming' | 'active' | 'completed') => {
    return DEMO_ORDERS.filter((order) => {
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          order.reference.toLowerCase().includes(query) ||
          order.pickup_address.toLowerCase().includes(query) ||
          order.delivery_address.toLowerCase().includes(query) ||
          order.client_name?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Apply tab filter
      switch (status) {
        case 'upcoming':
          return ['pending_acceptance', 'accepted'].includes(order.status);
        case 'active':
          return ['dispatched', 'in_progress'].includes(order.status);
        case 'completed':
          return ['delivered', 'cancelled'].includes(order.status);
        default:
          return true;
      }
    });
  };

  const upcomingOrders = filterOrders('upcoming');
  const activeOrders = filterOrders('active');
  const completedOrders = filterOrders('completed');

  const tabCounts = {
    upcoming: upcomingOrders.length,
    active: activeOrders.length,
    completed: completedOrders.length,
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Header />

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-lg mx-auto w-full pb-24 scrollbar-hide">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher une course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="upcoming" className="relative">
              À venir
              {tabCounts.upcoming > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {tabCounts.upcoming}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="active" className="relative">
              En cours
              {tabCounts.active > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-warning text-warning-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {tabCounts.active}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">
              Terminées
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-4 space-y-3">
            {upcomingOrders.length > 0 ? (
              upcomingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onPress={() => navigate(`/order/${order.id}`)}
                />
              ))
            ) : (
              <EmptyState message="Aucune course à venir" />
            )}
          </TabsContent>

          <TabsContent value="active" className="mt-4 space-y-3">
            {activeOrders.length > 0 ? (
              activeOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onPress={() => navigate(`/order/${order.id}`)}
                />
              ))
            ) : (
              <EmptyState message="Aucune course en cours" />
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-4 space-y-3">
            {completedOrders.length > 0 ? (
              completedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onPress={() => navigate(`/order/${order.id}`)}
                />
              ))
            ) : (
              <EmptyState message="Aucune course terminée" />
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Package className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
