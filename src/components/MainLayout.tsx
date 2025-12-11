import { useLocation, Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
    notificationCount?: number;
    showBottomNav?: boolean;
}

export function MainLayout({
    notificationCount = 0,
    showBottomNav = true
}: MainLayoutProps) {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <div className={cn(
            "bg-slate-950 w-full",
            // UTILISATION DE 100dvh (Dynamic Viewport Height) pour le mobile
            isHomePage ? "h-[100dvh] overflow-hidden flex flex-col" : "min-h-screen flex flex-col"
        )}>
            <Header notificationCount={notificationCount} />

            <main className={cn(
                "w-full max-w-lg mx-auto",
                (showBottomNav && !isHomePage) ? "pb-24" : "",
                // Le Dashboard prend tout l'espace restant mais ne dépasse jamais
                isHomePage ? "flex-1 h-full overflow-hidden relative" : "flex-1"
            )}>
                <Outlet />
            </main>

            {showBottomNav && <BottomNav />}
        </div>
    );
}
