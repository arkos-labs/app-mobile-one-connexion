import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useAuthStore } from "@/store/authStore";
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
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Public Route wrapper (redirect if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

const App = () => (
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

export default App;
