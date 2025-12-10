import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { Download, Wifi, WifiOff } from 'lucide-react';

/**
 * Composant PWA Status
 * 
 * Affiche :
 * - Le statut online/offline
 * - Un bouton pour installer l'app (si disponible)
 * 
 * Utilisation :
 * ```tsx
 * import { PWAStatus } from '@/components/PWAStatus';
 * 
 * function App() {
 *   return (
 *     <div>
 *       <PWAStatus />
 *     </div>
 *   );
 * }
 * ```
 */
export function PWAStatus() {
    const { isOnline, isInstalled, canInstall, installPWA } = usePWA();

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {/* Indicateur Online/Offline */}
            {!isOnline && (
                <div className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    <WifiOff className="h-4 w-4" />
                    <span className="text-sm font-medium">Mode hors ligne</span>
                </div>
            )}

            {/* Bouton d'installation PWA */}
            {canInstall && !isInstalled && (
                <Button
                    onClick={installPWA}
                    className="flex items-center gap-2 shadow-lg"
                    size="lg"
                >
                    <Download className="h-4 w-4" />
                    Installer l'application
                </Button>
            )}

            {/* Indicateur d'installation */}
            {isInstalled && (
                <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    <Wifi className="h-4 w-4" />
                    <span className="text-sm font-medium">App installée</span>
                </div>
            )}
        </div>
    );
}
