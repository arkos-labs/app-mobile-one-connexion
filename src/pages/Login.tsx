import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, Eye, EyeOff, Truck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import type { Driver } from '@/types';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setDriver, setLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setLoading(true);

    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        throw new Error(authError.message === 'Invalid login credentials'
          ? 'Identifiants incorrects'
          : authError.message);
      }

      if (!authData.user) {
        throw new Error('Erreur lors de l\'authentification');
      }

      // 2. Fetch driver profile
      const { data: driverData, error: driverError } = await supabase
        .from('drivers')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (driverError || !driverData) {
        // Fallback for demo/testing if table doesn't exist or empty, 
        // BUT strictly speaking we should fail. 
        // However, to avoid blocking the user if they haven't set up the DB yet,
        // we might want to be careful. 
        // The prompt asks to "Mappe les données Supabase vers l'objet Driver".
        // If the fetch fails, it means the user is not a driver or DB is not set up.
        console.error('Driver fetch error:', driverError);
        throw new Error('Compte chauffeur introuvable ou erreur de base de données');
      }

      // 3. Map to Driver object
      const driver: Driver = {
        id: driverData.id,
        created_at: driverData.created_at,
        updated_at: driverData.updated_at,
        first_name: driverData.first_name,
        last_name: driverData.last_name,
        email: driverData.email,
        phone: driverData.phone,
        vehicle_type: driverData.vehicle_type,
        vehicle_plate: driverData.vehicle_plate,
        status: driverData.status || 'offline',
      };

      // 4. Update store
      setDriver(driver);

      toast({
        title: 'Connexion réussie',
        description: `Bienvenue, ${driver.first_name} !`,
      });

      navigate('/');

    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Échec de connexion',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
      setDriver(null); // Ensure state is clean
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    {...form.register('email')}
                    type="email"
                    placeholder="votre@email.com"
                    className="pl-10 h-12"
                    autoComplete="email"
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    {...form.register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
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
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                )}
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>
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
