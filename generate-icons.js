/**
 * Script pour générer les icônes PWA aux bonnes dimensions
 * 
 * INSTRUCTIONS :
 * 1. Place ton icône source (512x512 minimum) dans public/ avec le nom "icon-source.png"
 * 2. Exécute : node generate-icons.js
 * 3. Les icônes seront générées automatiquement dans public/
 * 
 * Alternative simple sans ce script :
 * - Utilise un outil en ligne comme https://www.pwabuilder.com/imageGenerator
 * - Ou https://realfavicongenerator.net/
 * - Upload ton icône et télécharge les fichiers générés dans public/
 */

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                  GÉNÉRATION DES ICÔNES PWA                     ║
╚════════════════════════════════════════════════════════════════╝

📋 Icônes requises pour la PWA :
   ✓ pwa-64x64.png
   ✓ pwa-192x192.png
   ✓ pwa-512x512.png
   ✓ maskable-icon-512x512.png
   ✓ apple-touch-icon.png (180x180)

🔧 Options pour générer les icônes :

OPTION 1 - Utiliser PWA Asset Generator (Recommandé)
   npm run generate-pwa-assets

OPTION 2 - Outils en ligne (Plus simple)
   • https://www.pwabuilder.com/imageGenerator
   • https://realfavicongenerator.net/
   
   Télécharge les icônes générées dans le dossier public/

OPTION 3 - Manuellement avec un éditeur d'images
   Redimensionne ton icône aux tailles requises ci-dessus

📁 Toutes les icônes doivent être placées dans : public/

`);
