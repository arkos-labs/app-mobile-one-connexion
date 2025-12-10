import { MapPin, Clock, Package, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

const statusConfig: Record<OrderStatus, { label: string; variant: 'pending' | 'info' | 'warning' | 'success' | 'destructive' }> = {
  pending_acceptance: { label: 'En attente', variant: 'pending' },
  accepted: { label: 'Acceptée', variant: 'info' },
  dispatched: { label: 'En route', variant: 'warning' },
  in_progress: { label: 'En cours', variant: 'warning' },
  delivered: { label: 'Livrée', variant: 'success' },
  cancelled: { label: 'Annulée', variant: 'destructive' },
};

const deliveryTypeColors: Record<string, string> = {
  'Standard': 'bg-muted text-muted-foreground',
  'Express': 'bg-info/15 text-info',
  'Flash Express': 'bg-destructive/15 text-destructive',
};

export function OrderCard({ order, onPress }: OrderCardProps) {
  const statusInfo = statusConfig[order.status];
  const deliveryColor = deliveryTypeColors[order.delivery_type] || 'bg-muted text-muted-foreground';
  
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <Card 
      variant="interactive" 
      className="overflow-hidden"
      onClick={onPress}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">{order.reference}</span>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
        
        {/* Addresses */}
        <div className="space-y-2 mb-3">
          <div className="flex items-start gap-2">
            <div className="mt-0.5">
              <div className="w-3 h-3 rounded-full bg-success" />
            </div>
            <p className="text-sm text-foreground line-clamp-1 flex-1">
              {order.pickup_address}
            </p>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="mt-0.5">
              <div className="w-3 h-3 rounded-full bg-destructive" />
            </div>
            <p className="text-sm text-foreground line-clamp-1 flex-1">
              {order.delivery_address}
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-xs">{formatTime(order.created_at)}</span>
            </div>
            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", deliveryColor)}>
              {order.delivery_type}
            </span>
          </div>
          
          <span className="text-xl font-bold text-primary">
            {order.price.toFixed(2)}€
          </span>
        </div>
        
        {/* Package description if available */}
        {order.package_description && (
          <div className="flex items-center gap-2 mt-2 text-muted-foreground">
            <Package className="w-4 h-4 shrink-0" />
            <p className="text-xs line-clamp-1">{order.package_description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
