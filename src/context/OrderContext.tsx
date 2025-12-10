import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Type de la commande
export interface Order {
    id: string;
    price: number;
    pickupAddress: string;
    dropoffAddress: string;
    distance: number; // km
    duration: number; // min
    pickup: { lat: number; lng: number };
    dropoff: { lat: number; lng: number };
    clientName: string;
    packageType: string;
    notes?: string;
    approachDuration: number; // min (Temps d'approche)
}

interface OrderContextType {
    incomingOrder: Order | null;
    timeLeft: number;
    acceptOrder: () => void;
    rejectOrder: () => void;
    simulateNewOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [incomingOrder, setIncomingOrder] = useState<Order | null>(null);
    const [timeLeft, setTimeLeft] = useState(30);
    const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

    // Gestion du Timer
    useEffect(() => {
        if (incomingOrder && timeLeft > 0) {
            const id = setTimeout(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            setTimerId(id);
        } else if (timeLeft === 0 && incomingOrder) {
            // Temps écoulé = Refus automatique
            handleAutoReject();
        }

        return () => {
            if (timerId) clearTimeout(timerId);
        };
    }, [incomingOrder, timeLeft]);

    const handleAutoReject = () => {
        setIncomingOrder(null);
        toast({
            title: "Temps écoulé",
            description: "La course a été proposée à un autre chauffeur.",
            variant: "destructive",
        });
    };

    const acceptOrder = () => {
        if (timerId) clearTimeout(timerId);
        setIncomingOrder(null);
        toast({
            title: "Course acceptée ! 🚀",
            description: "Redirection vers l'itinéraire...",
            className: "bg-green-500 text-white border-none",
        });
        // Redirection vers la page de course active (à créer plus tard)
        // navigate('/orders/current'); 
    };

    const rejectOrder = () => {
        if (timerId) clearTimeout(timerId);
        setIncomingOrder(null);
    };

    const simulateNewOrder = useCallback(() => {
        // Simule une commande après 2 secondes
        setTimeout(() => {
            setIncomingOrder({
                id: Date.now().toString(),
                price: 24.50, // Gain Net
                pickupAddress: "Paris 12ème", // Secteur seulement
                dropoffAddress: "Roissy CDG - T2E", // Secteur seulement
                distance: 32.5,
                duration: 45,
                approachDuration: 5, // 5 min d'approche
                pickup: { lat: 48.8443, lng: 2.3744 }, // Gare de Lyon
                dropoff: { lat: 49.0097, lng: 2.5479 }, // CDG T2E
                clientName: "Sophie", // Prénom seulement
                packageType: "Documents Urgents 📄",
                notes: "Fragile • Code: 4589A",
            });
            setTimeLeft(30);
        }, 2000);
    }, []);

    return (
        <OrderContext.Provider value={{
            incomingOrder,
            timeLeft,
            acceptOrder,
            rejectOrder,
            simulateNewOrder
        }}>
            {children}
        </OrderContext.Provider>
    );
}

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
};
