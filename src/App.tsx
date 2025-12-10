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
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />
              <Route path="/order/:id" element={
                <ProtectedRoute>
                  <OrderDetail />
                </ProtectedRoute>
              } />
              <Route path="/order/:id/proof" element={
                <ProtectedRoute>
                  <ProofOfDelivery />
                </ProtectedRoute>
              } />
              <Route path="/vehicles" element={
                <ProtectedRoute>
                  <Vehicles />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/profile/edit" element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              } />
              <Route path="/notifications/settings" element={
                <ProtectedRoute>
                  <NotificationSettings />
                </ProtectedRoute>
              } />
              <Route path="/security" element={
                <ProtectedRoute>
                  <SecuritySettings />
                </ProtectedRoute>
              } />
              <Route path="/documents" element={
                <ProtectedRoute>
                  <Documents />
                </ProtectedRoute>
              } />
              <Route path="/documents/upload/:documentId" element={
                <ProtectedRoute>
                  <DocumentUpload />
                </ProtectedRoute>
              } />
              <Route path="/support" element={
                <ProtectedRoute>
                  <Support />
                </ProtectedRoute>
              } />
              <Route path="/garage" element={
                <ProtectedRoute>
                  <Garage />
                </ProtectedRoute>
              } />
              <Route path="/admin-hub" element={
                <ProtectedRoute>
                  <AdminHub />
                </ProtectedRoute>
              } />
              <Route path="/security/change-password" element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              } />
              <Route path="/vehicles/:vehicleId/edit" element={
                <ProtectedRoute>
                  <EditVehicle />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />

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
