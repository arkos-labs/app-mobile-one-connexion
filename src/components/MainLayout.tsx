import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

interface MainLayoutProps {
    children: ReactNode;
    notificationCount?: number;
    showBottomNav?: boolean;
}

export function MainLayout({
    children,
    notificationCount = 0,
    showBottomNav = true
}: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-950">
            <Header notificationCount={notificationCount} />

            <main className={showBottomNav ? "pb-24" : ""}>
                {children}
            </main>

            {showBottomNav && <BottomNav />}
        </div>
    );
}
