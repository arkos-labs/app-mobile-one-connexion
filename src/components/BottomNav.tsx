import { useLocation, NavLink } from 'react-router-dom';
import { Home, Package, LifeBuoy, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Accueil', matchPaths: ['/'] },
  { to: '/orders', icon: Package, label: 'Courses', matchPaths: ['/orders', '/order'] },
  { to: '/support', icon: LifeBuoy, label: 'Aide', matchPaths: ['/support'] },
  { to: '/profile', icon: User, label: 'Profil', matchPaths: ['/profile', '/security', '/notifications', '/documents'] },
];

export function BottomNav() {
  const location = useLocation();

  const isItemActive = (item: typeof navItems[0]) => {
    const currentPath = location.pathname;

    // Exact match for home
    if (item.to === '/' && currentPath === '/') {
      return true;
    }

    // Check if current path starts with any of the match paths
    return item.matchPaths.some(path => {
      if (path === '/') return false; // Skip home path in this check
      return currentPath.startsWith(path);
    });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 safe-bottom z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = isItemActive(item);
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive
                  ? "text-yellow-400"
                  : "text-slate-500 hover:text-slate-400"
              )}
            >
              <div className={cn(
                "relative p-2 rounded-xl transition-all duration-200",
                isActive && "bg-yellow-400/10"
              )}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
