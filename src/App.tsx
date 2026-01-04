import { Toaster, TooltipProvider } from '@/components/UI';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/Layout';
import {
  LoginPage, RegisterPage, Index, Dashboard, DatasetPage, FeatureSelectionPage,
  OptimizationPage, TrainingPage, PredictionsPage, WebsiteAnalysisPage,
  MetricsPage, ReportsPage, SettingsPage
} from '@/pages/Pages';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
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
        <Route path="/cross-project" element={<Dashboard />} />
        <Route path="/incremental" element={<Dashboard />} />
        <Route path="/devops" element={<Dashboard />} />
        <Route path="/analytics" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
