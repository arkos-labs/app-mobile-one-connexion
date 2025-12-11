import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check, MapPin, Navigation, Clock, Euro } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useOrderStore } from '@/store/orderStore';
import { cn } from '@/lib/utils';
import type { Order } from '@/types';

export function IncomingOrderModal() {
    const navigate = useNavigate();
    // Récupération du store
    const incomingOrder = useOrderStore((state) => state.incomingOrder);
    const setIncomingOrder = useOrderStore((state) => state.setIncomingOrder);
    const setCurrentOrder = useOrderStore((state) => state.setCurrentOrder); // C'est ici la clé !

    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        if (!incomingOrder) return;
        setTimeLeft(30);
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleDecline();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [incomingOrder]);

    const handleAccept = () => {
        if (!incomingOrder) return;

        // 1. Créer l'objet commande acceptée
        const acceptedOrder: Order = {
            ...incomingOrder,
            status: 'accepted',
            accepted_at: new Date().toISOString(),
        };

        // 2. SAUVEGARDE CRITIQUE DANS LE STORE
        setCurrentOrder(acceptedOrder);

        // 3. Fermer le modal
        setIncomingOrder(null);

        // 4. Aller sur le Dashboard (qui affichera le GPS car currentOrder existe)
        navigate('/', { replace: true });
    };

    const handleDecline = () => {
        setIncomingOrder(null);
    };

    if (!incomingOrder) return null;

    return (
        <Dialog open={!!incomingOrder} onOpenChange={(open) => !open && handleDecline()}>
            <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-white p-0 overflow-hidden gap-0">

                {/* Header Urgence */}
                <div className="bg-emerald-600 p-4 flex justify-between items-center animate-pulse">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-white" />
                        <span className="font-bold text-white">Nouvelle Course !</span>
                    </div>
                    <span className="text-xl font-black text-white">{timeLeft}s</span>
                </div>

                <div className="p-6 space-y-6">
                    {/* Prix et Distance */}
                    <div className="text-center space-y-2">
                        <span className="text-sm text-slate-400 uppercase tracking-widest">Gain estimé</span>
                        <div className="text-5xl font-black text-white flex items-center justify-center gap-2">
                            {incomingOrder.price} <Euro className="w-8 h-8 text-emerald-400" />
                        </div>
                        <p className="text-slate-400">{incomingOrder.delivery_type} • 2.5 km</p>
                    </div>

                    {/* Adresses */}
                    <div className="space-y-4 bg-slate-800/50 p-4 rounded-xl border border-white/5">
                        <div className="flex gap-3">
                            <div className="flex flex-col items-center gap-1 mt-1">
                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                <div className="w-0.5 h-full bg-slate-700 min-h-[30px]" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold">Départ</p>
                                <p className="text-white font-medium text-sm leading-tight">{incomingOrder.pickup_address}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex flex-col items-center gap-1 mt-1">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold">Arrivée</p>
                                <p className="text-white font-medium text-sm leading-tight">{incomingOrder.delivery_address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <Button
                            variant="outline"
                            onClick={handleDecline}
                            className="h-14 border-slate-700 hover:bg-slate-800 text-slate-300 font-bold"
                        >
                            <X className="w-5 h-5 mr-2" />
                            REFUSER
                        </Button>
                        <Button
                            onClick={handleAccept}
                            className="h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                        >
                            <Check className="w-6 h-6 mr-2" />
                            ACCEPTER
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
