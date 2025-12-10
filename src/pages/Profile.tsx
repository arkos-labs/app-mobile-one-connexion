import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  ChevronRight,
  LogOut,
  Bell,
  Shield,
  Settings,
  Briefcase,
  Star,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';

const menuItems = [
  {
    icon: Briefcase,
    label: 'Mon Dossier Pro',
    description: 'Véhicules, Permis, Assurance',
    action: 'admin-hub',
  },
  {
    icon: Bell,
    label: 'Préférences Notifications',
    description: 'Gérer vos alertes',
    action: 'notifications',
  },
  {
    icon: Shield,
    label: 'Sécurité & Connexion',
    description: 'Mot de passe, biométrie',
    action: 'security',
  },
  {
    icon: Settings,
    label: 'Paramètres Application',
    description: 'Langue, thème, CGU',
    action: 'settings',
  },
];

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { driver, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Déconnexion',
      description: 'À bientôt !',
    });
    navigate('/login');
  };

  const handleMenuAction = (action: string) => {
    if (action === 'admin-hub') {
      navigate('/admin-hub');
      return;
    }

    if (action === 'notifications') {
      navigate('/notifications/settings');
      return;
    }

    if (action === 'security') {
      navigate('/security');
      return;
    }

    if (action === 'settings') {
      navigate('/settings');
      return;
    }

    if (action === 'help') {
      navigate('/support');
      return;
    }

    toast({
      title: 'Bientôt disponible',
      description: 'Cette fonctionnalité arrive prochainement',
    });
  };

  const initials = driver
    ? `${driver.first_name[0]}${driver.last_name[0]}`.toUpperCase()
    : 'OC';

  const statusColor = driver?.status === 'available'
    ? 'bg-green-500'
    : driver?.status === 'busy'
      ? 'bg-yellow-400'
      : 'bg-slate-500';

  const statusLabel = driver?.status === 'available'
    ? 'En ligne'
    : driver?.status === 'busy'
      ? 'En course'
      : 'Hors ligne';

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-950">
      <Header />

      <main className="flex-1 overflow-y-auto px-4 py-6 max-w-lg mx-auto space-y-6 w-full pb-24 scrollbar-hide">
        {/* Profile Card */}
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            {/* Avatar & Info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <Avatar className="w-20 h-20 border-4 border-yellow-400 bg-yellow-400">
                  <AvatarImage src={driver?.avatar_url} alt={driver?.first_name} />
                  <AvatarFallback className="bg-yellow-400 text-black font-bold text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {/* Status indicator */}
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-slate-900 ${statusColor}`} />
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1">
                  {driver ? `${driver.first_name} ${driver.last_name}` : 'Chauffeur'}
                </h2>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20">
                    Chauffeur Vérifié
                  </Badge>
                  <span className={`text-xs ${statusColor.replace('bg-', 'text-')}`}>
                    • {statusLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-slate-400">
                <Mail className="w-5 h-5" />
                <span className="text-sm">{driver?.email || 'email@example.com'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Phone className="w-5 h-5" />
                <span className="text-sm">{driver?.phone || '+33 6 XX XX XX XX'}</span>
              </div>
            </div>

            {/* Edit Profile Button */}
            <Button
              variant="outline"
              className="w-full mt-6 border-slate-700 text-white hover:bg-slate-800 h-12"
              onClick={() => navigate('/profile/edit')}
            >
              <User className="w-4 h-4 mr-2" />
              Modifier mes informations
            </Button>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-yellow-400">127</p>
                <p className="text-xs text-slate-400">Courses</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <p className="text-2xl font-bold text-yellow-400">4.9</p>
                </div>
                <p className="text-xs text-slate-400">Note</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">2,450€</p>
                <p className="text-xs text-slate-400">Ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Title */}
        <div>
          <h2 className="text-xs tracking-widest font-bold text-slate-400 uppercase mb-3">
            Centre de Gestion
          </h2>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Card
              key={item.action}
              className="bg-slate-900 border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors"
              onClick={() => handleMenuAction(item.action)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white mb-1">{item.label}</h3>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full text-red-400 border-red-400/30 hover:bg-red-400/10 hover:text-red-400 h-12"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Se déconnecter
        </Button>

        {/* App Version */}
        <div className="text-center">
          <p className="text-xs text-slate-500">
            One Connexion Driver v1.0.0
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
