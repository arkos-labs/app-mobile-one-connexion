import { useEffect, useState } from 'react';

/**
 * Hook React pour gérer l'état PWA
 * 
 * Utilisation :
 * ```tsx
 * import { usePWA } from '@/hooks/usePWA';
 * 
 * function App() {
 *   const { isOnline, isInstalled, canInstall, installPWA } = usePWA();
 *   
 *   return (
 *     <div>
 *       {!isOnline && <div>Mode hors ligne</div>}
 *       {canInstall && <button onClick={installPWA}>Installer l'app</button>}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePWA() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isInstalled, setIsInstalled] = useState(false);
    const [canInstall, setCanInstall] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        // Détection du statut online/offline
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Détection si l'app est déjà installée
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        // Capture de l'événement d'installation
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setCanInstall(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Détection après installation
        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setCanInstall(false);
            setDeferredPrompt(null);
            console.log('✅ PWA installée avec succès !');
        });

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const installPWA = async () => {
        if (!deferredPrompt) {
            console.log('❌ Impossible d\'installer : pas de prompt disponible');
            return;
        }

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('✅ Utilisateur a accepté l\'installation');
        } else {
            console.log('❌ Utilisateur a refusé l\'installation');
        }

        setDeferredPrompt(null);
        setCanInstall(false);
    };

    return {
        isOnline,
        isInstalled,
        canInstall,
        installPWA,
    };
}
