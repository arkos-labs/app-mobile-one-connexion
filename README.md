# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## 📱 PWA Mobile-First + Capacitor

This project is now configured as a **Progressive Web App (PWA)** with **Capacitor** support for native mobile deployment!

### 🚀 Quick Start

```bash
# Development
npm run dev                    # Start dev server with PWA

# Build and Test
npm run build                  # Production build
npm run preview                # Test the build

# Mobile (Capacitor)
npm run cap:sync              # Sync with Capacitor
npm run cap:android           # Open in Android Studio
npm run cap:run:android       # Build + Run on Android
```

### 📚 Complete Documentation

**Start here:** [INDEX-PWA.md](./INDEX-PWA.md) - Navigation guide for all PWA documentation

**Quick Links:**
- 📋 [README-PWA.md](./README-PWA.md) - Complete overview
- 🚀 [QUICK-START.md](./QUICK-START.md) - Quick start guide
- ❓ [REPONSE-SERVICE-WORKER.md](./REPONSE-SERVICE-WORKER.md) - Service Worker explanation
- 💡 [EXEMPLES-PWA.md](./EXEMPLES-PWA.md) - Code examples
- 📚 [PWA-SETUP.md](./PWA-SETUP.md) - Technical documentation
- 📁 [STRUCTURE.md](./STRUCTURE.md) - Project structure

### ✨ PWA Features

- ✅ **Installable** - Works like a native app
- ✅ **Offline-first** - Works without internet
- ✅ **Auto-update** - Automatic updates
- ✅ **Mobile-optimized** - Perfect for mobile devices
- ✅ **Capacitor-ready** - Deploy to Android/iOS

### ⚠️ Next Steps

1. **Generate PWA icons** (required) - See [QUICK-START.md](./QUICK-START.md)
2. **Test locally** - `npm run dev`
3. **Test on mobile** - `npm run cap:run:android`

---

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
