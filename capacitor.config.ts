import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.oneconnexion.driver',
  appName: 'One Connexion Driver',
  webDir: 'dist',

  // Configuration serveur pour éviter les problèmes CORS sur mobile
  server: {
    androidScheme: 'https',
    // Décommenter pour le développement local avec live reload
    // url: 'http://192.168.1.X:8080',
    // cleartext: true
  },

  // Configuration Android
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false, // Mettre à true pour debug
  },

  // Configuration iOS
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
  },

  // Plugins configuration
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1E3A8A',
      showSpinner: false,
    },
  },
};

export default config;
