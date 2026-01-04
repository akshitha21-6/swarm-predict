import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Upload, Layers, Cpu, Sparkles, Activity, Globe,
  FileText, Settings, LogOut, Brain, BarChart3, GitBranch, RefreshCw, Workflow,
} from 'lucide-react';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Upload, label: 'Dataset Upload', href: '/dataset' },
  { icon: Layers, label: 'Feature Selection', href: '/features' },
  { icon: Sparkles, label: 'Optimization', href: '/optimization' },
  { icon: Cpu, label: 'Model Training', href: '/training' },
  { icon: Brain, label: 'Predictions', href: '/predictions' },
  { icon: Globe, label: 'Website Analysis', href: '/website-analysis' },
  { icon: BarChart3, label: 'Metrics', href: '/metrics' },
  { icon: FileText, label: 'Reports', href: '/reports' },
  { icon: GitBranch, label: 'Cross-Project', href: '/cross-project', adminOnly: true },
  { icon: RefreshCw, label: 'Incremental Learning', href: '/incremental', adminOnly: true },
  { icon: Workflow, label: 'DevOps', href: '/devops', adminOnly: true },
  { icon: Activity, label: 'Admin Analytics', href: '/analytics', adminOnly: true },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const filteredNavItems = navItems.filter((item) => !item.adminOnly || user?.role === 'admin');

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold gradient-text">DefectAI</h1>
            <p className="text-xs text-muted-foreground">Swarm Intelligence</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-hide">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.href}>
                  <Link to={item.href} className={cn('sidebar-item', isActive && 'active')}>
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
              <span className="text-sm font-semibold text-primary">{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
            <button onClick={logout} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
