import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Layouts
import MainLayout from "@/components/layout/MainLayout";

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

// Main Pages
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import DatasetPage from "@/pages/DatasetPage";
import FeatureSelectionPage from "@/pages/FeatureSelectionPage";
import OptimizationPage from "@/pages/OptimizationPage";
import TrainingPage from "@/pages/TrainingPage";
import PredictionsPage from "@/pages/PredictionsPage";
import WebsiteAnalysisPage from "@/pages/WebsiteAnalysisPage";
import MetricsPage from "@/pages/MetricsPage";
import ReportsPage from "@/pages/ReportsPage";
import SettingsPage from "@/pages/SettingsPage";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dataset" element={<DatasetPage />} />
        <Route path="/features" element={<FeatureSelectionPage />} />
        <Route path="/optimization" element={<OptimizationPage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/predictions" element={<PredictionsPage />} />
        <Route path="/website-analysis" element={<WebsiteAnalysisPage />} />
        <Route path="/metrics" element={<MetricsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        {/* Placeholder routes for admin features */}
        <Route path="/cross-project" element={<Dashboard />} />
        <Route path="/incremental" element={<Dashboard />} />
        <Route path="/devops" element={<Dashboard />} />
        <Route path="/analytics" element={<Dashboard />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
