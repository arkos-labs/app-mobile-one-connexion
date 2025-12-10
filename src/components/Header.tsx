import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/authStore';

interface HeaderProps {
  notificationCount?: number;
}

// Pages principales (sans bouton retour)
const MAIN_PAGES = ['/', '/orders', '/vehicles', '/profile', '/documents', '/support', '/garage', '/admin-hub'];

// Titres personnalisés pour les sous-pages
const PAGE_TITLES: Record<string, string> = {
  '/profile/edit': 'Modifier le profil',
  '/security': 'Sécurité & Accès',
  '/security/change-password': 'Nouveau mot de passe',
  '/notifications/settings': 'Notifications',
};

export function Header({ notificationCount = 0 }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { driver } = useAuthStore();

  const initials = driver
    ? `${driver.first_name[0]}${driver.last_name[0]}`.toUpperCase()
    : 'OC';

  const statusColor = driver?.status === 'available'
    ? 'bg-green-500'
    : driver?.status === 'busy'
      ? 'bg-yellow-400'
      : 'bg-slate-500';

  // Détecter si on est sur une page principale ou une sous-page
  const isMainPage = MAIN_PAGES.includes(location.pathname);
  const pageTitle = PAGE_TITLES[location.pathname];

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950 backdrop-blur-lg border-b border-slate-800 safe-top">
      <div className="flex items-center justify-between h-16 px-4 max-w-lg mx-auto">
        {isMainPage ? (
          <>
            {/* Left: Profile (pages principales) */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-10 h-10 border-2 border-yellow-400 bg-yellow-400">
                  <AvatarImage src={driver?.avatar_url} alt={driver?.first_name} />
                  <AvatarFallback className="bg-yellow-400 text-black font-bold text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {/* Status indicator */}
                <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${statusColor}`} />
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">
                  {driver ? `${driver.first_name} ${driver.last_name}` : 'Chauffeur'}
                </span>
                <span className="text-xs text-slate-400">
                  {driver?.status === 'available' ? 'En ligne' :
                    driver?.status === 'busy' ? 'En course' : 'Hors ligne'}
                </span>
              </div>
            </div>

            {/* Center: Logo */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <span className="text-lg font-bold text-yellow-400">One Connexion</span>
            </div>

            {/* Right: Notifications */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Left: Back button (sous-pages) */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-slate-800"
              onClick={handleBack}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            {/* Center: Page title */}
            <h1 className="text-lg font-semibold text-white">
              {pageTitle || 'Retour'}
            </h1>

            {/* Right: Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
