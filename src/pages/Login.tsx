import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Truck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import type { Driver } from '@/types';

// Demo driver data (in real app, this comes from Supabase)
const DEMO_DRIVER: Driver = {
  id: 'demo-driver-001',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  first_name: 'Jean',
  last_name: 'Dupont',
  email: 'driver@oneconnexion.fr',
  phone: '+33 6 12 34 56 78',
  vehicle_type: 'scooter',
  vehicle_plate: 'AB-123-CD',
  status: 'offline',
};

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setDriver } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Demo login (in real app, this calls Supabase)
    if (email === 'driver@oneconnexion.fr' && password === 'demo123') {
      setDriver(DEMO_DRIVER);
      toast({
        title: 'Connexion réussie',
        description: `Bienvenue, ${DEMO_DRIVER.first_name} !`,
      });
      navigate('/');
    } else {
      toast({
        title: 'Échec de connexion',
        description: 'Email ou mot de passe incorrect',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header with brand */}
      <div className="gradient-brand pt-safe-top pb-16 px-6 text-center shrink-0">
        <div className="flex items-center justify-center gap-3 mt-8 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-yellow flex items-center justify-center shadow-yellow">
            <Truck className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-primary-foreground mb-2">
          One Connexion
        </h1>
        <p className="text-primary-foreground/80">
          Application Chauffeur
        </p>
      </div>

      {/* Login Card */}
      <div className="flex-1 -mt-8 px-4 overflow-y-auto scrollbar-hide">
        <Card className="max-w-md mx-auto shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Connexion</CardTitle>
            <CardDescription>
              Connectez-vous avec vos identifiants chauffeur
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot password link */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Identifiants de démo :
              </p>
              <p className="text-sm text-foreground font-mono">
                Email: driver@oneconnexion.fr
              </p>
              <p className="text-sm text-foreground font-mono">
                Password: demo123
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-6 text-sm text-muted-foreground">
          © 2024 One Connexion. Tous droits réservés.
        </div>
      </div>
    </div>
  );
}
