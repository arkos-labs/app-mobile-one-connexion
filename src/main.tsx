import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Enregistrement du Service Worker PWA
import { registerSW } from "virtual:pwa-register";

// Auto-update du Service Worker
const updateSW = registerSW({
    onNeedRefresh() {
        console.log("🔄 Nouvelle version disponible - Mise à jour automatique...");
    },
    onOfflineReady() {
        console.log("✅ Application prête à fonctionner hors ligne");
    },
    onRegistered(registration) {
        console.log("✅ Service Worker enregistré");
        // Vérifier les mises à jour toutes les heures
        if (registration) {
            setInterval(() => {
                registration.update();
            }, 60 * 60 * 1000); // 1 heure
        }
    },
    onRegisterError(error) {
        console.error("❌ Erreur lors de l'enregistrement du Service Worker:", error);
    },
});

createRoot(document.getElementById("root")!).render(<App />);
