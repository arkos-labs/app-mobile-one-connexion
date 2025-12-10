import { MapPin, Navigation, Clock, Info, User, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useOrder } from '@/context/OrderContext';
import { cn } from '@/lib/utils';

export function IncomingOrderModal() {
    const { incomingOrder, timeLeft, acceptOrder, rejectOrder, simulateNewOrder } = useOrder();

    // Calcul de la couleur de la barre de progression
    const progressColor = timeLeft > 10 ? 'bg-green-500' : 'bg-red-500';
    const progressWidth = `${(timeLeft / 30) * 100}%`;

    const getMapPreviewUrl = (pickup: { lat: number, lng: number }, dropoff: { lat: number, lng: number }) => {
        const apiKey = 'pk.cc49323fc6339e614aec809f78bc7db4';
        // Precision: Use LocationIQ path to connect exact points
        return `https://maps.locationiq.com/v3/staticmap?key=${apiKey}&size=600x400&markers=icon:large-green-cutout|${pickup.lat},${pickup.lng}&markers=icon:large-red-cutout|${dropoff.lat},${dropoff.lng}&path=weight:4|color:0x3B82F6|${pickup.lat},${pickup.lng}|${dropoff.lat},${dropoff.lng}`;
    }

    return (
        <>
            {/* Debug Trigger - Visible pour le test */}
            <div className="fixed bottom-32 right-4 z-50">
                <button
                    onClick={simulateNewOrder}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-xs px-4 py-2 rounded-full shadow-xl border-2 border-slate-900 animate-bounce"
                    title="Simuler une commande"
                >
                    🔔 TEST COURSE
                </button>
            </div>

            {incomingOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                    {/* Overlay sombre (optionnel, pour focus) */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto" onClick={rejectOrder} />

                    {/* Modal Content */}
                    <Card className="w-full max-w-lg mx-auto bg-[#0F172A] border-t-4 border-[#FCD34D] border-x border-b border-white/10 rounded-3xl shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-300 relative overflow-hidden">
                        {/* 1. Header: Timer & Titre */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[#1E293B]">
                            <div
                                className={cn("h-full transition-all duration-1000 ease-linear", progressColor)}
                                style={{ width: progressWidth }}
                            />
                        </div>
                        <div className="p-5 pb-0 text-center relative z-10">
                            <h2 className="text-white font-bold text-xl uppercase tracking-tight flex items-center justify-center gap-3">
                                <span className="w-2.5 h-2.5 bg-[#FCD34D] rounded-full animate-pulse shadow-[0_0_10px_#FCD34D]" />
                                Nouvelle Course
                            </h2>
                        </div>

                        <div className="p-6 space-y-6 relative z-10">

                            {/* 2. Carte (LocationIQ) */}
                            <div className="h-48 w-full rounded-2xl overflow-hidden border border-white/10 relative bg-[#1E293B] group shadow-lg">
                                <img
                                    src={getMapPreviewUrl(incomingOrder.pickup, incomingOrder.dropoff)}
                                    alt="Aperçu du trajet"
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                />
                                {/* Radar & Live Badge */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FCD34D]/5 to-transparent h-full w-full animate-[scan_3s_ease-in-out_infinite] pointer-events-none" />
                                <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg animate-pulse border border-white/10">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                    LIVE
                                </div>
                            </div>

                            {/* 3. Infos Trajet (Simplifiées) */}
                            <div className="flex items-center justify-between bg-[#1E293B] p-4 rounded-2xl border border-white/5 shadow-sm">
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                                            <MapPin className="w-3.5 h-3.5 text-green-500" />
                                        </div>
                                        <span className="text-slate-200 font-medium text-sm">{incomingOrder.pickupAddress}</span>
                                    </div>
                                    <div className="w-0.5 h-3 bg-slate-700 ml-3 my-0.5" />
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                            <Navigation className="w-3.5 h-3.5 text-red-500" />
                                        </div>
                                        <span className="text-slate-200 font-medium text-sm">{incomingOrder.dropoffAddress}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end justify-center pl-6 border-l border-white/5">
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Approche</span>
                                    <span className="text-white font-bold text-xl">{incomingOrder.approachDuration} min</span>
                                </div>
                            </div>

                            {/* 4. Info Colis & Client */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#1E293B] p-4 rounded-2xl border border-white/5 shadow-sm flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                        <Box className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Colis</p>
                                        <p className="text-slate-200 font-medium text-sm truncate">{incomingOrder.packageType}</p>
                                    </div>
                                </div>
                                <div className="bg-[#1E293B] p-4 rounded-2xl border border-white/5 shadow-sm flex items-center gap-3">
                                    <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                        <User className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Client</p>
                                        <p className="text-slate-200 font-medium text-sm">{incomingOrder.clientName}</p>
                                    </div>
                                </div>
                            </div>

                            {/* 5. LE PRIX NET */}
                            <div className="text-center py-2">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                                    Votre Gain Net
                                </p>
                                <h1 className="text-5xl font-extrabold text-[#FCD34D] tracking-tight drop-shadow-sm">
                                    {incomingOrder.price.toFixed(2)}€
                                </h1>
                            </div>

                            {/* 6. Actions */}
                            <div className="grid grid-cols-4 gap-4 items-center pt-2">
                                {/* Refuser (1 col) */}
                                <Button
                                    variant="ghost"
                                    onClick={rejectOrder}
                                    className="col-span-1 h-14 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-600 transition-all font-medium text-xs"
                                >
                                    Refuser
                                </Button>

                                {/* Accepter (3 cols) */}
                                <div className="col-span-3 relative">
                                    <div className="absolute inset-0 bg-[#FCD34D] rounded-xl blur opacity-20 animate-pulse"></div>
                                    <Button
                                        onClick={acceptOrder}
                                        className="relative w-full bg-[#FCD34D] hover:bg-[#FCD34D]/90 text-slate-950 h-14 rounded-xl text-lg font-bold tracking-wide shadow-lg active:scale-[0.98] transition-all"
                                    >
                                        ACCEPTER
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </Card>
                </div>
            )}
        </>
    );
}
