import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toaster, TooltipProvider } from '@/components/UI';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import {
  LoginPage, RegisterPage, Index, Dashboard, DatasetPage, FeatureSelectionPage,
  OptimizationPage, TrainingPage, PredictionsPage, WebsiteAnalysisPage,
  MetricsPage, ReportsPage, SettingsPage, MainLayout, User, UserRole
} from '@/pages/Pages';

// ==================== AUTH CONTEXT ====================
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const demoUsers: Record<string, { password: string; user: User }> = {
  'admin@defectai.com': { password: 'admin123', user: { id: '1', email: 'admin@defectai.com', name: 'Dr. Sarah Chen', role: 'admin' } },
  'user@defectai.com': { password: 'user123', user: { id: '2', email: 'user@defectai.com', name: 'Alex Johnson', role: 'user' } },
};

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const demoUser = demoUsers[email.toLowerCase()];
    if (demoUser && demoUser.password === password) { setUser(demoUser.user); return true; }
    return false;
  }, []);
  const register = useCallback(async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setUser({ id: Date.now().toString(), email, name, role });
    return true;
  }, []);
  const logout = useCallback(() => setUser(null), []);
  return <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

// ==================== ROUTES ====================
const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function ProtectedLayout() {
  return <MainLayout><Outlet /></MainLayout>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute><ProtectedLayout /></ProtectedRoute>}>
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
