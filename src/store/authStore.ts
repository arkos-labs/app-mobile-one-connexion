import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Driver } from '@/types';

interface AuthState {
  driver: Driver | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setDriver: (driver: Driver | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      driver: null,
      isAuthenticated: false,
      isLoading: true,
      setDriver: (driver) => set({ 
        driver, 
        isAuthenticated: !!driver,
        isLoading: false 
      }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ 
        driver: null, 
        isAuthenticated: false,
        isLoading: false 
      }),
    }),
    {
      name: 'one-connexion-auth',
      partialize: (state) => ({ 
        driver: state.driver, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
