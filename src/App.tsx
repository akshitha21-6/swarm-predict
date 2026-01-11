import React from 'react';
import { Toaster, TooltipProvider } from '@/components/UI';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import {
  Index, Dashboard, DatasetPage, FeatureSelectionPage,
  OptimizationPage, TrainingPage, PredictionsPage, WebsiteAnalysisPage,
  MetricsPage, ReportsPage, SettingsPage, MainLayout
} from '@/pages/Pages';

// ==================== ROUTES ====================
const queryClient = new QueryClient();

function AppLayout() {
  return <MainLayout><Outlet /></MainLayout>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route element={<AppLayout />}>
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
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
export default App;
