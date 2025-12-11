import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import ProofOfDelivery from "./pages/ProofOfDelivery";
import Vehicles from "./pages/Vehicles";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import NotificationSettings from "./pages/NotificationSettings";
import SecuritySettings from "./pages/SecuritySettings";
import Documents from "./pages/Documents";
import DocumentUpload from "./pages/DocumentUpload";
import Support from "./pages/Support";
import Garage from "./pages/Garage";
import AdminHub from "./pages/AdminHub";
import ChangePassword from "./pages/ChangePassword";
import EditVehicle from "./pages/EditVehicle";
import Settings from "./pages/Settings";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import { OrderProvider } from "./context/OrderContext";
import { IncomingOrderModal } from "./components/IncomingOrderModal";
import { MainLayout } from "./components/MainLayout";

const queryClient = new QueryClient();

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Public Route wrapper (redirect if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

const App = () => {
  const { isLoading, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check active session
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          // If no session, ensure we are logged out
          logout();
        }
        // If session exists, we trust the persisted state for now
        // or we could fetch the profile again here
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        // Always finish loading
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        logout();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setLoading, logout]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900" style={{ backgroundColor: '#0f172a' }}>
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        storageKey="one-connexion-theme"
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <OrderProvider>
              <IncomingOrderModal />
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } />

                {/* Protected routes */}
                <Route element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/order/:id" element={<OrderDetail />} />
                  <Route path="/order/:id/proof" element={<ProofOfDelivery />} />
                  <Route path="/vehicles" element={<Vehicles />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/edit" element={<EditProfile />} />
                  <Route path="/notifications/settings" element={<NotificationSettings />} />
                  <Route path="/security" element={<SecuritySettings />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/documents/upload/:documentId" element={<DocumentUpload />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/garage" element={<Garage />} />
                  <Route path="/admin-hub" element={<AdminHub />} />
                  <Route path="/security/change-password" element={<ChangePassword />} />
                  <Route path="/vehicles/:vehicleId/edit" element={<EditVehicle />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/chat" element={<Chat />} />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </OrderProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
