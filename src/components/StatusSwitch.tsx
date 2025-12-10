import { useState } from 'react';
import { Power, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DriverStatus } from '@/types';

interface StatusSwitchProps {
  status: DriverStatus;
  onStatusChange: (newStatus: DriverStatus) => Promise<void>;
  disabled?: boolean;
}

export function StatusSwitch({ status, onStatusChange, disabled }: StatusSwitchProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const isOnline = status === 'available' || status === 'busy';
  
  const handleToggle = async () => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);
    try {
      const newStatus: DriverStatus = isOnline ? 'offline' : 'available';
      await onStatusChange(newStatus);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleToggle}
        disabled={disabled || isLoading || status === 'suspended'}
        className={cn(
          "relative w-32 h-32 rounded-full transition-all duration-500 flex items-center justify-center",
          "focus:outline-none focus:ring-4 focus:ring-offset-4 focus:ring-offset-background",
          isOnline 
            ? "bg-success focus:ring-success/50 animate-pulse-glow" 
            : "bg-status-offline focus:ring-status-offline/50",
          (disabled || status === 'suspended') && "opacity-50 cursor-not-allowed",
          !disabled && !isLoading && "active:scale-95"
        )}
      >
        {/* Outer ring animation */}
        {isOnline && (
          <div className="absolute inset-0 rounded-full border-4 border-success/30 animate-ping" />
        )}
        
        {/* Inner content */}
        <div className="flex flex-col items-center gap-1 text-success-foreground">
          {isLoading ? (
            <Loader2 className="w-10 h-10 animate-spin" />
          ) : (
            <Power className="w-10 h-10" />
          )}
          <span className="text-sm font-bold uppercase tracking-wide">
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </span>
        </div>
      </button>
      
      {/* Status indicator text */}
      <div className="text-center">
        <p className={cn(
          "text-lg font-semibold",
          isOnline ? "text-success" : "text-muted-foreground"
        )}>
          {status === 'suspended' 
            ? 'Compte suspendu' 
            : isOnline 
              ? 'Vous recevez des courses' 
              : 'Passez en ligne pour recevoir des courses'
          }
        </p>
      </div>
    </div>
  );
}
