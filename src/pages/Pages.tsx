import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button, Input, Textarea, Label, Checkbox, Switch, Progress, Tabs, TabsContent, TabsList, TabsTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, StatCard, toast, cn } from '@/components/UI';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Brain, Mail, Lock, User, Loader2, AlertCircle, Upload, FileSpreadsheet, Check, X, AlertTriangle, Database, TrendingUp, Shield, Activity, Cpu, Target, Zap, Layers, Filter, Sparkles, ArrowRight, Info, Play, Pause, RotateCcw, Dna, Bug, Globe, Search, FileCode, Link2, Gauge, TrendingDown, FileText, Download, Calendar, BarChart3, Server, Bell, Save, LayoutDashboard, Settings, LogOut, GitBranch, RefreshCw, Workflow, Plus } from 'lucide-react';

// ==================== TYPES ====================
export type UserRole = 'admin' | 'user';
export interface User { id: string; email: string; name: string; role: UserRole; avatar?: string; }
export interface Dataset { id: string; name: string; uploadedAt: Date; rows: number; columns: number; size: string; status: 'uploaded' | 'preprocessing' | 'ready' | 'error'; }
export interface Feature { name: string; importance: number; selected: boolean; type: 'numeric' | 'categorical'; }
export interface ModelMetrics { accuracy: number; precision: number; recall: number; f1Score: number; rocAuc: number; }
export interface Model { id: string; name: string; type: 'logistic' | 'svm' | 'decision_tree' | 'random_forest' | 'naive_bayes' | 'voting' | 'stacking'; metrics: ModelMetrics; trainedAt: Date; optimized: boolean; }
export interface Prediction { id: string; inputType: 'single' | 'batch' | 'url'; result: 'defective' | 'non-defective'; probability: number; riskLevel: 'low' | 'medium' | 'high'; timestamp: Date; featureContributions: { feature: string; contribution: number }[]; }
export interface OptimizationResult { algorithm: 'PSO' | 'GA' | 'ACO' | 'Hybrid'; iteration: number; fitness: number; bestParams: Record<string, number>; convergenceHistory: number[]; }

// ==================== LAYOUT ====================
interface NavItem { icon: React.ElementType; label: string; href: string; adminOnly?: boolean; }
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
  { icon: GitBranch, label: 'Cross-Project', href: '/cross-project' },
  { icon: RefreshCw, label: 'Incremental Learning', href: '/incremental' },
  { icon: Workflow, label: 'DevOps', href: '/devops' },
  { icon: Activity, label: 'Analytics', href: '/analytics' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

function Sidebar() {
  const location = useLocation();
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10"><Brain className="h-5 w-5 text-primary" /></div>
          <div><h1 className="font-display text-lg font-bold gradient-text">DefectAI</h1><p className="text-xs text-muted-foreground">Swarm Intelligence</p></div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-hide">
          <ul className="space-y-1">{navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (<li key={item.href}><Link to={item.href} className={cn('sidebar-item', isActive && 'active')}><item.icon className="h-5 w-5" /><span className="text-sm font-medium">{item.label}</span></Link></li>);
          })}</ul>
        </nav>
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20"><span className="text-sm font-semibold text-primary">A</span></div>
            <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">Admin User</p><p className="text-xs text-muted-foreground capitalize">admin</p></div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 min-h-screen"><div className="p-8">{children}</div></main>
    </div>
  );
}

export function Index() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/dashboard'); }, [navigate]);
  return null;
}

// ==================== DASHBOARD ====================
const accuracyData = [{ name: 'Week 1', baseline: 82, optimized: 85 }, { name: 'Week 2', baseline: 83, optimized: 88 }, { name: 'Week 3', baseline: 84, optimized: 91 }, { name: 'Week 4', baseline: 84, optimized: 94 }, { name: 'Week 5', baseline: 85, optimized: 96 }, { name: 'Week 6', baseline: 85, optimized: 97 }];
const defectDistribution = [{ name: 'Critical', value: 15, color: 'hsl(0, 75%, 55%)' }, { name: 'Major', value: 25, color: 'hsl(45, 95%, 55%)' }, { name: 'Minor', value: 35, color: 'hsl(175, 80%, 50%)' }, { name: 'Low', value: 25, color: 'hsl(280, 70%, 55%)' }];
const modelPerformance = [{ name: 'Logistic Reg.', accuracy: 78, f1: 75 }, { name: 'SVM', accuracy: 82, f1: 80 }, { name: 'Decision Tree', accuracy: 85, f1: 83 }, { name: 'Random Forest', accuracy: 91, f1: 89 }, { name: 'Ensemble', accuracy: 97, f1: 96 }];
const recentPredictions = [{ module: 'auth_handler.py', risk: 'high', probability: 0.89, time: '2 min ago' }, { module: 'data_processor.js', risk: 'low', probability: 0.12, time: '5 min ago' }, { module: 'api_gateway.go', risk: 'medium', probability: 0.45, time: '12 min ago' }, { module: 'cache_manager.py', risk: 'low', probability: 0.08, time: '18 min ago' }, { module: 'payment_service.ts', risk: 'high', probability: 0.92, time: '25 min ago' }];

export function Dashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-display font-bold">Welcome back, <span className="gradient-text">Admin</span></h1><p className="text-muted-foreground mt-1">Here's an overview of your software defect prediction system</p></div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10 text-success"><Activity className="h-4 w-4" /><span className="text-sm font-medium">System Online</span></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Datasets Analyzed" value="24" change="+3 this week" changeType="positive" icon={Database} />
        <StatCard title="Model Accuracy" value="97.2%" change="+2.4% from baseline" changeType="positive" icon={TrendingUp} iconColor="text-success" />
        <StatCard title="Defects Detected" value="1,847" change="152 high-risk" changeType="negative" icon={AlertTriangle} iconColor="text-warning" />
        <StatCard title="Modules Scanned" value="12,453" change="98.7% coverage" changeType="positive" icon={Shield} iconColor="text-accent" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-container"><div className="flex items-center justify-between mb-6"><div><h3 className="text-lg font-display font-semibold">Model Accuracy Over Time</h3><p className="text-sm text-muted-foreground">Baseline vs Swarm-Optimized</p></div></div>
          <ResponsiveContainer width="100%" height={280}><AreaChart data={accuracyData}><defs><linearGradient id="gradientPrimary" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(175, 80%, 50%)" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(175, 80%, 50%)" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" /><XAxis dataKey="name" stroke="hsl(215, 20%, 55%)" fontSize={12} /><YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} domain={[70, 100]} /><Tooltip contentStyle={{ backgroundColor: 'hsl(222, 47%, 10%)', border: '1px solid hsl(222, 30%, 18%)', borderRadius: '8px' }} /><Area type="monotone" dataKey="baseline" stroke="hsl(215, 20%, 55%)" fill="transparent" strokeWidth={2} /><Area type="monotone" dataKey="optimized" stroke="hsl(175, 80%, 50%)" fill="url(#gradientPrimary)" strokeWidth={2} /></AreaChart></ResponsiveContainer>
        </div>
        <div className="chart-container"><div className="mb-6"><h3 className="text-lg font-display font-semibold">Defect Severity Distribution</h3><p className="text-sm text-muted-foreground">Classification by risk level</p></div>
          <ResponsiveContainer width="100%" height={280}><PieChart><Pie data={defectDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={4} dataKey="value">{defectDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie><Tooltip contentStyle={{ backgroundColor: 'hsl(222, 47%, 10%)', border: '1px solid hsl(222, 30%, 18%)', borderRadius: '8px' }} /><Legend formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>} /></PieChart></ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="chart-container lg:col-span-2"><div className="mb-6"><h3 className="text-lg font-display font-semibold">Model Performance Comparison</h3><p className="text-sm text-muted-foreground">Accuracy and F1-Score by model type</p></div>
          <ResponsiveContainer width="100%" height={280}><BarChart data={modelPerformance} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" /><XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={12} domain={[0, 100]} /><YAxis dataKey="name" type="category" stroke="hsl(215, 20%, 55%)" fontSize={12} width={100} /><Tooltip contentStyle={{ backgroundColor: 'hsl(222, 47%, 10%)', border: '1px solid hsl(222, 30%, 18%)', borderRadius: '8px' }} /><Bar dataKey="accuracy" fill="hsl(175, 80%, 50%)" radius={[0, 4, 4, 0]} name="Accuracy %" /><Bar dataKey="f1" fill="hsl(280, 70%, 55%)" radius={[0, 4, 4, 0]} name="F1-Score %" /></BarChart></ResponsiveContainer>
        </div>
        <div className="glass-card p-6"><div className="mb-6"><h3 className="text-lg font-display font-semibold">Recent Predictions</h3><p className="text-sm text-muted-foreground">Latest module analysis</p></div>
          <div className="space-y-4">{recentPredictions.map((prediction, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
              <div className="flex items-center gap-3"><div className={`w-2 h-2 rounded-full ${prediction.risk === 'high' ? 'bg-destructive' : prediction.risk === 'medium' ? 'bg-warning' : 'bg-success'}`} /><div><p className="text-sm font-medium truncate max-w-[140px]">{prediction.module}</p><p className="text-xs text-muted-foreground">{prediction.time}</p></div></div>
              <span className={`metric-badge ${prediction.risk === 'high' ? 'danger' : prediction.risk === 'medium' ? 'warning' : 'success'}`}>{(prediction.probability * 100).toFixed(0)}%</span>
            </div>
          ))}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="glass-card p-6 text-left hover:bg-secondary/50 transition-all group"><div className="flex items-center gap-4"><div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform"><Cpu className="h-6 w-6" /></div><div><h4 className="font-display font-semibold">Train New Model</h4><p className="text-sm text-muted-foreground">Start swarm optimization</p></div></div></button>
        <button className="glass-card p-6 text-left hover:bg-secondary/50 transition-all group"><div className="flex items-center gap-4"><div className="p-3 rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform"><Target className="h-6 w-6" /></div><div><h4 className="font-display font-semibold">Run Prediction</h4><p className="text-sm text-muted-foreground">Analyze new modules</p></div></div></button>
        <button className="glass-card p-6 text-left hover:bg-secondary/50 transition-all group"><div className="flex items-center gap-4"><div className="p-3 rounded-xl bg-success/10 text-success group-hover:scale-110 transition-transform"><Zap className="h-6 w-6" /></div><div><h4 className="font-display font-semibold">Quick Analysis</h4><p className="text-sm text-muted-foreground">Website defect check</p></div></div></button>
      </div>
    </div>
  );
}

// ==================== DATASET PAGE ====================
interface UploadedDataset { id: string; name: string; size: string; rows: number; columns: number; status: 'uploading' | 'preprocessing' | 'ready' | 'error'; uploadedAt: Date; }
const mockDatasets: UploadedDataset[] = [{ id: '1', name: 'NASA_KC1.csv', size: '2.4 MB', rows: 2109, columns: 22, status: 'ready', uploadedAt: new Date('2024-01-15') }, { id: '2', name: 'PROMISE_CM1.csv', size: '1.8 MB', rows: 498, columns: 21, status: 'ready', uploadedAt: new Date('2024-01-14') }, { id: '3', name: 'Eclipse_Bug_Dataset.csv', size: '5.2 MB', rows: 4702, columns: 28, status: 'ready', uploadedAt: new Date('2024-01-12') }];
const mockPreviewData = [{ loc: 156, cc: 12, comment_density: 0.23, num_functions: 8, code_churn: 45, defective: 1 }, { loc: 89, cc: 5, comment_density: 0.45, num_functions: 3, code_churn: 12, defective: 0 }, { loc: 234, cc: 18, comment_density: 0.12, num_functions: 15, code_churn: 78, defective: 1 }, { loc: 67, cc: 3, comment_density: 0.56, num_functions: 2, code_churn: 5, defective: 0 }, { loc: 312, cc: 25, comment_density: 0.08, num_functions: 22, code_churn: 134, defective: 1 }];

export function DatasetPage() {
  const [datasets, setDatasets] = useState<UploadedDataset[]>(mockDatasets);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<UploadedDataset | null>(null);

  const simulateUpload = useCallback((file: File) => {
    setIsUploading(true); setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) { clearInterval(interval); setIsUploading(false); setDatasets((p) => [{ id: Date.now().toString(), name: file.name, size: `${(file.size / 1024 / 1024).toFixed(2)} MB`, rows: Math.floor(Math.random() * 5000) + 500, columns: Math.floor(Math.random() * 20) + 10, status: 'ready', uploadedAt: new Date() }, ...p]); toast.success('Dataset uploaded!'); return 100; }
        return prev + 10;
      });
    }, 200);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); const files = Array.from(e.dataTransfer.files); const csvFile = files.find((f) => f.name.endsWith('.csv')); if (csvFile) simulateUpload(csvFile); else toast.error('Please upload a CSV file'); }, [simulateUpload]);
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) simulateUpload(file); }, [simulateUpload]);
  const handleDelete = useCallback((id: string) => { setDatasets((prev) => prev.filter((d) => d.id !== id)); if (selectedDataset?.id === id) setSelectedDataset(null); toast.success('Dataset deleted'); }, [selectedDataset]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div><h1 className="text-3xl font-display font-bold">Dataset Upload & Preprocessing</h1><p className="text-muted-foreground mt-1">Upload NASA, PROMISE, or custom datasets for defect analysis</p></div>
      <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }} onDrop={handleDrop} className={`relative border-2 border-dashed rounded-xl p-12 transition-all ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
        <input type="file" accept=".csv" onChange={handleFileSelect} className="absolute inset-0 opacity-0 cursor-pointer" disabled={isUploading} />
        <div className="text-center space-y-4">{isUploading ? <><Loader2 className="h-12 w-12 mx-auto text-primary animate-spin" /><div className="space-y-2"><p className="font-medium">Processing dataset...</p><div className="max-w-xs mx-auto"><Progress value={uploadProgress} className="h-2" /></div></div></> : <><Upload className="h-12 w-12 mx-auto text-muted-foreground" /><div><p className="font-medium">Drop your CSV file here, or click to browse</p><p className="text-sm text-muted-foreground mt-1">Supports NASA, PROMISE, and custom defect datasets</p></div></>}</div>
      </div>
      <div className="glass-card p-6"><h3 className="text-lg font-display font-semibold mb-4">Automatic Preprocessing Pipeline</h3><div className="grid grid-cols-1 md:grid-cols-4 gap-4">{[{ step: '1', label: 'Missing Value Handling', desc: 'Mean/mode imputation' }, { step: '2', label: 'Normalization', desc: 'Min-Max & Z-score scaling' }, { step: '3', label: 'Encoding', desc: 'Label & one-hot encoding' }, { step: '4', label: 'Validation', desc: 'Data quality checks' }].map((item) => (<div key={item.step} className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-sm">{item.step}</div><div><p className="font-medium text-sm">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div></div>))}</div></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6"><div className="flex items-center justify-between mb-6"><h3 className="text-lg font-display font-semibold">Uploaded Datasets</h3><span className="text-sm text-muted-foreground">{datasets.length} datasets</span></div><div className="space-y-3">{datasets.map((dataset) => (<div key={dataset.id} className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer ${selectedDataset?.id === dataset.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`} onClick={() => setSelectedDataset(dataset)}><div className="flex items-center gap-4"><div className="p-2 rounded-lg bg-primary/10"><FileSpreadsheet className="h-5 w-5 text-primary" /></div><div><p className="font-medium">{dataset.name}</p><p className="text-sm text-muted-foreground">{dataset.rows.toLocaleString()} rows • {dataset.columns} columns • {dataset.size}</p></div></div><div className="flex items-center gap-2">{dataset.status === 'ready' && <span className="metric-badge success"><Check className="h-3 w-3" />Ready</span>}<Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(dataset.id); }}><X className="h-4 w-4 text-muted-foreground hover:text-destructive" /></Button></div></div>))}</div></div>
        <div className="glass-card p-6"><div className="flex items-center justify-between mb-6"><h3 className="text-lg font-display font-semibold">Dataset Preview</h3>{selectedDataset && <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Export</Button>}</div>{selectedDataset ? <div className="overflow-x-auto custom-scrollbar"><table className="w-full text-sm"><thead><tr className="border-b border-border"><th className="text-left py-3 px-4 font-medium text-muted-foreground">LOC</th><th className="text-left py-3 px-4 font-medium text-muted-foreground">CC</th><th className="text-left py-3 px-4 font-medium text-muted-foreground">Comments</th><th className="text-left py-3 px-4 font-medium text-muted-foreground">Functions</th><th className="text-left py-3 px-4 font-medium text-muted-foreground">Churn</th><th className="text-left py-3 px-4 font-medium text-muted-foreground">Defective</th></tr></thead><tbody>{mockPreviewData.map((row, index) => (<tr key={index} className="border-b border-border/50 hover:bg-secondary/30"><td className="py-3 px-4">{row.loc}</td><td className="py-3 px-4">{row.cc}</td><td className="py-3 px-4">{row.comment_density.toFixed(2)}</td><td className="py-3 px-4">{row.num_functions}</td><td className="py-3 px-4">{row.code_churn}</td><td className="py-3 px-4"><span className={`metric-badge ${row.defective ? 'danger' : 'success'}`}>{row.defective ? 'Yes' : 'No'}</span></td></tr>))}</tbody></table></div> : <div className="flex flex-col items-center justify-center py-12 text-muted-foreground"><Database className="h-12 w-12 mb-4 opacity-50" /><p>Select a dataset to preview</p></div>}</div>
      </div>
    </div>
  );
}

// ==================== FEATURE SELECTION PAGE ====================
interface FeatureItem { name: string; importance: number; selected: boolean; type: 'numeric' | 'categorical'; method: 'RFE' | 'Correlation' | 'MI' | 'Swarm'; }
const initialFeatures: FeatureItem[] = [{ name: 'Lines of Code (LOC)', importance: 0.92, selected: true, type: 'numeric', method: 'Swarm' }, { name: 'Cyclomatic Complexity', importance: 0.88, selected: true, type: 'numeric', method: 'Swarm' }, { name: 'Code Churn', importance: 0.85, selected: true, type: 'numeric', method: 'RFE' }, { name: 'Number of Functions', importance: 0.78, selected: true, type: 'numeric', method: 'MI' }, { name: 'Comment Density', importance: 0.71, selected: true, type: 'numeric', method: 'Correlation' }, { name: 'Developer Experience', importance: 0.65, selected: true, type: 'numeric', method: 'RFE' }, { name: 'Commit Frequency', importance: 0.58, selected: true, type: 'numeric', method: 'MI' }, { name: 'Bug Fix Count', importance: 0.52, selected: true, type: 'numeric', method: 'Swarm' }, { name: 'Module Age', importance: 0.45, selected: false, type: 'numeric', method: 'Correlation' }, { name: 'Import Count', importance: 0.38, selected: false, type: 'numeric', method: 'RFE' }, { name: 'Test Coverage', importance: 0.32, selected: false, type: 'numeric', method: 'MI' }, { name: 'File Size', importance: 0.25, selected: false, type: 'numeric', method: 'Correlation' }];

export function FeatureSelectionPage() {
  const [features, setFeatures] = useState<FeatureItem[]>(initialFeatures);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const selectedCount = features.filter((f) => f.selected).length;
  const removedCount = features.length - selectedCount;

  const runSwarmOptimization = () => {
    setIsOptimizing(true); setOptimizationProgress(0);
    const interval = setInterval(() => { setOptimizationProgress((prev) => { if (prev >= 100) { clearInterval(interval); setIsOptimizing(false); setFeatures((p) => p.map((f) => ({ ...f, selected: f.importance >= 0.5, method: 'Swarm' }))); return 100; } return prev + 5; }); }, 100);
  };

  const chartData = features.sort((a, b) => b.importance - a.importance).map((f) => ({ name: f.name.length > 15 ? f.name.slice(0, 15) + '...' : f.name, importance: f.importance * 100, selected: f.selected }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-display font-bold">Feature Selection</h1><p className="text-muted-foreground mt-1">Optimize feature subset using RFE, Correlation, Mutual Information & Swarm Intelligence</p></div><Button onClick={runSwarmOptimization} disabled={isOptimizing}><Sparkles className="h-4 w-4 mr-2" />{isOptimizing ? 'Optimizing...' : 'Run Swarm Optimization'}</Button></div>
      {isOptimizing && <div className="glass-card p-6"><div className="flex items-center gap-4 mb-4"><div className="p-2 rounded-lg bg-primary/10 animate-pulse"><Sparkles className="h-5 w-5 text-primary" /></div><div className="flex-1"><p className="font-medium">Hybrid Swarm Optimization Running...</p><p className="text-sm text-muted-foreground">{optimizationProgress < 30 ? 'Initializing PSO particles...' : optimizationProgress < 60 ? 'Applying Genetic Algorithm crossover...' : optimizationProgress < 90 ? 'Running Ant Colony pheromone updates...' : 'Converging to optimal solution...'}</p></div></div><Progress value={optimizationProgress} className="h-2" /></div>}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-5"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10"><Layers className="h-5 w-5 text-primary" /></div><div><p className="text-2xl font-bold">{features.length}</p><p className="text-sm text-muted-foreground">Total Features</p></div></div></div>
        <div className="glass-card p-5"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-success/10"><Check className="h-5 w-5 text-success" /></div><div><p className="text-2xl font-bold">{selectedCount}</p><p className="text-sm text-muted-foreground">Selected</p></div></div></div>
        <div className="glass-card p-5"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-destructive/10"><X className="h-5 w-5 text-destructive" /></div><div><p className="text-2xl font-bold">{removedCount}</p><p className="text-sm text-muted-foreground">Removed</p></div></div></div>
        <div className="glass-card p-5"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-accent/10"><Filter className="h-5 w-5 text-accent" /></div><div><p className="text-2xl font-bold">{((selectedCount / features.length) * 100).toFixed(0)}%</p><p className="text-sm text-muted-foreground">Selection Ratio</p></div></div></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-container"><h3 className="text-lg font-display font-semibold mb-6">Feature Importance Scores</h3><ResponsiveContainer width="100%" height={400}><BarChart data={chartData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" /><XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={12} domain={[0, 100]} /><YAxis dataKey="name" type="category" stroke="hsl(215, 20%, 55%)" fontSize={11} width={120} /><Tooltip contentStyle={{ backgroundColor: 'hsl(222, 47%, 10%)', border: '1px solid hsl(222, 30%, 18%)', borderRadius: '8px' }} formatter={(value: number) => [`${value.toFixed(1)}%`, 'Importance']} /><Bar dataKey="importance" radius={[0, 4, 4, 0]}>{chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.selected ? 'hsl(175, 80%, 50%)' : 'hsl(222, 30%, 25%)'} />)}</Bar></BarChart></ResponsiveContainer></div>
        <div className="glass-card p-6"><div className="flex items-center justify-between mb-6"><h3 className="text-lg font-display font-semibold">Feature Selection</h3><div className="flex items-center gap-2 text-xs text-muted-foreground"><Info className="h-3 w-3" />Toggle to include/exclude</div></div><div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">{features.sort((a, b) => b.importance - a.importance).map((feature) => (<div key={feature.name} className={`flex items-center justify-between p-4 rounded-lg border transition-all ${feature.selected ? 'border-primary/50 bg-primary/5' : 'border-border bg-secondary/30'}`}><div className="flex items-center gap-4"><Switch checked={feature.selected} onCheckedChange={() => setFeatures((p) => p.map((f) => f.name === feature.name ? { ...f, selected: !f.selected } : f))} /><div><p className={`font-medium ${!feature.selected && 'text-muted-foreground'}`}>{feature.name}</p><div className="flex items-center gap-2 mt-1"><span className="text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground">{feature.method}</span><span className="text-xs text-muted-foreground">{feature.type}</span></div></div></div><div className="text-right"><p className="text-lg font-bold">{(feature.importance * 100).toFixed(0)}%</p><p className="text-xs text-muted-foreground">importance</p></div></div>))}</div></div>
      </div>
      <div className="glass-card p-6"><h3 className="text-lg font-display font-semibold mb-4">Selection Methods Applied</h3><div className="grid grid-cols-1 md:grid-cols-4 gap-4">{[{ method: 'RFE', desc: 'Recursive Feature Elimination', icon: Filter }, { method: 'Correlation', desc: 'Pearson correlation filtering', icon: ArrowRight }, { method: 'MI', desc: 'Mutual Information scoring', icon: Sparkles }, { method: 'Swarm', desc: 'PSO + GA + ACO hybrid', icon: Layers }].map((item) => (<div key={item.method} className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50"><div className="p-2 rounded-lg bg-primary/10"><item.icon className="h-4 w-4 text-primary" /></div><div><p className="font-medium">{item.method}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div></div>))}</div></div>
    </div>
  );
}

// ==================== TRAINING PAGE ====================
interface ModelConfig { id: string; name: string; type: string; selected: boolean; trained: boolean; training: boolean; metrics: { accuracy: number; precision: number; recall: number; f1: number; rocAuc: number } | null; }
const initialModels: ModelConfig[] = [{ id: 'lr', name: 'Logistic Regression', type: 'logistic', selected: true, trained: false, training: false, metrics: null }, { id: 'svm', name: 'Support Vector Machine', type: 'svm', selected: true, trained: false, training: false, metrics: null }, { id: 'dt', name: 'Decision Tree', type: 'decision_tree', selected: true, trained: false, training: false, metrics: null }, { id: 'rf', name: 'Random Forest', type: 'random_forest', selected: true, trained: false, training: false, metrics: null }, { id: 'nb', name: 'Naive Bayes', type: 'naive_bayes', selected: true, trained: false, training: false, metrics: null }, { id: 'vote', name: 'Voting Ensemble', type: 'voting', selected: true, trained: false, training: false, metrics: null }, { id: 'stack', name: 'Stacking Ensemble', type: 'stacking', selected: true, trained: false, training: false, metrics: null }];
const generateMetrics = () => ({ accuracy: 0.75 + Math.random() * 0.22, precision: 0.72 + Math.random() * 0.25, recall: 0.70 + Math.random() * 0.27, f1: 0.71 + Math.random() * 0.26, rocAuc: 0.73 + Math.random() * 0.24 });

export function TrainingPage() {
  const [models, setModels] = useState<ModelConfig[]>(initialModels);
  const [isTraining, setIsTraining] = useState(false);
  const [smoteEnabled, setSmoteEnabled] = useState(true);
  const [swarmOptimized, setSwarmOptimized] = useState(true);

  const trainModels = async () => {
    setIsTraining(true);
    const toTrain = models.filter((m) => m.selected && !m.trained);
    for (const model of toTrain) {
      setModels((prev) => prev.map((m) => m.id === model.id ? { ...m, training: true } : m));
      await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));
      const metrics = generateMetrics();
      if (model.type === 'voting' || model.type === 'stacking') { metrics.accuracy = Math.min(0.99, metrics.accuracy + 0.05); metrics.f1 = Math.min(0.99, metrics.f1 + 0.05); }
      setModels((prev) => prev.map((m) => m.id === model.id ? { ...m, training: false, trained: true, metrics } : m));
    }
    setIsTraining(false);
  };

  const trainedModels = models.filter((m) => m.trained);
  const radarData = trainedModels.filter((m) => m.metrics).slice(0, 4).map((m) => ({ name: m.name.split(' ')[0], ...m.metrics }));
  const radarFormatted = [{ key: 'accuracy', name: 'Accuracy' }, { key: 'precision', name: 'Precision' }, { key: 'recall', name: 'Recall' }, { key: 'f1', name: 'F1-Score' }, { key: 'rocAuc', name: 'ROC-AUC' }].map((metric) => ({ metric: metric.name, ...Object.fromEntries(radarData.map((d) => [d.name, (d as any)[metric.key] * 100])) }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-display font-bold">Model Training</h1><p className="text-muted-foreground mt-1">Train individual and ensemble ML models with swarm optimization</p></div><Button onClick={trainModels} disabled={isTraining || models.filter(m => m.selected).length === 0}>{isTraining ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Training...</> : <><Play className="h-4 w-4 mr-2" />Train Selected Models</>}</Button></div>
      <div className="glass-card p-6"><h3 className="text-lg font-display font-semibold mb-4">Training Configuration</h3><div className="flex flex-wrap gap-6"><div className="flex items-center gap-3"><Checkbox id="smote" checked={smoteEnabled} onCheckedChange={(checked) => setSmoteEnabled(!!checked)} /><label htmlFor="smote" className="text-sm"><span className="font-medium">SMOTE Oversampling</span><p className="text-xs text-muted-foreground">Balance class distribution</p></label></div><div className="flex items-center gap-3"><Checkbox id="swarm" checked={swarmOptimized} onCheckedChange={(checked) => setSwarmOptimized(!!checked)} /><label htmlFor="swarm" className="text-sm"><span className="font-medium">Swarm Optimization</span><p className="text-xs text-muted-foreground">Tune hyperparameters with PSO+GA+ACO</p></label></div></div></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6"><h3 className="text-lg font-display font-semibold mb-6">Select Models</h3><div className="space-y-3">{models.map((model) => (<div key={model.id} className={`flex items-center justify-between p-4 rounded-lg border transition-all ${model.selected ? 'border-primary/50 bg-primary/5' : 'border-border bg-secondary/30'}`}><div className="flex items-center gap-4"><Checkbox checked={model.selected} onCheckedChange={() => setModels((p) => p.map((m) => m.id === model.id ? { ...m, selected: !m.selected } : m))} disabled={model.training} /><div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${model.type === 'voting' || model.type === 'stacking' ? 'bg-accent/10' : 'bg-primary/10'}`}>{model.type === 'voting' || model.type === 'stacking' ? <Layers className="h-4 w-4 text-accent" /> : <Cpu className="h-4 w-4 text-primary" />}</div><div><p className="font-medium">{model.name}</p><p className="text-xs text-muted-foreground capitalize">{model.type.replace('_', ' ')}</p></div></div></div><div className="flex items-center gap-2">{model.training && <span className="metric-badge warning"><Loader2 className="h-3 w-3 animate-spin" />Training</span>}{model.trained && !model.training && <span className="metric-badge success"><Check className="h-3 w-3" />Trained</span>}{model.metrics && <span className="text-lg font-bold text-primary">{(model.metrics.accuracy * 100).toFixed(1)}%</span>}</div></div>))}</div></div>
        <div className="chart-container"><h3 className="text-lg font-display font-semibold mb-6">Model Comparison</h3>{trainedModels.length > 0 ? <ResponsiveContainer width="100%" height={350}><RadarChart data={radarFormatted}><PolarGrid stroke="hsl(222, 30%, 18%)" /><PolarAngleAxis dataKey="metric" stroke="hsl(215, 20%, 55%)" fontSize={11} /><PolarRadiusAxis angle={30} domain={[0, 100]} stroke="hsl(215, 20%, 55%)" fontSize={10} />{radarData.slice(0, 4).map((model, index) => <Radar key={model.name} name={model.name} dataKey={model.name} stroke={index === 0 ? 'hsl(175, 80%, 50%)' : index === 1 ? 'hsl(280, 70%, 55%)' : index === 2 ? 'hsl(45, 95%, 55%)' : 'hsl(150, 70%, 45%)'} fill={index === 0 ? 'hsl(175, 80%, 50%)' : index === 1 ? 'hsl(280, 70%, 55%)' : index === 2 ? 'hsl(45, 95%, 55%)' : 'hsl(150, 70%, 45%)'} fillOpacity={0.1} strokeWidth={2} />)}<Legend /></RadarChart></ResponsiveContainer> : <div className="flex items-center justify-center h-[350px] text-muted-foreground"><div className="text-center"><Cpu className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>Train models to see comparison</p></div></div>}</div>
      </div>
      {trainedModels.length > 0 && <div className="glass-card p-6"><h3 className="text-lg font-display font-semibold mb-6">Training Results</h3><div className="overflow-x-auto custom-scrollbar"><table className="w-full text-sm"><thead><tr className="border-b border-border"><th className="text-left py-3 px-4 font-medium text-muted-foreground">Model</th><th className="text-center py-3 px-4 font-medium text-muted-foreground">Accuracy</th><th className="text-center py-3 px-4 font-medium text-muted-foreground">Precision</th><th className="text-center py-3 px-4 font-medium text-muted-foreground">Recall</th><th className="text-center py-3 px-4 font-medium text-muted-foreground">F1-Score</th><th className="text-center py-3 px-4 font-medium text-muted-foreground">ROC-AUC</th></tr></thead><tbody>{trainedModels.map((model) => <tr key={model.id} className="border-b border-border/50 hover:bg-secondary/30"><td className="py-3 px-4 font-medium">{model.name}</td><td className="py-3 px-4 text-center"><span className={`font-bold ${model.metrics!.accuracy > 0.9 ? 'text-success' : ''}`}>{(model.metrics!.accuracy * 100).toFixed(2)}%</span></td><td className="py-3 px-4 text-center">{(model.metrics!.precision * 100).toFixed(2)}%</td><td className="py-3 px-4 text-center">{(model.metrics!.recall * 100).toFixed(2)}%</td><td className="py-3 px-4 text-center">{(model.metrics!.f1 * 100).toFixed(2)}%</td><td className="py-3 px-4 text-center">{(model.metrics!.rocAuc * 100).toFixed(2)}%</td></tr>)}</tbody></table></div></div>}
    </div>
  );
}

// ==================== OPTIMIZATION PAGE ====================
interface ConvergencePoint { iteration: number; pso: number; ga: number; aco: number; hybrid: number; }
const generateConvergenceData = (iterations: number): ConvergencePoint[] => Array.from({ length: iterations + 1 }, (_, i) => ({ iteration: i, pso: 0.6 + 0.35 * (1 - Math.exp(-i / 20)) + Math.random() * 0.02, ga: 0.58 + 0.33 * (1 - Math.exp(-i / 25)) + Math.random() * 0.02, aco: 0.55 + 0.36 * (1 - Math.exp(-i / 22)) + Math.random() * 0.02, hybrid: 0.65 + 0.32 * (1 - Math.exp(-i / 15)) + Math.random() * 0.01 }));

export function OptimizationPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [convergenceData, setConvergenceData] = useState<ConvergencePoint[]>([]);
  const maxIterations = 100;

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setCurrentIteration((prev) => {
        if (prev >= maxIterations) { setIsRunning(false); return prev; }
        setConvergenceData(generateConvergenceData(prev + 1));
        return prev + 1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => { if (currentIteration >= maxIterations) { setCurrentIteration(0); setConvergenceData([]); } setIsRunning(true); };
  const latestData = convergenceData[convergenceData.length - 1] || { pso: 0, ga: 0, aco: 0, hybrid: 0 };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-display font-bold">Swarm Optimization Engine</h1><p className="text-muted-foreground mt-1">Hybrid PSO + GA + ACO for hyperparameter tuning and feature selection</p></div><div className="flex items-center gap-2">{isRunning ? <Button variant="outline" onClick={() => setIsRunning(false)}><Pause className="h-4 w-4 mr-2" />Pause</Button> : <Button onClick={handleStart}><Play className="h-4 w-4 mr-2" />{currentIteration > 0 ? 'Resume' : 'Start Optimization'}</Button>}<Button variant="outline" onClick={() => { setIsRunning(false); setCurrentIteration(0); setConvergenceData([]); }}><RotateCcw className="h-4 w-4 mr-2" />Reset</Button></div></div>
      <div className="glass-card p-6"><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3"><div className={`p-2 rounded-lg bg-primary/10 ${isRunning ? 'animate-pulse' : ''}`}><Zap className="h-5 w-5 text-primary" /></div><div><p className="font-medium">{isRunning ? 'Optimization in Progress...' : currentIteration === maxIterations ? 'Optimization Complete' : 'Ready to Optimize'}</p><p className="text-sm text-muted-foreground">Iteration {currentIteration} / {maxIterations}</p></div></div><span className="text-2xl font-bold text-primary">{((currentIteration / maxIterations) * 100).toFixed(0)}%</span></div><Progress value={(currentIteration / maxIterations) * 100} className="h-2" /></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 border-l-4 border-l-primary"><div className="flex items-center gap-3 mb-3"><Zap className="h-5 w-5 text-primary" /><span className="font-medium">PSO</span></div><p className="text-3xl font-bold">{(latestData.pso * 100).toFixed(1)}%</p><p className="text-sm text-muted-foreground">Particle Swarm</p></div>
        <div className="glass-card p-5 border-l-4 border-l-accent"><div className="flex items-center gap-3 mb-3"><Dna className="h-5 w-5 text-accent" /><span className="font-medium">GA</span></div><p className="text-3xl font-bold">{(latestData.ga * 100).toFixed(1)}%</p><p className="text-sm text-muted-foreground">Genetic Algorithm</p></div>
        <div className="glass-card p-5 border-l-4 border-l-warning"><div className="flex items-center gap-3 mb-3"><Bug className="h-5 w-5 text-warning" /><span className="font-medium">ACO</span></div><p className="text-3xl font-bold">{(latestData.aco * 100).toFixed(1)}%</p><p className="text-sm text-muted-foreground">Ant Colony</p></div>
        <div className="glass-card p-5 border-l-4 border-l-success glow-effect"><div className="flex items-center gap-3 mb-3"><Zap className="h-5 w-5 text-success" /><span className="font-medium">Hybrid</span></div><p className="text-3xl font-bold text-success">{(latestData.hybrid * 100).toFixed(1)}%</p><p className="text-sm text-muted-foreground">Combined Best</p></div>
      </div>
      <div className="chart-container"><h3 className="text-lg font-display font-semibold mb-6">Convergence Analysis</h3><ResponsiveContainer width="100%" height={400}><LineChart data={convergenceData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" /><XAxis dataKey="iteration" stroke="hsl(215, 20%, 55%)" fontSize={12} /><YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} domain={[0.5, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} /><Tooltip contentStyle={{ backgroundColor: 'hsl(222, 47%, 10%)', border: '1px solid hsl(222, 30%, 18%)', borderRadius: '8px' }} formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, '']} /><Legend /><Line type="monotone" dataKey="pso" stroke="hsl(175, 80%, 50%)" strokeWidth={2} dot={false} name="PSO" /><Line type="monotone" dataKey="ga" stroke="hsl(280, 70%, 55%)" strokeWidth={2} dot={false} name="GA" /><Line type="monotone" dataKey="aco" stroke="hsl(45, 95%, 55%)" strokeWidth={2} dot={false} name="ACO" /><Line type="monotone" dataKey="hybrid" stroke="hsl(150, 70%, 45%)" strokeWidth={3} dot={false} name="Hybrid" /></LineChart></ResponsiveContainer></div>
      <Tabs defaultValue="pso" className="glass-card p-6"><TabsList className="mb-6"><TabsTrigger value="pso">PSO</TabsTrigger><TabsTrigger value="ga">Genetic Algorithm</TabsTrigger><TabsTrigger value="aco">Ant Colony</TabsTrigger><TabsTrigger value="hybrid">Hybrid</TabsTrigger></TabsList>
        <TabsContent value="pso" className="space-y-4"><h4 className="font-display font-semibold">Particle Swarm Optimization</h4><p className="text-muted-foreground">PSO simulates bird flocking behavior where particles move through the solution space, adjusting their velocities based on personal and global best positions.</p><div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4"><div className="p-4 rounded-lg bg-secondary/50"><p className="text-sm text-muted-foreground">Population Size</p><p className="text-xl font-bold">50</p></div><div className="p-4 rounded-lg bg-secondary/50"><p className="text-sm text-muted-foreground">Inertia Weight</p><p className="text-xl font-bold">0.729</p></div><div className="p-4 rounded-lg bg-secondary/50"><p className="text-sm text-muted-foreground">c1 (Cognitive)</p><p className="text-xl font-bold">1.49</p></div><div className="p-4 rounded-lg bg-secondary/50"><p className="text-sm text-muted-foreground">c2 (Social)</p><p className="text-xl font-bold">1.49</p></div></div></TabsContent>
        <TabsContent value="ga" className="space-y-4"><h4 className="font-display font-semibold">Genetic Algorithm</h4><p className="text-muted-foreground">GA uses evolution-inspired operators including selection, crossover, and mutation to evolve better solutions over generations.</p><div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4"><div className="p-4 rounded-lg bg-secondary/50"><p className="text-sm text-muted-foreground">Population</p><p className="text-xl font-bold">100</p></div><div className="p-4 rounded-lg bg-secondary/50"><p className="text-sm text-muted-foreground">Crossover Rate</p><p className="text-xl font-bold">0.85</p></div><div className="p-4 rounded-lg bg-secondary/50"><p className="text-sm text-muted-foreground">Mutation Rate</p><p className="text-xl font-bold">0.01</p></div><div className="p-4 rounded-lg bg-secondary/50"><p className="text-sm text-muted-foreground">Selection</p><p className="text-xl font-bold">Tournament</p></div></div></TabsContent>
        <TabsContent value="aco" className="space-y-4"><h4 className="font-display font-semibold">Ant Colony Optimization</h4><p className="text-muted-foreground">ACO mimics ant foraging behavior using pheromone trails to find optimal paths, adapted here for feature selection and hyperparameter tuning.</p><div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4"><div className="p-4 rounded-lg bg-secondary/50"><p className="text-sm text-muted-foreground">Ant Count</p><p className="text-xl font-bold">30</p></div><div className="p-4 rounded-lg bg-secondary/50"><p className="text-sm text-muted-foreground">Alpha (α)</p><p className="text-xl font-bold">1.0</p></div><div className="p-4 rounded-lg bg-secondary/50"><p className="text-sm text-muted-foreground">Beta (β)</p><p className="text-xl font-bold">2.0</p></div><div className="p-4 rounded-lg bg-secondary/50"><p className="text-sm text-muted-foreground">Evaporation</p><p className="text-xl font-bold">0.5</p></div></div></TabsContent>
        <TabsContent value="hybrid" className="space-y-4"><h4 className="font-display font-semibold">Hybrid Swarm Optimization</h4><p className="text-muted-foreground">Our hybrid approach combines the exploration of PSO, the genetic diversity of GA, and the path-finding efficiency of ACO for superior optimization performance.</p><div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4"><div className="p-4 rounded-lg bg-secondary/50"><p className="text-sm text-muted-foreground">PSO Weight</p><p className="text-xl font-bold">0.35</p></div><div className="p-4 rounded-lg bg-secondary/50"><p className="text-sm text-muted-foreground">GA Weight</p><p className="text-xl font-bold">0.35</p></div><div className="p-4 rounded-lg bg-secondary/50"><p className="text-sm text-muted-foreground">ACO Weight</p><p className="text-xl font-bold">0.30</p></div><div className="p-4 rounded-lg bg-secondary/50"><p className="text-sm text-muted-foreground">Improvement</p><p className="text-xl font-bold text-success">+12.4%</p></div></div></TabsContent>
      </Tabs>
    </div>
  );
}

// ==================== PREDICTIONS PAGE ====================
interface PredictionResult { id: string; moduleName: string; result: 'defective' | 'non-defective'; probability: number; riskLevel: 'low' | 'medium' | 'high'; confidence: number; featureContributions: { feature: string; contribution: number; direction: 'positive' | 'negative' }[]; }
const mockFeatureContributions = [{ feature: 'Cyclomatic Complexity', contribution: 0.28, direction: 'positive' as const }, { feature: 'Lines of Code', contribution: 0.22, direction: 'positive' as const }, { feature: 'Code Churn', contribution: 0.18, direction: 'positive' as const }, { feature: 'Comment Density', contribution: -0.15, direction: 'negative' as const }, { feature: 'Developer Experience', contribution: -0.12, direction: 'negative' as const }, { feature: 'Test Coverage', contribution: -0.05, direction: 'negative' as const }];

export function PredictionsPage() {
  const [activeTab, setActiveTab] = useState('single');
  const [isLoading, setIsLoading] = useState(false);
  const [singleInput, setSingleInput] = useState({ loc: '', cc: '', commentDensity: '', numFunctions: '', codeChurn: '' });
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  const handleSinglePredict = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const probability = Math.random();
    setPrediction({ id: Date.now().toString(), moduleName: 'input_module.py', result: probability > 0.5 ? 'defective' : 'non-defective', probability, riskLevel: probability > 0.7 ? 'high' : probability > 0.4 ? 'medium' : 'low', confidence: 0.85 + Math.random() * 0.1, featureContributions: mockFeatureContributions });
    setIsLoading(false);
  };

  const chartData = prediction?.featureContributions.map((f) => ({ feature: f.feature.length > 15 ? f.feature.slice(0, 15) + '...' : f.feature, contribution: Math.abs(f.contribution) * 100, direction: f.direction }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div><h1 className="text-3xl font-display font-bold">Defect Prediction</h1><p className="text-muted-foreground mt-1">Predict defects with explainable AI insights</p></div>
      <Tabs value={activeTab} onValueChange={setActiveTab}><TabsList className="mb-6"><TabsTrigger value="single">Single Prediction</TabsTrigger><TabsTrigger value="batch">Batch Upload</TabsTrigger><TabsTrigger value="code">Code Analysis</TabsTrigger></TabsList>
        <TabsContent value="single" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6"><h3 className="text-lg font-display font-semibold mb-6">Module Metrics</h3><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><label className="text-sm font-medium">Lines of Code</label><Input type="number" placeholder="e.g., 250" value={singleInput.loc} onChange={(e) => setSingleInput({ ...singleInput, loc: e.target.value })} /></div><div className="space-y-2"><label className="text-sm font-medium">Cyclomatic Complexity</label><Input type="number" placeholder="e.g., 15" value={singleInput.cc} onChange={(e) => setSingleInput({ ...singleInput, cc: e.target.value })} /></div><div className="space-y-2"><label className="text-sm font-medium">Comment Density</label><Input type="number" step="0.01" placeholder="e.g., 0.25" value={singleInput.commentDensity} onChange={(e) => setSingleInput({ ...singleInput, commentDensity: e.target.value })} /></div><div className="space-y-2"><label className="text-sm font-medium">Number of Functions</label><Input type="number" placeholder="e.g., 12" value={singleInput.numFunctions} onChange={(e) => setSingleInput({ ...singleInput, numFunctions: e.target.value })} /></div><div className="col-span-2 space-y-2"><label className="text-sm font-medium">Code Churn</label><Input type="number" placeholder="e.g., 45" value={singleInput.codeChurn} onChange={(e) => setSingleInput({ ...singleInput, codeChurn: e.target.value })} /></div></div><Button className="w-full mt-6" onClick={handleSinglePredict} disabled={isLoading}>{isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing...</> : <><Brain className="h-4 w-4 mr-2" />Predict Defect</>}</Button></div>
            <div className="glass-card p-6"><h3 className="text-lg font-display font-semibold mb-6">Prediction Result</h3>{prediction ? <div className="space-y-6"><div className={`p-6 rounded-xl text-center ${prediction.result === 'defective' ? 'bg-destructive/10 border border-destructive/30' : 'bg-success/10 border border-success/30'}`}><div className={`inline-flex p-4 rounded-full mb-4 ${prediction.result === 'defective' ? 'bg-destructive/20' : 'bg-success/20'}`}>{prediction.result === 'defective' ? <AlertTriangle className="h-8 w-8 text-destructive" /> : <Check className="h-8 w-8 text-success" />}</div><h4 className="text-2xl font-display font-bold capitalize mb-2">{prediction.result.replace('-', ' ')}</h4><p className="text-muted-foreground">{(prediction.probability * 100).toFixed(1)}% defect probability</p></div><div className="grid grid-cols-2 gap-4"><div className="p-4 rounded-lg bg-secondary/50"><p className="text-sm text-muted-foreground">Risk Level</p><p className={`text-xl font-bold capitalize ${prediction.riskLevel === 'high' ? 'text-destructive' : prediction.riskLevel === 'medium' ? 'text-warning' : 'text-success'}`}>{prediction.riskLevel}</p></div><div className="p-4 rounded-lg bg-secondary/50"><p className="text-sm text-muted-foreground">Confidence</p><p className="text-xl font-bold">{(prediction.confidence * 100).toFixed(1)}%</p></div></div></div> : <div className="flex flex-col items-center justify-center py-12 text-muted-foreground"><Brain className="h-12 w-12 mb-4 opacity-50" /><p>Enter metrics and click Predict</p></div>}</div>
          </div>
          {prediction && <div className="glass-card p-6"><div className="flex items-center gap-2 mb-6"><Info className="h-5 w-5 text-primary" /><h3 className="text-lg font-display font-semibold">Explainable AI - Why This Prediction?</h3></div><div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><div><h4 className="text-sm font-medium text-muted-foreground mb-4">Feature Contributions</h4><ResponsiveContainer width="100%" height={250}><BarChart data={chartData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" /><XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={12} /><YAxis dataKey="feature" type="category" stroke="hsl(215, 20%, 55%)" fontSize={11} width={100} /><Tooltip contentStyle={{ backgroundColor: 'hsl(222, 47%, 10%)', border: '1px solid hsl(222, 30%, 18%)', borderRadius: '8px' }} formatter={(value: number) => [`${value.toFixed(1)}%`, 'Contribution']} /><Bar dataKey="contribution" radius={[0, 4, 4, 0]}>{chartData?.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.direction === 'positive' ? 'hsl(0, 75%, 55%)' : 'hsl(150, 70%, 45%)'} />)}</Bar></BarChart></ResponsiveContainer></div><div className="space-y-3"><h4 className="text-sm font-medium text-muted-foreground mb-4">Contribution Details</h4>{prediction.featureContributions.map((fc) => <div key={fc.feature} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"><div className="flex items-center gap-3">{fc.direction === 'positive' ? <TrendingUp className="h-4 w-4 text-destructive" /> : <TrendingDown className="h-4 w-4 text-success" />}<span className="text-sm">{fc.feature}</span></div><span className={`font-bold ${fc.direction === 'positive' ? 'text-destructive' : 'text-success'}`}>{fc.direction === 'positive' ? '+' : ''}{(fc.contribution * 100).toFixed(1)}%</span></div>)}</div></div></div>}
        </TabsContent>
        <TabsContent value="batch" className="space-y-6"><div className="glass-card p-12"><div className="text-center space-y-4"><Upload className="h-12 w-12 mx-auto text-muted-foreground" /><div><p className="font-medium">Upload CSV for Batch Prediction</p><p className="text-sm text-muted-foreground mt-1">Upload a file with multiple modules for bulk analysis</p></div><Button variant="outline"><Upload className="h-4 w-4 mr-2" />Select CSV File</Button></div></div></TabsContent>
        <TabsContent value="code" className="space-y-6"><div className="glass-card p-6"><h3 className="text-lg font-display font-semibold mb-4">Paste Source Code</h3><Textarea placeholder="Paste your Python, JavaScript, Java, or other source code here..." className="h-64 font-mono text-sm" /><div className="flex items-center justify-between mt-4"><p className="text-sm text-muted-foreground"><FileCode className="h-4 w-4 inline mr-1" />Supports Python, JavaScript, Java, C++, Go</p><Button><Brain className="h-4 w-4 mr-2" />Analyze Code</Button></div></div></TabsContent>
      </Tabs>
    </div>
  );
}

// ==================== WEBSITE ANALYSIS PAGE ====================
interface DefectItem {
  id: string;
  category: 'security' | 'accessibility' | 'performance' | 'seo' | 'ux' | 'code-quality' | 'functionality' | 'future-risk' | 'engagement' | 'brand-safety' | 'content-quality';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  location: string;
  description: string;
  impact: string;
  fix: string;
  isFuturePrediction: boolean;
}

interface PreventiveMeasure {
  title: string;
  description: string;
  importance: 'critical' | 'high' | 'medium';
}

interface AnalysisResult {
  healthScore: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  summary: string;
  defects: DefectItem[];
  priorityFixes: string[];
  preventiveMeasures: PreventiveMeasure[];
  metrics: {
    securityScore: number;
    accessibilityScore: number;
    performanceScore: number;
    seoScore: number;
    codeQualityScore: number;
    engagementScore?: number;
    brandSafetyScore?: number;
    contentQualityScore?: number;
  };
}

type SocialPlatform = 'instagram' | 'snapchat' | 'tiktok' | 'twitter' | 'facebook' | 'linkedin' | 'youtube';

type SocialAnalysisMode = 'platform-url' | 'post-content';

interface SocialMediaPost {
  platform: SocialPlatform;
  postType: string;
  caption: string;
  hashtags: string;
  mentions: string;
  likes: string;
  comments: string;
  shares: string;
  views: string;
  engagementRate: string;
  postDate: string;
  additionalContext: string;
}

interface PlatformUXIssue {
  category: string;
  examples: string[];
}

const platformUXIssues: Record<SocialPlatform, PlatformUXIssue[]> = {
  instagram: [
    { category: 'Scrolling Issues', examples: ['Reels scroll too fast', 'Feed jumps back to top', 'Stories auto-advance too quickly'] },
    { category: 'Loading Problems', examples: ['Images load slowly', 'Reels buffer constantly', 'Stories fail to load'] },
    { category: 'Navigation Issues', examples: ['Explore tab unresponsive', 'DMs slow to open', 'Profile takes forever'] },
    { category: 'Video Playback', examples: ['Audio desync', 'Video quality drops', 'Autoplay not working'] },
  ],
  snapchat: [
    { category: 'Camera Issues', examples: ['Filters lag', 'Camera freezes', 'Lens effects delay'] },
    { category: 'Story Problems', examples: ['Stories won\'t upload', 'Views not updating', 'Story order jumbled'] },
    { category: 'Chat Issues', examples: ['Messages not sending', 'Snaps stuck on pending', 'Bitmoji not loading'] },
    { category: 'Map Features', examples: ['Location inaccurate', 'Map loads slowly', 'Friends not showing'] },
  ],
  tiktok: [
    { category: 'For You Page Issues', examples: ['Videos repeat too often', 'Scroll sensitivity too high', 'Content not personalized'] },
    { category: 'Video Problems', examples: ['Videos won\'t play', 'Sound cuts out', 'Captions disappear'] },
    { category: 'Upload Issues', examples: ['Videos fail to post', 'Drafts deleted', 'Effects not applying'] },
    { category: 'Live Stream Issues', examples: ['Stream buffering', 'Comments lag', 'Gifts not sending'] },
  ],
  twitter: [
    { category: 'Timeline Problems', examples: ['Tweets not loading', 'Timeline jumps around', 'Missing tweets from follows'] },
    { category: 'Media Issues', examples: ['Images won\'t expand', 'Videos auto-muted', 'GIFs not playing'] },
    { category: 'Notification Issues', examples: ['Delayed notifications', 'Missing mentions', 'DMs not alerting'] },
    { category: 'Search Problems', examples: ['Search results outdated', 'Hashtags not working', 'Trends inaccurate'] },
  ],
  facebook: [
    { category: 'News Feed Issues', examples: ['Posts out of order', 'Feed refreshes unexpectedly', 'Same posts repeated'] },
    { category: 'Video Problems', examples: ['Reels buffer constantly', 'Videos auto-play loudly', 'Live streams lag'] },
    { category: 'Messenger Issues', examples: ['Messages delayed', 'Calls drop frequently', 'Reactions slow'] },
    { category: 'Group Problems', examples: ['Posts not appearing', 'Notifications overwhelming', 'Members list wrong'] },
  ],
  linkedin: [
    { category: 'Feed Issues', examples: ['Posts load slowly', 'Engagement counts wrong', 'Old content shown'] },
    { category: 'Connection Problems', examples: ['Invites pending forever', 'Profile views inaccurate', 'Messages delayed'] },
    { category: 'Job Search Issues', examples: ['Filters don\'t work', 'Applications fail', 'Saved jobs disappear'] },
    { category: 'Profile Problems', examples: ['Edits not saving', 'Skills section buggy', 'Endorsements not showing'] },
  ],
  youtube: [
    { category: 'Playback Issues', examples: ['Videos buffer constantly', 'Quality changes randomly', 'Subtitles out of sync'] },
    { category: 'Shorts Problems', examples: ['Scroll too sensitive', 'Videos loop incorrectly', 'Comments not loading'] },
    { category: 'Subscription Issues', examples: ['Missing uploads from subscriptions', 'Notifications not working', 'Watch later not saving'] },
    { category: 'Comment Problems', examples: ['Comments not posting', 'Reply threads broken', 'Likes not registering'] },
  ],
};

const socialPlatformConfig: Record<SocialPlatform, { label: string; icon: string; color: string; postTypes: string[] }> = {
  instagram: { label: 'Instagram', icon: '📸', color: 'from-pink-500 to-purple-500', postTypes: ['Feed Post', 'Reel', 'Story', 'IGTV', 'Carousel'] },
  snapchat: { label: 'Snapchat', icon: '👻', color: 'from-yellow-400 to-yellow-500', postTypes: ['Snap', 'Story', 'Spotlight'] },
  tiktok: { label: 'TikTok', icon: '🎵', color: 'from-black to-pink-500', postTypes: ['Video', 'Duet', 'Stitch', 'Live'] },
  twitter: { label: 'Twitter/X', icon: '𝕏', color: 'from-gray-700 to-gray-900', postTypes: ['Tweet', 'Thread', 'Reply', 'Retweet'] },
  facebook: { label: 'Facebook', icon: '📘', color: 'from-blue-600 to-blue-700', postTypes: ['Post', 'Reel', 'Story', 'Video', 'Event'] },
  linkedin: { label: 'LinkedIn', icon: '💼', color: 'from-blue-700 to-blue-800', postTypes: ['Post', 'Article', 'Video', 'Poll'] },
  youtube: { label: 'YouTube', icon: '▶️', color: 'from-red-600 to-red-700', postTypes: ['Video', 'Short', 'Live', 'Community Post'] },
};

const emptySocialPost: SocialMediaPost = {
  platform: 'instagram',
  postType: 'Feed Post',
  caption: '',
  hashtags: '',
  mentions: '',
  likes: '',
  comments: '',
  shares: '',
  views: '',
  engagementRate: '',
  postDate: '',
  additionalContext: '',
};

const categoryIcons: Record<string, React.ElementType> = {
  security: Shield,
  accessibility: User,
  performance: Gauge,
  seo: Search,
  ux: Layers,
  'code-quality': FileCode,
  functionality: Bug,
  'future-risk': TrendingDown,
  engagement: TrendingUp,
  'brand-safety': Shield,
  'content-quality': FileText,
};

const categoryColors: Record<string, string> = {
  security: 'text-destructive',
  accessibility: 'text-accent',
  performance: 'text-warning',
  seo: 'text-primary',
  ux: 'text-success',
  'code-quality': 'text-muted-foreground',
  functionality: 'text-destructive',
  'future-risk': 'text-warning',
  engagement: 'text-success',
  'brand-safety': 'text-primary',
  'content-quality': 'text-accent',
};

const severityColors: Record<string, string> = {
  critical: 'bg-destructive/20 text-destructive border-destructive/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-warning/20 text-warning border-warning/30',
  low: 'bg-muted text-muted-foreground border-border',
};

export function WebsiteAnalysisPage() {
  const [inputMode, setInputMode] = useState<'url' | 'manual' | 'social'>('url');
  const [url, setUrl] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [contentSource, setContentSource] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'current' | 'future' | 'prevention'>('current');
  const [socialPost, setSocialPost] = useState<SocialMediaPost>(emptySocialPost);
  const [batchPosts, setBatchPosts] = useState<SocialMediaPost[]>([]);
  const [socialAnalysisMode, setSocialAnalysisMode] = useState<SocialAnalysisMode>('platform-url');
  const [socialPlatformUrl, setSocialPlatformUrl] = useState('');
  const [selectedPlatformForUrl, setSelectedPlatformForUrl] = useState<SocialPlatform>('instagram');
  const [userExperienceIssues, setUserExperienceIssues] = useState<string>('');

  const formatSocialPostForAnalysis = (post: SocialMediaPost): string => {
    const config = socialPlatformConfig[post.platform];
    return `
=== ${config.label.toUpperCase()} ${post.postType.toUpperCase()} ANALYSIS ===

PLATFORM: ${config.label}
POST TYPE: ${post.postType}
${post.postDate ? `DATE: ${post.postDate}` : ''}

--- CONTENT ---
CAPTION/TEXT:
${post.caption || '[No caption provided]'}

HASHTAGS: ${post.hashtags || 'None'}
MENTIONS: ${post.mentions || 'None'}

--- ENGAGEMENT METRICS ---
Likes: ${post.likes || 'N/A'}
Comments: ${post.comments || 'N/A'}
Shares/Reposts: ${post.shares || 'N/A'}
Views: ${post.views || 'N/A'}
Engagement Rate: ${post.engagementRate || 'N/A'}

--- ADDITIONAL CONTEXT ---
${post.additionalContext || 'None provided'}

Please analyze this social media content for:
1. Content Quality (grammar, clarity, messaging)
2. Engagement Potential (call-to-action, hashtag effectiveness)
3. Brand Safety (inappropriate content, potential controversy)
4. Platform Best Practices (optimal length, format usage)
5. Future Risks (trend relevance, potential backlash)
6. Improvement Recommendations
`.trim();
  };

  const formatPlatformUrlForAnalysis = (): string => {
    const config = socialPlatformConfig[selectedPlatformForUrl];
    const knownIssues = platformUXIssues[selectedPlatformForUrl];
    
    return `
=== ${config.label.toUpperCase()} PLATFORM UX/DEFECT ANALYSIS ===

PLATFORM: ${config.label}
URL: ${socialPlatformUrl}

--- USER EXPERIENCE ISSUES TO ANALYZE ---
This is a ${config.label} platform analysis. Analyze the platform for common UX defects and issues that users experience.

KNOWN COMMON ISSUES ON ${config.label.toUpperCase()}:
${knownIssues.map(issue => `
${issue.category}:
${issue.examples.map(ex => `  • ${ex}`).join('\n')}`).join('\n')}

--- USER REPORTED ISSUES ---
${userExperienceIssues || 'No specific issues reported. Analyze for general platform defects.'}

Please analyze this social media platform for:
1. SCROLLING DEFECTS - Issues like content scrolling too fast, unexpected jumps, sensitivity problems
2. LOADING PROBLEMS - Slow content load, buffering, images/videos not appearing
3. NAVIGATION BUGS - Unresponsive buttons, broken links, confusing UI flows
4. VIDEO/MEDIA ISSUES - Playback problems, audio sync, quality degradation
5. PERFORMANCE PROBLEMS - App freezing, crashes, memory issues, battery drain
6. NOTIFICATION BUGS - Delayed alerts, missing notifications, incorrect counts
7. CONTENT DISPLAY ISSUES - Layout problems, text cut off, image cropping
8. INTERACTION BUGS - Likes/comments not registering, shares failing

For each defect found:
- Describe the issue in simple everyday language
- Explain the ROOT CAUSE (why this happens technically)
- Provide PREVENTION steps (how users can avoid or fix it)
- Rate severity based on user impact
`.trim();
  };

  const addBatchPost = () => {
    if (socialPost.caption.trim()) {
      setBatchPosts([...batchPosts, { ...socialPost }]);
      setSocialPost({ ...emptySocialPost, platform: socialPost.platform });
    }
  };

  const removeBatchPost = (index: number) => {
    setBatchPosts(batchPosts.filter((_, i) => i !== index));
  };

  const analyzeWebsite = async () => {
    if (inputMode === 'url' && !url) return;
    if (inputMode === 'manual' && !manualContent.trim()) return;
    if (inputMode === 'social') {
      if (socialAnalysisMode === 'platform-url' && !socialPlatformUrl.trim()) return;
      if (socialAnalysisMode === 'post-content' && !socialPost.caption.trim() && batchPosts.length === 0) return;
    }
    
    setIsAnalyzing(true);
    setProgress(0);
    setAnalysis(null);
    setError(null);

    try {
      let websiteData;
      let sourceUrl = url;

      if (inputMode === 'url') {
        // Step 1: Scrape the website
        setProgressMessage('Fetching website content...');
        setProgress(20);
        
        const scrapeResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scrape-website`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });

        const scrapeData = await scrapeResponse.json();
        
        if (!scrapeResponse.ok || !scrapeData.success) {
          throw new Error(scrapeData.error || 'Failed to scrape website');
        }
        
        websiteData = scrapeData.data;
      } else if (inputMode === 'social') {
        // Social media analysis mode
        setProgressMessage('Processing social media content...');
        setProgress(20);
        
        if (socialAnalysisMode === 'platform-url') {
          // Platform URL analysis for UX defects
          const platformLabel = socialPlatformConfig[selectedPlatformForUrl].label;
          sourceUrl = socialPlatformUrl || `${platformLabel} Platform`;
          
          const formattedContent = formatPlatformUrlForAnalysis();
          
          websiteData = {
            markdown: formattedContent,
            html: null,
            links: [],
            metadata: { 
              title: `${platformLabel} Platform UX Analysis`, 
              sourceURL: sourceUrl,
              platform: selectedPlatformForUrl,
              isSocialMedia: true,
              analysisType: 'platform-ux'
            }
          };
        } else {
          // Post content analysis
          const postsToAnalyze = batchPosts.length > 0 ? batchPosts : [socialPost];
          const formattedContent = postsToAnalyze.map(formatSocialPostForAnalysis).join('\n\n---\n\n');
          const platformLabel = socialPlatformConfig[socialPost.platform].label;
          sourceUrl = `${platformLabel} Analysis`;
          
          websiteData = {
            markdown: formattedContent,
            html: null,
            links: [],
            metadata: { 
              title: `${platformLabel} Content Analysis`, 
              sourceURL: sourceUrl,
              platform: socialPost.platform,
              isSocialMedia: true,
              analysisType: 'post-content'
            }
          };
        }
      } else {
        // Manual content mode
        setProgressMessage('Processing manual content...');
        setProgress(20);
        sourceUrl = contentSource || 'Manual Input';
        
        // Determine if content is HTML or plain text
        const isHtml = manualContent.trim().startsWith('<') || manualContent.includes('</');
        websiteData = {
          markdown: isHtml ? null : manualContent,
          html: isHtml ? manualContent : null,
          links: [],
          metadata: { title: contentSource || 'Manual Content', sourceURL: sourceUrl }
        };
      }

      setProgress(50);
      setProgressMessage('Analyzing content with AI...');

      // Step 2: Analyze with AI
      const analyzeResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-website`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteData, url: sourceUrl }),
      });

      const analyzeData = await analyzeResponse.json();

      if (!analyzeResponse.ok || !analyzeData.success) {
        throw new Error(analyzeData.error || 'Failed to analyze website');
      }

      setProgress(100);
      setProgressMessage('Analysis complete!');
      setAnalysis(analyzeData.analysis);
      toast.success('Content analysis complete!');
    } catch (err) {
      console.error('Analysis error:', err);
      const message = err instanceof Error ? err.message : 'Analysis failed';
      setError(message);
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const currentDefects = analysis?.defects.filter(d => !d.isFuturePrediction) || [];
  const futureDefects = analysis?.defects.filter(d => d.isFuturePrediction) || [];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const metricsData = analysis?.metrics ? [
    { subject: 'Security', score: analysis.metrics.securityScore },
    { subject: 'Accessibility', score: analysis.metrics.accessibilityScore },
    { subject: 'Performance', score: analysis.metrics.performanceScore },
    { subject: 'SEO', score: analysis.metrics.seoScore },
    { subject: 'Code Quality', score: analysis.metrics.codeQualityScore },
  ] : [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">Website Defect Analysis</h1>
        <p className="text-muted-foreground mt-1">AI-powered analysis to detect defects, predict future issues, and provide prevention strategies</p>
      </div>

      {/* Input Mode Selection */}
      <div className="glass-card p-6">
        <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as 'url' | 'manual' | 'social')}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              URL Scraping
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Social Media
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <FileCode className="h-4 w-4" />
              Manual Content
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="mt-0">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="url" 
                  placeholder="Enter website URL (e.g., https://example.com)" 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  className="pl-10 h-12"
                  onKeyDown={(e) => e.key === 'Enter' && analyzeWebsite()}
                />
              </div>
              <Button onClick={analyzeWebsite} disabled={isAnalyzing || !url} size="lg">
                {isAnalyzing ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing...</>
                ) : (
                  <><Search className="h-4 w-4 mr-2" />Analyze</>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              <Info className="h-3 w-3 inline mr-1" />
              Note: Some sites (Instagram, Facebook, Twitter) may not be supported. Use Social Media tab for those.
            </p>
          </TabsContent>

          <TabsContent value="social" className="mt-0 space-y-6">
            {/* Analysis Mode Toggle */}
            <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
              <button
                onClick={() => setSocialAnalysisMode('platform-url')}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all',
                  socialAnalysisMode === 'platform-url'
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                🔍 Platform URL Analysis
              </button>
              <button
                onClick={() => setSocialAnalysisMode('post-content')}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all',
                  socialAnalysisMode === 'post-content'
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                📝 Post Content Analysis
              </button>
            </div>

            {socialAnalysisMode === 'platform-url' ? (
              <>
                {/* Platform URL Analysis Mode */}
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Platform UX Analysis:</strong> Enter a social media platform URL to find defects like slow loading, scrolling issues, video problems, and more.
                  </p>
                </div>

                {/* Platform Selection */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Select Platform</Label>
                  <div className="grid grid-cols-7 gap-2">
                    {(Object.keys(socialPlatformConfig) as SocialPlatform[]).map((platform) => {
                      const config = socialPlatformConfig[platform];
                      const isSelected = selectedPlatformForUrl === platform;
                      return (
                        <button
                          key={platform}
                          onClick={() => setSelectedPlatformForUrl(platform)}
                          className={cn(
                            'flex flex-col items-center gap-1 p-3 rounded-lg border transition-all',
                            isSelected 
                              ? 'border-primary bg-primary/10 text-primary' 
                              : 'border-border hover:border-primary/50 hover:bg-muted'
                          )}
                        >
                          <span className="text-xl">{config.icon}</span>
                          <span className="text-xs font-medium">{config.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Platform URL Input */}
                <div>
                  <Label className="text-sm font-medium">Platform URL</Label>
                  <div className="flex gap-4 mt-1.5">
                    <div className="flex-1 relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input 
                        type="url" 
                        placeholder={`e.g., https://www.${selectedPlatformForUrl}.com`}
                        value={socialPlatformUrl}
                        onChange={(e) => setSocialPlatformUrl(e.target.value)}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>
                </div>

                {/* Known Issues for Selected Platform */}
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <Label className="text-sm font-medium mb-3 block">
                    Common {socialPlatformConfig[selectedPlatformForUrl].label} Issues We'll Check:
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    {platformUXIssues[selectedPlatformForUrl].map((issue, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-medium text-foreground">{issue.category}:</span>
                        <ul className="mt-1 space-y-0.5">
                          {issue.examples.slice(0, 2).map((ex, i) => (
                            <li key={i} className="text-muted-foreground text-xs">• {ex}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* User Reported Issues */}
                <div>
                  <Label className="text-sm font-medium">Describe Issues You've Experienced (optional)</Label>
                  <Textarea 
                    placeholder={`Describe any specific issues you've noticed on ${socialPlatformConfig[selectedPlatformForUrl].label}...

Examples:
• "When I scroll reels, they sometimes skip or go too fast"
• "Videos keep buffering even on good WiFi"
• "The app freezes when I open DMs"
• "Notifications are delayed by hours"`}
                    value={userExperienceIssues}
                    onChange={(e) => setUserExperienceIssues(e.target.value)}
                    className="mt-1.5 min-h-[120px]"
                  />
                </div>

                {/* Analyze Button */}
                <div className="flex justify-end">
                  <Button 
                    onClick={analyzeWebsite} 
                    disabled={isAnalyzing || !socialPlatformUrl.trim()} 
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing...</>
                    ) : (
                      <><Search className="h-4 w-4 mr-2" />Analyze Platform</>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Post Content Analysis Mode */}
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Post Analysis:</strong> Analyze your social media posts for content quality, engagement potential, and best practices.
                  </p>
                </div>

                {/* Platform Selection */}
                <div className="grid grid-cols-7 gap-2">
                  {(Object.keys(socialPlatformConfig) as SocialPlatform[]).map((platform) => {
                    const config = socialPlatformConfig[platform];
                    const isSelected = socialPost.platform === platform;
                    return (
                      <button
                        key={platform}
                        onClick={() => setSocialPost({ ...socialPost, platform, postType: config.postTypes[0] })}
                        className={cn(
                          'flex flex-col items-center gap-1 p-3 rounded-lg border transition-all',
                          isSelected 
                            ? 'border-primary bg-primary/10 text-primary' 
                            : 'border-border hover:border-primary/50 hover:bg-muted'
                        )}
                      >
                        <span className="text-xl">{config.icon}</span>
                        <span className="text-xs font-medium">{config.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Post Type & Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Post Type</Label>
                    <Select 
                      value={socialPost.postType} 
                      onValueChange={(v) => setSocialPost({ ...socialPost, postType: v })}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {socialPlatformConfig[socialPost.platform].postTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Post Date (optional)</Label>
                    <Input 
                      type="date" 
                      value={socialPost.postDate}
                      onChange={(e) => setSocialPost({ ...socialPost, postDate: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                {/* Caption */}
                <div>
                  <Label className="text-sm font-medium">Caption / Post Text *</Label>
                  <Textarea 
                    placeholder={`Enter your ${socialPlatformConfig[socialPost.platform].label} post caption or text content...`}
                    value={socialPost.caption}
                    onChange={(e) => setSocialPost({ ...socialPost, caption: e.target.value })}
                    className="mt-1.5 min-h-[120px]"
                  />
                </div>

                {/* Hashtags & Mentions */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Hashtags</Label>
                    <Input 
                      placeholder="#marketing #socialmedia #brand"
                      value={socialPost.hashtags}
                      onChange={(e) => setSocialPost({ ...socialPost, hashtags: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Mentions</Label>
                    <Input 
                      placeholder="@user1 @brand @influencer"
                      value={socialPost.mentions}
                      onChange={(e) => setSocialPost({ ...socialPost, mentions: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                {/* Engagement Metrics */}
                <div>
                  <Label className="text-sm font-medium text-muted-foreground mb-2 block">Engagement Metrics (optional)</Label>
                  <div className="grid grid-cols-5 gap-3">
                    <div>
                      <Label className="text-xs">Likes</Label>
                      <Input 
                        type="number" 
                        placeholder="0"
                        value={socialPost.likes}
                        onChange={(e) => setSocialPost({ ...socialPost, likes: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Comments</Label>
                      <Input 
                        type="number" 
                        placeholder="0"
                        value={socialPost.comments}
                        onChange={(e) => setSocialPost({ ...socialPost, comments: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Shares</Label>
                      <Input 
                        type="number" 
                        placeholder="0"
                        value={socialPost.shares}
                        onChange={(e) => setSocialPost({ ...socialPost, shares: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Views</Label>
                      <Input 
                        type="number" 
                        placeholder="0"
                        value={socialPost.views}
                        onChange={(e) => setSocialPost({ ...socialPost, views: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Eng. Rate %</Label>
                      <Input 
                        type="text" 
                        placeholder="3.5%"
                        value={socialPost.engagementRate}
                        onChange={(e) => setSocialPost({ ...socialPost, engagementRate: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Context */}
                <div>
                  <Label className="text-sm font-medium">Additional Context (optional)</Label>
                  <Textarea 
                    placeholder="Add any additional context like: target audience, campaign goals, competitor info..."
                    value={socialPost.additionalContext}
                    onChange={(e) => setSocialPost({ ...socialPost, additionalContext: e.target.value })}
                    className="mt-1.5 min-h-[80px]"
                  />
                </div>

                {/* Batch Posts */}
                {batchPosts.length > 0 && (
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <Label className="text-sm font-medium mb-2 block">Batch Posts ({batchPosts.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {batchPosts.map((post, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border text-sm">
                          <span>{socialPlatformConfig[post.platform].icon}</span>
                          <span className="max-w-[150px] truncate">{post.caption.slice(0, 30)}...</span>
                          <button onClick={() => removeBatchPost(index)} className="text-muted-foreground hover:text-destructive">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between">
                  <Button variant="outline" onClick={addBatchPost} disabled={!socialPost.caption.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Batch
                  </Button>
                  <Button 
                    onClick={analyzeWebsite} 
                    disabled={isAnalyzing || (!socialPost.caption.trim() && batchPosts.length === 0)} 
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing...</>
                    ) : (
                      <><Search className="h-4 w-4 mr-2" />Analyze {batchPosts.length > 0 ? `${batchPosts.length} Posts` : 'Post'}</>
                    )}
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="manual" className="mt-0 space-y-4">
            <div>
              <Label htmlFor="source" className="text-sm font-medium">Source Name (optional)</Label>
              <Input 
                id="source"
                placeholder="e.g., Blog Post, Newsletter, Marketing Copy" 
                value={contentSource} 
                onChange={(e) => setContentSource(e.target.value)} 
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="content" className="text-sm font-medium">Paste Content (HTML or Text)</Label>
              <Textarea 
                id="content"
                placeholder="Paste the website content, HTML code, or text you want to analyze...

You can:
• Copy-paste the visible text from any webpage
• Copy the HTML source code (View Source)
• Paste any text content for analysis" 
                value={manualContent} 
                onChange={(e) => setManualContent(e.target.value)} 
                className="mt-1.5 min-h-[200px] font-mono text-sm"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={analyzeWebsite} disabled={isAnalyzing || !manualContent.trim()} size="lg">
                {isAnalyzing ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing...</>
                ) : (
                  <><Search className="h-4 w-4 mr-2" />Analyze Content</>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {isAnalyzing && (
          <div className="mt-6">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2 text-center">{progressMessage}</p>
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Health Score Overview */}
          <div className={`glass-card p-6 border-l-4 ${
            analysis.riskLevel === 'critical' ? 'border-l-destructive' : 
            analysis.riskLevel === 'high' ? 'border-l-orange-500' :
            analysis.riskLevel === 'medium' ? 'border-l-warning' : 'border-l-success'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-display font-semibold">Analysis Complete</h3>
                <p className="text-muted-foreground text-sm truncate max-w-md">{url}</p>
                <p className="text-sm mt-2">{analysis.summary}</p>
              </div>
              <div className="text-right">
                <p className={`text-4xl font-bold ${getScoreColor(analysis.healthScore)}`}>
                  {analysis.healthScore}
                </p>
                <p className="text-sm text-muted-foreground">Health Score</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium uppercase ${severityColors[analysis.riskLevel]}`}>
                  {analysis.riskLevel} Risk
                </span>
              </div>
            </div>
          </div>

          {/* Metrics Radar + Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="chart-container">
              <h3 className="text-lg font-display font-semibold mb-4">Category Scores</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={metricsData}>
                  <PolarGrid stroke="hsl(222, 30%, 18%)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }} />
                  <Radar name="Score" dataKey="score" stroke="hsl(175, 80%, 50%)" fill="hsl(175, 80%, 50%)" fillOpacity={0.3} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Security</span>
                </div>
                <p className={`text-2xl font-bold ${getScoreColor(analysis.metrics.securityScore)}`}>
                  {analysis.metrics.securityScore}%
                </p>
              </div>
              <div className="glass-card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <User className="h-5 w-5 text-accent" />
                  <span className="text-sm text-muted-foreground">Accessibility</span>
                </div>
                <p className={`text-2xl font-bold ${getScoreColor(analysis.metrics.accessibilityScore)}`}>
                  {analysis.metrics.accessibilityScore}%
                </p>
              </div>
              <div className="glass-card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Gauge className="h-5 w-5 text-warning" />
                  <span className="text-sm text-muted-foreground">Performance</span>
                </div>
                <p className={`text-2xl font-bold ${getScoreColor(analysis.metrics.performanceScore)}`}>
                  {analysis.metrics.performanceScore}%
                </p>
              </div>
              <div className="glass-card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Search className="h-5 w-5 text-success" />
                  <span className="text-sm text-muted-foreground">SEO</span>
                </div>
                <p className={`text-2xl font-bold ${getScoreColor(analysis.metrics.seoScore)}`}>
                  {analysis.metrics.seoScore}%
                </p>
              </div>
            </div>
          </div>

          {/* Priority Fixes */}
          {analysis.priorityFixes.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Top Priority Fixes
              </h3>
              <div className="space-y-2">
                {analysis.priorityFixes.map((fix, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/20">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-warning/20 text-warning text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-sm">{fix}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabs for Defects */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="current" className="flex items-center gap-2">
                <Bug className="h-4 w-4" />
                Current Defects ({currentDefects.length})
              </TabsTrigger>
              <TabsTrigger value="future" className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Future Predictions ({futureDefects.length})
              </TabsTrigger>
              <TabsTrigger value="prevention" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Prevention ({analysis.preventiveMeasures.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="mt-4 space-y-4">
              {currentDefects.length === 0 ? (
                <div className="glass-card p-8 text-center">
                  <Check className="h-12 w-12 text-success mx-auto mb-3" />
                  <p className="font-semibold">No Current Defects Detected</p>
                  <p className="text-sm text-muted-foreground">Great job! Your website appears to be defect-free.</p>
                </div>
              ) : (
                currentDefects.map((defect) => {
                  const Icon = categoryIcons[defect.category] || Bug;
                  return (
                    <div key={defect.id} className="glass-card p-5 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg bg-background ${categoryColors[defect.category]}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{defect.title}</h4>
                            <p className="text-sm text-muted-foreground capitalize">{defect.category.replace('-', ' ')}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${severityColors[defect.severity]}`}>
                          {defect.severity}
                        </span>
                      </div>
                      <div className="pl-12 space-y-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Location</p>
                          <p className="text-sm font-mono bg-muted/50 px-2 py-1 rounded inline-block">{defect.location}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Description</p>
                          <p className="text-sm">{defect.description}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Impact</p>
                          <p className="text-sm text-warning">{defect.impact}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                          <p className="text-xs font-medium text-success uppercase mb-1">Recommended Fix</p>
                          <p className="text-sm">{defect.fix}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="future" className="mt-4 space-y-4">
              {futureDefects.length === 0 ? (
                <div className="glass-card p-8 text-center">
                  <TrendingUp className="h-12 w-12 text-success mx-auto mb-3" />
                  <p className="font-semibold">No Future Risks Predicted</p>
                  <p className="text-sm text-muted-foreground">Your website appears to be well-maintained.</p>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <p className="text-sm flex items-center gap-2">
                      <Info className="h-4 w-4 text-accent" />
                      These are predicted future issues based on current patterns and common degradation paths.
                    </p>
                  </div>
                  {futureDefects.map((defect) => {
                    const Icon = categoryIcons[defect.category] || TrendingDown;
                    return (
                      <div key={defect.id} className="glass-card p-5 space-y-4 border border-warning/20">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg bg-warning/10 text-warning`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-semibold flex items-center gap-2">
                                {defect.title}
                                <span className="text-xs px-2 py-0.5 rounded bg-warning/20 text-warning">Predicted</span>
                              </h4>
                              <p className="text-sm text-muted-foreground capitalize">{defect.category.replace('-', ' ')}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${severityColors[defect.severity]}`}>
                            {defect.severity}
                          </span>
                        </div>
                        <div className="pl-12 space-y-3">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Likely Location</p>
                            <p className="text-sm font-mono bg-muted/50 px-2 py-1 rounded inline-block">{defect.location}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Prediction Details</p>
                            <p className="text-sm">{defect.description}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Potential Impact</p>
                            <p className="text-sm text-warning">{defect.impact}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                            <p className="text-xs font-medium text-success uppercase mb-1">Prevention Strategy</p>
                            <p className="text-sm">{defect.fix}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </TabsContent>

            <TabsContent value="prevention" className="mt-4 space-y-4">
              {analysis.preventiveMeasures.length === 0 ? (
                <div className="glass-card p-8 text-center">
                  <Check className="h-12 w-12 text-success mx-auto mb-3" />
                  <p className="font-semibold">No Additional Prevention Needed</p>
                  <p className="text-sm text-muted-foreground">Your website follows best practices.</p>
                </div>
              ) : (
                analysis.preventiveMeasures.map((measure, index) => (
                  <div key={index} className="glass-card p-5">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${
                        measure.importance === 'critical' ? 'bg-destructive/10 text-destructive' :
                        measure.importance === 'high' ? 'bg-warning/10 text-warning' :
                        'bg-primary/10 text-primary'
                      }`}>
                        <Shield className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{measure.title}</h4>
                          <span className={`px-2 py-0.5 rounded text-xs uppercase font-medium ${
                            measure.importance === 'critical' ? 'bg-destructive/20 text-destructive' :
                            measure.importance === 'high' ? 'bg-warning/20 text-warning' :
                            'bg-primary/20 text-primary'
                          }`}>
                            {measure.importance}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{measure.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

// ==================== METRICS PAGE ====================
const rocData = Array.from({ length: 50 }, (_, i) => ({ fpr: i / 50, tpr: Math.pow(i / 50, 0.5) + Math.random() * 0.1, random: i / 50 }));
const confusionMatrix = { tp: 847, fp: 53, fn: 89, tn: 1011 };
const prData = Array.from({ length: 20 }, (_, i) => ({ recall: (i + 1) / 20, precision: 0.95 - 0.4 * Math.pow((i + 1) / 20, 1.5) + Math.random() * 0.05 }));
const learningData = [{ size: '10%', train: 0.98, test: 0.65 }, { size: '20%', train: 0.97, test: 0.72 }, { size: '30%', train: 0.96, test: 0.78 }, { size: '40%', train: 0.95, test: 0.82 }, { size: '50%', train: 0.94, test: 0.85 }, { size: '60%', train: 0.94, test: 0.87 }, { size: '70%', train: 0.93, test: 0.89 }, { size: '80%', train: 0.93, test: 0.91 }, { size: '90%', train: 0.92, test: 0.92 }, { size: '100%', train: 0.92, test: 0.93 }];

export function MetricsPage() {
  const [selectedModel, setSelectedModel] = useState('ensemble');
  const total = confusionMatrix.tp + confusionMatrix.fp + confusionMatrix.fn + confusionMatrix.tn;
  const accuracy = (confusionMatrix.tp + confusionMatrix.tn) / total;
  const precision = confusionMatrix.tp / (confusionMatrix.tp + confusionMatrix.fp);
  const recall = confusionMatrix.tp / (confusionMatrix.tp + confusionMatrix.fn);
  const f1 = (2 * precision * recall) / (precision + recall);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-display font-bold">Evaluation Metrics</h1><p className="text-muted-foreground mt-1">Comprehensive model performance analysis</p></div><Select value={selectedModel} onValueChange={setSelectedModel}><SelectTrigger className="w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ensemble">Stacking Ensemble</SelectItem><SelectItem value="rf">Random Forest</SelectItem><SelectItem value="svm">SVM</SelectItem><SelectItem value="lr">Logistic Regression</SelectItem></SelectContent></Select></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4"><div className="glass-card p-5 text-center"><p className="text-3xl font-bold text-primary">{(accuracy * 100).toFixed(2)}%</p><p className="text-sm text-muted-foreground mt-1">Accuracy</p></div><div className="glass-card p-5 text-center"><p className="text-3xl font-bold text-accent">{(precision * 100).toFixed(2)}%</p><p className="text-sm text-muted-foreground mt-1">Precision</p></div><div className="glass-card p-5 text-center"><p className="text-3xl font-bold text-warning">{(recall * 100).toFixed(2)}%</p><p className="text-sm text-muted-foreground mt-1">Recall</p></div><div className="glass-card p-5 text-center"><p className="text-3xl font-bold text-success">{(f1 * 100).toFixed(2)}%</p><p className="text-sm text-muted-foreground mt-1">F1-Score</p></div></div>
      <Tabs defaultValue="confusion"><TabsList className="mb-6"><TabsTrigger value="confusion">Confusion Matrix</TabsTrigger><TabsTrigger value="roc">ROC Curve</TabsTrigger><TabsTrigger value="pr">Precision-Recall</TabsTrigger><TabsTrigger value="learning">Learning Curve</TabsTrigger></TabsList>
        <TabsContent value="confusion"><div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><div className="chart-container"><h3 className="text-lg font-display font-semibold mb-6">Confusion Matrix</h3><div className="grid grid-cols-2 gap-4 max-w-md mx-auto"><div className="p-8 rounded-xl bg-success/20 text-center border border-success/30"><p className="text-3xl font-bold text-success">{confusionMatrix.tp}</p><p className="text-sm text-muted-foreground mt-2">True Positive</p></div><div className="p-8 rounded-xl bg-destructive/20 text-center border border-destructive/30"><p className="text-3xl font-bold text-destructive">{confusionMatrix.fp}</p><p className="text-sm text-muted-foreground mt-2">False Positive</p></div><div className="p-8 rounded-xl bg-warning/20 text-center border border-warning/30"><p className="text-3xl font-bold text-warning">{confusionMatrix.fn}</p><p className="text-sm text-muted-foreground mt-2">False Negative</p></div><div className="p-8 rounded-xl bg-primary/20 text-center border border-primary/30"><p className="text-3xl font-bold text-primary">{confusionMatrix.tn}</p><p className="text-sm text-muted-foreground mt-2">True Negative</p></div></div></div><div className="glass-card p-6"><h3 className="text-lg font-display font-semibold mb-6">Detailed Metrics</h3><div className="space-y-4"><div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"><span className="text-muted-foreground">True Positive Rate (Sensitivity)</span><span className="font-bold">{(recall * 100).toFixed(2)}%</span></div><div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"><span className="text-muted-foreground">True Negative Rate (Specificity)</span><span className="font-bold">{((confusionMatrix.tn / (confusionMatrix.tn + confusionMatrix.fp)) * 100).toFixed(2)}%</span></div><div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"><span className="text-muted-foreground">False Positive Rate</span><span className="font-bold">{((confusionMatrix.fp / (confusionMatrix.fp + confusionMatrix.tn)) * 100).toFixed(2)}%</span></div><div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/30"><span className="font-medium">Matthews Correlation Coefficient</span><span className="font-bold text-primary">0.847</span></div></div></div></div></TabsContent>
        <TabsContent value="roc"><div className="chart-container"><div className="flex items-center justify-between mb-6"><div><h3 className="text-lg font-display font-semibold">ROC Curve</h3><p className="text-sm text-muted-foreground">Area Under Curve (AUC): 0.967</p></div></div><ResponsiveContainer width="100%" height={400}><AreaChart data={rocData}><defs><linearGradient id="rocGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(175, 80%, 50%)" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(175, 80%, 50%)" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" /><XAxis dataKey="fpr" stroke="hsl(215, 20%, 55%)" fontSize={12} tickFormatter={(v) => v.toFixed(1)} /><YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} /><Tooltip contentStyle={{ backgroundColor: 'hsl(222, 47%, 10%)', border: '1px solid hsl(222, 30%, 18%)', borderRadius: '8px' }} /><Line type="monotone" dataKey="random" stroke="hsl(215, 20%, 35%)" strokeDasharray="5 5" dot={false} name="Random" /><Area type="monotone" dataKey="tpr" stroke="hsl(175, 80%, 50%)" fill="url(#rocGradient)" strokeWidth={2} name="Model" /></AreaChart></ResponsiveContainer></div></TabsContent>
        <TabsContent value="pr"><div className="chart-container"><div className="mb-6"><h3 className="text-lg font-display font-semibold">Precision-Recall Curve</h3><p className="text-sm text-muted-foreground">Average Precision: 0.943</p></div><ResponsiveContainer width="100%" height={400}><LineChart data={prData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" /><XAxis dataKey="recall" stroke="hsl(215, 20%, 55%)" fontSize={12} /><YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} domain={[0, 1]} /><Tooltip contentStyle={{ backgroundColor: 'hsl(222, 47%, 10%)', border: '1px solid hsl(222, 30%, 18%)', borderRadius: '8px' }} formatter={(value: number) => [value.toFixed(3), '']} /><Line type="monotone" dataKey="precision" stroke="hsl(280, 70%, 55%)" strokeWidth={2} dot={{ fill: 'hsl(280, 70%, 55%)', strokeWidth: 2 }} /></LineChart></ResponsiveContainer></div></TabsContent>
        <TabsContent value="learning"><div className="chart-container"><div className="mb-6"><h3 className="text-lg font-display font-semibold">Learning Curve</h3><p className="text-sm text-muted-foreground">Training vs Validation accuracy by dataset size</p></div><ResponsiveContainer width="100%" height={400}><LineChart data={learningData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" /><XAxis dataKey="size" stroke="hsl(215, 20%, 55%)" fontSize={12} /><YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} domain={[0.5, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} /><Tooltip contentStyle={{ backgroundColor: 'hsl(222, 47%, 10%)', border: '1px solid hsl(222, 30%, 18%)', borderRadius: '8px' }} formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, '']} /><Legend /><Line type="monotone" dataKey="train" stroke="hsl(175, 80%, 50%)" strokeWidth={2} name="Training Score" /><Line type="monotone" dataKey="test" stroke="hsl(280, 70%, 55%)" strokeWidth={2} name="Validation Score" /></LineChart></ResponsiveContainer></div></TabsContent>
      </Tabs>
    </div>
  );
}

// ==================== REPORTS PAGE ====================
interface ReportConfig { id: string; label: string; description: string; icon: React.ElementType; }
const reportSections: ReportConfig[] = [{ id: 'summary', label: 'Executive Summary', description: 'Overview of predictions and key findings', icon: FileText }, { id: 'dataset', label: 'Dataset Analysis', description: 'Data quality and preprocessing details', icon: FileSpreadsheet }, { id: 'features', label: 'Feature Importance', description: 'Selected features and their impact', icon: BarChart3 }, { id: 'models', label: 'Model Performance', description: 'Accuracy, precision, recall, F1-score', icon: Brain }, { id: 'predictions', label: 'Prediction Details', description: 'Individual and batch results', icon: Shield }, { id: 'xai', label: 'Explainability Report', description: 'SHAP values and feature contributions', icon: Brain }];
interface GeneratedReport { id: string; name: string; format: 'pdf' | 'excel'; generatedAt: Date; size: string; }
const mockReports: GeneratedReport[] = [{ id: '1', name: 'Full_Analysis_Report_2024-01-15', format: 'pdf', generatedAt: new Date('2024-01-15'), size: '2.4 MB' }, { id: '2', name: 'Predictions_Export_NASA_KC1', format: 'excel', generatedAt: new Date('2024-01-14'), size: '1.1 MB' }, { id: '3', name: 'Model_Comparison_Report', format: 'pdf', generatedAt: new Date('2024-01-12'), size: '1.8 MB' }];

export function ReportsPage() {
  const [selectedSections, setSelectedSections] = useState<string[]>(['summary', 'models', 'predictions']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reports, setReports] = useState<GeneratedReport[]>(mockReports);

  const generateReport = async (format: 'pdf' | 'excel') => {
    setIsGenerating(true); setProgress(0);
    for (let i = 0; i <= 100; i += 10) { await new Promise((resolve) => setTimeout(resolve, 200)); setProgress(i); }
    setReports((prev) => [{ id: Date.now().toString(), name: `DefectAI_Report_${new Date().toISOString().split('T')[0]}`, format, generatedAt: new Date(), size: format === 'pdf' ? '2.1 MB' : '856 KB' }, ...prev]);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div><h1 className="text-3xl font-display font-bold">Reports & Export</h1><p className="text-muted-foreground mt-1">Generate comprehensive PDF and Excel reports</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6"><h3 className="text-lg font-display font-semibold mb-6">Report Sections</h3><div className="space-y-3">{reportSections.map((section) => (<div key={section.id} className={`flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer ${selectedSections.includes(section.id) ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/30'}`} onClick={() => setSelectedSections((prev) => prev.includes(section.id) ? prev.filter((s) => s !== section.id) : [...prev, section.id])}><Checkbox checked={selectedSections.includes(section.id)} onCheckedChange={() => {}} /><div className="p-2 rounded-lg bg-primary/10"><section.icon className="h-4 w-4 text-primary" /></div><div className="flex-1"><p className="font-medium">{section.label}</p><p className="text-sm text-muted-foreground">{section.description}</p></div></div>))}</div>{isGenerating && <div className="mt-6"><Progress value={progress} className="h-2" /><p className="text-sm text-muted-foreground mt-2 text-center">Generating report... {progress}%</p></div>}<div className="flex gap-3 mt-6"><Button className="flex-1" onClick={() => generateReport('pdf')} disabled={isGenerating || selectedSections.length === 0}>{isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}Generate PDF</Button><Button variant="outline" className="flex-1" onClick={() => generateReport('excel')} disabled={isGenerating || selectedSections.length === 0}><FileSpreadsheet className="h-4 w-4 mr-2" />Export Excel</Button></div></div>
        <div className="glass-card p-6"><h3 className="text-lg font-display font-semibold mb-6">Generated Reports</h3><div className="space-y-3">{reports.map((report) => (<div key={report.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"><div className="flex items-center gap-4"><div className={`p-2 rounded-lg ${report.format === 'pdf' ? 'bg-destructive/10' : 'bg-success/10'}`}>{report.format === 'pdf' ? <FileText className="h-5 w-5 text-destructive" /> : <FileSpreadsheet className="h-5 w-5 text-success" />}</div><div><p className="font-medium text-sm">{report.name}</p><div className="flex items-center gap-2 text-xs text-muted-foreground mt-1"><Calendar className="h-3 w-3" />{report.generatedAt.toLocaleDateString()}<span>•</span><span>{report.size}</span></div></div></div><Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button></div>))}</div></div>
      </div>
      <div className="glass-card p-6"><h3 className="text-lg font-display font-semibold mb-6">Report Preview</h3><div className="bg-secondary/30 rounded-lg p-8 text-center"><FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" /><p className="text-muted-foreground">Select sections and generate a report to preview</p></div></div>
    </div>
  );
}

// ==================== SETTINGS PAGE ====================
export function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState('https://api.defectai.com/v1');

  const handleSave = async () => { setIsSaving(true); await new Promise((resolve) => setTimeout(resolve, 1000)); toast.success('Settings saved successfully'); setIsSaving(false); };

  return (
    <div className="space-y-8 animate-fade-in">
      <div><h1 className="text-3xl font-display font-bold">Settings</h1><p className="text-muted-foreground mt-1">Configure your DefectAI experience</p></div>
      <Tabs defaultValue="profile"><TabsList className="mb-6"><TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" />Profile</TabsTrigger><TabsTrigger value="api" className="gap-2"><Server className="h-4 w-4" />API Configuration</TabsTrigger><TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" />Notifications</TabsTrigger></TabsList>
        <TabsContent value="profile" className="space-y-6"><div className="glass-card p-6"><h3 className="text-lg font-display font-semibold mb-6">Profile Information</h3><div className="flex items-start gap-8"><div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 text-3xl font-bold text-primary">A</div><div className="flex-1 space-y-4"><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Full Name</Label><Input defaultValue="Admin User" /></div><div className="space-y-2"><Label>Email</Label><Input defaultValue="admin@defectai.com" type="email" /></div></div><div className="space-y-2"><Label>Role</Label><Input value="Administrator" disabled /></div></div></div></div><div className="glass-card p-6"><h3 className="text-lg font-display font-semibold mb-6">Security</h3><div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Current Password</Label><Input type="password" placeholder="••••••••" /></div><div className="space-y-2"><Label>New Password</Label><Input type="password" placeholder="••••••••" /></div></div><div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"><div className="flex items-center gap-3"><Shield className="h-5 w-5 text-primary" /><div><p className="font-medium">Two-Factor Authentication</p><p className="text-sm text-muted-foreground">Add an extra layer of security</p></div></div><Switch /></div></div></div></TabsContent>
        <TabsContent value="api" className="space-y-6"><div className="glass-card p-6"><h3 className="text-lg font-display font-semibold mb-6">API Configuration</h3><div className="space-y-4"><div className="space-y-2"><Label>Python Backend Endpoint</Label><Input placeholder="https://your-api.com/v1" value={apiEndpoint} onChange={(e) => setApiEndpoint(e.target.value)} /><p className="text-xs text-muted-foreground">Connect to your deployed Python ML backend API</p></div><div className="space-y-2"><Label>API Key</Label><Input type="password" placeholder="sk-••••••••••••••••" /></div><div className="flex items-center gap-4"><Button variant="outline">Test Connection</Button><span className="text-sm text-muted-foreground">Status: Not Connected</span></div></div></div><div className="glass-card p-6"><h3 className="text-lg font-display font-semibold mb-6">Model Configuration</h3><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Default Model</Label><Input defaultValue="Stacking Ensemble" /></div><div className="space-y-2"><Label>Prediction Threshold</Label><Input type="number" step="0.1" defaultValue="0.5" /></div></div></div></TabsContent>
        <TabsContent value="notifications" className="space-y-6"><div className="glass-card p-6"><h3 className="text-lg font-display font-semibold mb-6">Notification Preferences</h3><div className="space-y-4">{[{ label: 'Training Complete', desc: 'When model training finishes' }, { label: 'High-Risk Detection', desc: 'When high-risk defects are detected' }, { label: 'Report Generated', desc: 'When reports are ready for download' }, { label: 'System Updates', desc: 'New features and improvements' }].map((item) => (<div key={item.label} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"><div><p className="font-medium">{item.label}</p><p className="text-sm text-muted-foreground">{item.desc}</p></div><Switch defaultChecked /></div>))}</div></div></TabsContent>
      </Tabs>
      <div className="flex justify-end"><Button onClick={handleSave} disabled={isSaving}>{isSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />Save Changes</>}</Button></div>
    </div>
  );
}
