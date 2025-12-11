import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Power, Navigation, User, ArrowRight, Bug, Box, Flag, FileText, ChevronUp, ChevronDown, Clock, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { useLocationStore } from '@/store/locationStore';
import type { DriverStatus } from '@/types';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const driver = useAuthStore((state) => state.driver);
  const setDriver = useAuthStore((state) => state.setDriver);
  const dailyStats = useOrderStore((state) => state.dailyStats) || { completedOrders: 0, totalEarnings: 0 };
  const currentOrder = useOrderStore((state) => state.currentOrder);
  const setIncomingOrder = useOrderStore((state) => state.setIncomingOrder);
  const { setTracking, setLocation } = useLocationStore();

  const [isLoading, setIsLoading] = useState(false);
  const isOnline = driver?.status === 'available';

  // --- GESTION DU VOLET (Défaut: FERMÉ) ---
  const [isPanelOpen, setPanelOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 40;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;

    if (isUpSwipe) setPanelOpen(true);
    if (isDownSwipe) setPanelOpen(false);
  };

  const togglePanel = () => setPanelOpen(!isPanelOpen);

  // --- ACTIONS ---
  const handleTestOrder = () => {
    setIncomingOrder({
      id: `test_${Date.now()}`,
      pickup_address: "12 Rue de la Paix, Paris",
      delivery_address: "Tour Eiffel, Paris",
      price: 35.50,
      delivery_type: "Express",
      status: "pending_acceptance",
      created_at: new Date().toISOString(),
      distance: 5.2,
      client_name: "Jean Dupont",
      package_description: "Carton fragile 5kg",
      notes: "Code porte 1234A. Appeler à l'arrivée."
    });
    toast({ title: "Simulation", description: "Offre de course envoyée !" });
  };

  const toggleStatus = async () => {
    if (isLoading || !driver) return;
    if (currentOrder) {
      toast({ title: "Course en cours", description: "Terminez la course pour passer hors ligne.", variant: "destructive" });
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
        toast({ title: '🟢 EN LIGNE', description: 'Recherche de courses...' });
      };
      if ('geolocation' in navigator) navigator.geolocation.getCurrentPosition((pos) => activate(pos.coords.latitude, pos.coords.longitude), () => activate(48.8566, 2.3522));
      else activate(48.8566, 2.3522);
    } else {
      setTracking(false);
      setDriver({ ...driver, status: 'offline' });
      toast({ title: '🔴 HORS LIGNE' });
    }
    setIsLoading(false);
  };

  const openGPS = () => {
    if (!currentOrder) return;
    const query = encodeURIComponent(currentOrder.delivery_address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-slate-900">

      {!currentOrder && (
        <button onClick={handleTestOrder} className="absolute top-12 left-4 z-50 bg-purple-600/80 p-2 rounded-full shadow-lg border border-white/20 active:scale-95">
          <Bug className="w-5 h-5 text-white" />
        </button>
      )}

      {/* MAP */}
      <div
        className="absolute inset-0 z-0 pointer-events-auto cursor-pointer"
        onClick={() => setPanelOpen(false)}
      >
        <div className="absolute inset-0 w-full h-full bg-cover bg-center opacity-70" style={{ backgroundImage: `url('https://maps.locationiq.com/v3/staticmap?key=pk.cc49323fc6339e614aec809f78bc7db4&center=48.8566,2.3522&zoom=15&size=1080x1920&format=png&maptype=streets')` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-transparent to-slate-900/90" />
      </div>

      {/* --- MODE GPS (Course Active) --- */}
      {currentOrder ? (
        <div className="relative z-20 w-full h-full flex flex-col justify-between pt-safe pb-0 pointer-events-none">

          {/* HAUT : Prochaine Étape (Toujours visible) */}
          <div className={`mx-4 mt-4 bg-emerald-600 rounded-xl shadow-xl p-4 flex items-center gap-4 animate-in slide-in-from-top duration-500 border border-emerald-400/20 pointer-events-auto transition-opacity duration-300 ${isPanelOpen ? 'opacity-50' : 'opacity-100'}`}>
            <div className="bg-white/20 p-3 rounded-full shrink-0">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-emerald-100 text-[10px] uppercase font-bold tracking-wider">Direction</p>
              <p className="text-white text-lg font-bold leading-tight line-clamp-2">{currentOrder.pickup_address}</p>
            </div>
          </div>

          <div className="flex-1" />

          {/* BAS : Fiche Mission Coulissante */}
          <div
            className={cn(
              "bg-slate-900 border-t border-white/10 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.8)] flex flex-col pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
              isPanelOpen ? "h-[85%]" : "h-[100px]"
            )}
          >
            {/* ZONE DE GRIP */}
            <div
              className="w-full flex flex-col items-center pt-3 pb-1 shrink-0 cursor-grab active:cursor-grabbing touch-none z-50 bg-slate-900 rounded-t-3xl"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onClick={togglePanel}
            >
              <div className="w-12 h-1.5 bg-slate-600 rounded-full mb-2" />
              {isPanelOpen ? <ChevronDown className="w-4 h-4 text-slate-500 animate-bounce" /> : <ChevronUp className="w-4 h-4 text-slate-500 animate-bounce" />}
            </div>

            {/* CONTENU */}
            <div className={cn(
              "px-6 pb-6 pt-2 flex-1 no-scrollbar transition-all",
              isPanelOpen ? "overflow-y-auto" : "overflow-hidden"
            )}>

              {/* EN-TÊTE COMPACT (Toujours visible) */}
              <div className="flex justify-between items-start mb-6" onClick={!isPanelOpen ? togglePanel : undefined}>
                <div>
                  {/* Formule */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-blue-500/20">
                      {currentOrder.delivery_type}
                    </span>
                  </div>
                  {/* Client */}
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-slate-400" />
                    <span className="text-white text-lg font-bold">{currentOrder.client_name || "Client"}</span>
                  </div>
                </div>
                {/* Prix */}
                <div className="text-right">
                  <span className="text-3xl font-black text-emerald-400">{currentOrder.price}€</span>
                </div>
              </div>

              {/* DÉTAILS COMPLETS (Visible uniquement si ouvert) */}
              <div className={cn(
                "transition-all duration-500 ease-in-out overflow-hidden space-y-6",
                isPanelOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
              )}>

                {/* 1. TRAJET COMPLET (Timeline) */}
                <div className="bg-slate-800/40 p-4 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex gap-4 relative">
                    {/* Ligne verticale */}
                    <div className="absolute left-[11px] top-3 bottom-0 w-0.5 bg-slate-700 h-[calc(100%-12px)] z-0" />

                    {/* Départ */}
                    <div className="relative z-10 shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-0.5">Enlèvement</p>
                      <p className="text-white text-sm font-medium leading-tight">{currentOrder.pickup_address}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 relative">
                    {/* Arrivée */}
                    <div className="relative z-10 shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500">
                        <MapPin className="w-3 h-3 text-red-500" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-0.5">Livraison</p>
                      <p className="text-white text-sm font-medium leading-tight">{currentOrder.delivery_address}</p>
                    </div>
                  </div>
                </div>

                {/* 2. DÉTAILS PRODUIT & NOTES */}
                <div className="grid grid-cols-1 gap-3">
                  {currentOrder.package_description && (
                    <div className="flex items-start gap-3 bg-slate-800/40 p-3 rounded-xl border border-white/5">
                      <Package className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Colis</p>
                        <p className="text-slate-300 text-sm font-medium">{currentOrder.package_description}</p>
                      </div>
                    </div>
                  )}
                  {currentOrder.notes && (
                    <div className="flex items-start gap-3 bg-slate-800/40 p-3 rounded-xl border border-white/5">
                      <FileText className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Notes</p>
                        <p className="text-slate-300 text-sm italic">"{currentOrder.notes}"</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. BOUTONS ACTIONS */}
                <div className="grid grid-cols-5 gap-3 pb-safe pt-2">
                  <button onClick={openGPS} className="col-span-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-lg">
                    <Navigation className="w-6 h-6" />
                    <span className="text-xs uppercase">GPS</span>
                  </button>
                  <button onClick={() => navigate(`/order/${currentOrder.id}`)} className="col-span-3 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 border border-white/10 transition-all active:scale-95">
                    <span>ACTIONS</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      ) : (
        /* --- MODE ATTENTE (Code inchangé) --- */
        <div className="relative z-10 w-full h-full flex flex-col justify-between pt-4 pb-2">
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
          <div className="flex-1 flex flex-col items-center justify-center shrink-0 min-h-0">
            {isOnline ? (
              <div className="flex flex-col items-center animate-pulse">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-3 border border-blue-500/30 backdrop-blur-sm">
                  <MapPin className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-xl font-light text-white tracking-[0.2em] text-center drop-shadow-md">RECHERCHE...</h2>
              </div>
            ) : (
              <div className="flex flex-col items-center opacity-40">
                <Power className="w-12 h-12 text-slate-400 mb-2" />
                <span className="text-sm font-bold text-slate-500 tracking-widest">HORS LIGNE</span>
              </div>
            )}
          </div>
          <div className="relative z-20 flex flex-col items-center justify-end pb-28 shrink-0">
            <button onClick={toggleStatus} disabled={isLoading} className={cn("relative w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 border-[5px]", isOnline ? "bg-red-500 border-red-600" : "bg-blue-600 border-blue-500", isLoading && "opacity-80")}>
              {isLoading ? <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <span className="text-2xl font-black text-white tracking-tighter drop-shadow-lg">{isOnline ? "STOP" : "GO"}</span>}
            </button>
            <p className="mt-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-900/50 px-3 py-1 rounded-full backdrop-blur-md">{isOnline ? "En ligne" : "Hors ligne"}</p>
          </div>
        </div>
      )}
    </div>
  );
}
