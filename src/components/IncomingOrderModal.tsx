import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Box, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useOrder } from '@/context/OrderContext';
import { cn } from '@/lib/utils';

export function IncomingOrderModal() {
    const navigate = useNavigate();
    const { incomingOrder, timeLeft, acceptOrder, rejectOrder, simulateNewOrder } = useOrder();

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Gestion du Son
    useEffect(() => {
        if (incomingOrder) {
            if (!audioRef.current) {
                audioRef.current = new Audio('/sounds/notification.mp3');
            }
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.warn("Autoplay audio bloqué ou fichier introuvable:", error);
                });
            }
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }
    }, [incomingOrder]);

    const handleAccept = () => {
        if (incomingOrder) {
            const orderId = incomingOrder.id;
            acceptOrder();
            navigate(`/order/${orderId}`);
        }
    };

    const progressColor = timeLeft > 10 ? 'bg-green-500' : 'bg-red-500';
    const progressWidth = `${(timeLeft / 30) * 100}%`;

    const getMapPreviewUrl = (pickup: { lat: number, lng: number }, dropoff: { lat: number, lng: number }) => {
        const apiKey = 'pk.cc49323fc6339e614aec809f78bc7db4';
        return `https://maps.locationiq.com/v3/staticmap?key=${apiKey}&size=600x300&markers=icon:large-green-cutout|${pickup.lat},${pickup.lng}&markers=icon:large-red-cutout|${dropoff.lat},${dropoff.lng}&path=weight:4|color:0x3B82F6|${pickup.lat},${pickup.lng}|${dropoff.lat},${dropoff.lng}`;
    }

    return (
        <>
            {/* Debug Trigger */}
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 pointer-events-none">
                    <div className="absolute inset-0 bg-black/85 backdrop-blur-md pointer-events-auto" onClick={rejectOrder} />

                    {/* MODAL COMPACTE : overflow-hidden + flex-col + max-h-[90dvh] */}
                    <Card className="w-full max-w-md mx-auto bg-[#0F172A] border-t-4 border-[#FCD34D] border-x border-b border-white/10 rounded-3xl shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-300 relative overflow-hidden flex flex-col max-h-[90dvh]">

                        {/* Header Compact */}
                        <div className="shrink-0 relative bg-[#1E293B]">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-[#1E293B]">
                                <div
                                    className={cn("h-full transition-all duration-1000 ease-linear", progressColor)}
                                    style={{ width: progressWidth }}
                                />
                            </div>
                            <div className="p-3 text-center">
                                <h2 className="text-white font-bold text-lg uppercase tracking-tight flex items-center justify-center gap-2">
                                    <span className="w-2 h-2 bg-[#FCD34D] rounded-full animate-pulse shadow-[0_0_10px_#FCD34D]" />
                                    Nouvelle Course
                                </h2>
                            </div>
                        </div>

                        {/* Contenu Compact (space-y-2 et p-4) */}
                        <div className="p-4 pt-2 space-y-2 flex-1 flex flex-col justify-between overflow-hidden">

                            {/* Map Réduite (h-28) */}
                            <div className="h-28 w-full rounded-xl overflow-hidden border border-white/10 relative bg-[#1E293B] shrink-0">
                                <img
                                    src={getMapPreviewUrl(incomingOrder.pickup, incomingOrder.dropoff)}
                                    alt="Aperçu du trajet"
                                    className="w-full h-full object-cover opacity-80"
                                />
                                <div className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg animate-pulse border border-white/10">
                                    <div className="w-1 h-1 bg-white rounded-full" />
                                    LIVE
                                </div>
                            </div>

                            {/* Infos Compactes */}
                            <div className="flex flex-col gap-2 bg-[#1E293B] p-3 rounded-xl border border-white/5 shrink-0">
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                    <span className="text-slate-200 font-medium text-xs truncate">{incomingOrder.pickupAddress}</span>
                                </div>
                                <div className="w-0.5 h-2 bg-slate-700 ml-1.5" />
                                <div className="flex items-center gap-3">
                                    <Navigation className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                    <span className="text-slate-200 font-medium text-xs truncate">{incomingOrder.dropoffAddress}</span>
                                </div>
                            </div>

                            {/* Details (Grid) */}
                            <div className="grid grid-cols-2 gap-2 shrink-0">
                                <div className="bg-[#1E293B] p-2 rounded-xl border border-white/5 flex items-center gap-2">
                                    <Box className="w-4 h-4 text-blue-400 shrink-0" />
                                    <div className="overflow-hidden">
                                        <p className="text-[9px] text-slate-400 uppercase">Colis</p>
                                        <p className="text-slate-200 text-xs truncate">{incomingOrder.packageType}</p>
                                    </div>
                                </div>
                                <div className="bg-[#1E293B] p-2 rounded-xl border border-white/5 flex items-center gap-2">
                                    <User className="w-4 h-4 text-purple-400 shrink-0" />
                                    <div className="overflow-hidden">
                                        <p className="text-[9px] text-slate-400 uppercase">Client</p>
                                        <p className="text-slate-200 text-xs truncate">{incomingOrder.clientName}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Prix & Approche */}
                            <div className="flex items-center justify-between px-2 shrink-0">
                                <div className="text-center">
                                    <p className="text-[9px] text-slate-400 uppercase">Approche</p>
                                    <p className="text-white font-bold text-lg">{incomingOrder.approachDuration} min</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] text-slate-400 uppercase">Gain Net</p>
                                    <h1 className="text-4xl font-extrabold text-[#FCD34D] tracking-tight">
                                        {incomingOrder.price.toFixed(2)}€
                                    </h1>
                                </div>
                            </div>

                            {/* Actions (Boutons Hauteur standard) */}
                            <div className="grid grid-cols-4 gap-3 items-center pt-1 shrink-0">
                                <Button
                                    variant="ghost"
                                    onClick={rejectOrder}
                                    className="col-span-1 h-12 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 font-medium text-xs"
                                >
                                    Refuser
                                </Button>

                                <div className="col-span-3 relative">
                                    <div className="absolute inset-0 bg-[#FCD34D] rounded-xl blur opacity-20 animate-pulse"></div>
                                    <Button
                                        onClick={handleAccept}
                                        className="relative w-full bg-[#FCD34D] hover:bg-[#FCD34D]/90 text-slate-950 h-12 rounded-xl text-base font-bold tracking-wide shadow-lg active:scale-[0.98] transition-all"
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
