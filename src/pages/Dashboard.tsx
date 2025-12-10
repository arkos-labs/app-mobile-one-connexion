import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { useLocationStore } from '@/store/locationStore';
import type { DriverStatus } from '@/types';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { driver, setDriver } = useAuthStore();

  // On récupère currentOrder pour vérifier si une course est active
  const { dailyStats, currentOrder } = useOrderStore();

  const { setTracking, setLocation } = useLocationStore();
  const [isLoading, setIsLoading] = useState(false);
  const isOnline = driver?.status === 'available';

  // --- GARDIEN DE NAVIGATION ---
  // Si une course est active, on empêche l'accès au Dashboard
  useEffect(() => {
    if (currentOrder) {
      // Redirection immédiate vers la page de la course
      navigate(`/order/${currentOrder.id}`, { replace: true });
    }
  }, [currentOrder, navigate]);

  const toggleStatus = async () => {
    if (isLoading || !driver) return;

    // Sécurité supplémentaire : Impossible de changer le statut si course active
    if (currentOrder) {
      toast({ title: "Action impossible", description: "Terminez votre course d'abord !", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const newStatus: DriverStatus = isOnline ? 'offline' : 'available';
    if (newStatus === 'available') {
      const activate = (lat: number, lng: number) => {
        setLocation(lat, lng);
        setTracking(true);
        setDriver({ ...driver, status: 'available' });
        toast({ title: '🟢 EN LIGNE', description: 'Prêt pour les courses' });
      };
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => activate(pos.coords.latitude, pos.coords.longitude),
          () => activate(48.8566, 2.3522)
        );
      } else {
        activate(48.8566, 2.3522);
      }
    } else {
      setTracking(false);
      setDriver({ ...driver, status: 'offline' });
      toast({ title: '🔴 HORS LIGNE' });
    }
    setIsLoading(false);
  };

  // Si on est en train de rediriger, on n'affiche rien pour éviter le flash
  if (currentOrder) return null;

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-slate-900">

      {/* BACKGROUND MAP FIXED + VIGNETTAGE */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-80"
          style={{ backgroundImage: `url('https://maps.locationiq.com/v3/staticmap?key=pk.cc49323fc6339e614aec809f78bc7db4&center=48.8566,2.3522&zoom=15&size=1080x1920&format=png&maptype=streets')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-transparent to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(15,23,42,1)_100%)]" />
      </div>

      {/* CONTENU UI */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between pt-4 pb-2">

        {/* 1. TOP : Bulle Gains */}
        <div className="flex justify-center shrink-0 pt-2">
          <div className="bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2 shadow-2xl flex items-center gap-4">
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-slate-400 uppercase font-bold">Gains</span>
              <span className="text-base font-bold text-white">{dailyStats.totalEarnings?.toFixed(2) || "0"}€</span>
            </div>
            <div className="h-6 w-[1px] bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-slate-400 uppercase font-bold">Courses</span>
              <span className="text-base font-bold text-emerald-400">{dailyStats.completedOrders || 0}</span>
            </div>
          </div>
        </div>

        {/* 2. CENTRE : Statut */}
        <div className="flex-1 flex flex-col items-center justify-center shrink-0 min-h-0">
          {isOnline && (
            <div className="flex flex-col items-center animate-pulse">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-3 border border-blue-500/30 backdrop-blur-sm">
                <MapPin className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-xl font-light text-white tracking-[0.2em] text-center drop-shadow-md">RECHERCHE...</h2>
            </div>
          )}
        </div>

        {/* 3. BAS : Bouton GO */}
        <div className="flex flex-col items-center justify-end pb-36 shrink-0">
          <button
            onClick={toggleStatus}
            disabled={!driver || isLoading}
            className={cn(
              "relative w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 border-[5px]",
              isOnline ? "bg-red-500 border-red-600" : "bg-blue-600 border-blue-500",
              isLoading && "opacity-80"
            )}
          >
            {isLoading ? (
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="text-2xl font-black text-white tracking-tighter drop-shadow-lg">
                {isOnline ? "STOP" : "GO"}
              </span>
            )}
          </button>
          <p className="mt-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-900/50 px-3 py-1 rounded-full backdrop-blur-md">
            {isOnline ? "En ligne" : "Hors ligne"}
          </p>
        </div>
      </div>
    </div>
  );
}
