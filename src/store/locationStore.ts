import { create } from 'zustand';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  isTracking: boolean;
  lastUpdate: string | null;
  watchId: number | null;
  setLocation: (lat: number, lng: number) => void;
  setTracking: (isTracking: boolean) => void;
  setWatchId: (watchId: number | null) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  latitude: null,
  longitude: null,
  isTracking: false,
  lastUpdate: null,
  watchId: null,
  setLocation: (latitude, longitude) => set({ 
    latitude, 
    longitude, 
    lastUpdate: new Date().toISOString() 
  }),
  setTracking: (isTracking) => set({ isTracking }),
  setWatchId: (watchId) => set({ watchId }),
  clearLocation: () => set({ 
    latitude: null, 
    longitude: null, 
    isTracking: false,
    lastUpdate: null,
    watchId: null,
  }),
}));
