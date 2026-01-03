import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/ui/stat-card';
import {
  Database,
  TrendingUp,
  Shield,
  AlertTriangle,
  Activity,
  Cpu,
  Target,
  Zap,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const accuracyData = [
  { name: 'Week 1', baseline: 82, optimized: 85 },
  { name: 'Week 2', baseline: 83, optimized: 88 },
  { name: 'Week 3', baseline: 84, optimized: 91 },
  { name: 'Week 4', baseline: 84, optimized: 94 },
  { name: 'Week 5', baseline: 85, optimized: 96 },
  { name: 'Week 6', baseline: 85, optimized: 97 },
];

const defectDistribution = [
  { name: 'Critical', value: 15, color: 'hsl(0, 75%, 55%)' },
  { name: 'Major', value: 25, color: 'hsl(45, 95%, 55%)' },
  { name: 'Minor', value: 35, color: 'hsl(175, 80%, 50%)' },
  { name: 'Low', value: 25, color: 'hsl(280, 70%, 55%)' },
];

const modelPerformance = [
  { name: 'Logistic Reg.', accuracy: 78, f1: 75 },
  { name: 'SVM', accuracy: 82, f1: 80 },
  { name: 'Decision Tree', accuracy: 85, f1: 83 },
  { name: 'Random Forest', accuracy: 91, f1: 89 },
  { name: 'Ensemble', accuracy: 97, f1: 96 },
];

const recentPredictions = [
  { module: 'auth_handler.py', risk: 'high', probability: 0.89, time: '2 min ago' },
  { module: 'data_processor.js', risk: 'low', probability: 0.12, time: '5 min ago' },
  { module: 'api_gateway.go', risk: 'medium', probability: 0.45, time: '12 min ago' },
  { module: 'cache_manager.py', risk: 'low', probability: 0.08, time: '18 min ago' },
  { module: 'payment_service.ts', risk: 'high', probability: 0.92, time: '25 min ago' },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your software defect prediction system
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10 text-success">
          <Activity className="h-4 w-4" />
          <span className="text-sm font-medium">System Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Datasets Analyzed"
          value="24"
          change="+3 this week"
          changeType="positive"
          icon={Database}
        />
        <StatCard
          title="Model Accuracy"
          value="97.2%"
          change="+2.4% from baseline"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-success"
        />
        <StatCard
          title="Defects Detected"
          value="1,847"
          change="152 high-risk"
          changeType="negative"
          icon={AlertTriangle}
          iconColor="text-warning"
        />
        <StatCard
          title="Modules Scanned"
          value="12,453"
          change="98.7% coverage"
          changeType="positive"
          icon={Shield}
          iconColor="text-accent"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy Comparison */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-display font-semibold">Model Accuracy Over Time</h3>
              <p className="text-sm text-muted-foreground">Baseline vs Swarm-Optimized</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                <span className="text-xs text-muted-foreground">Baseline</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">Optimized</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={accuracyData}>
              <defs>
                <linearGradient id="gradientPrimary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(175, 80%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(175, 80%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis dataKey="name" stroke="hsl(215, 20%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} domain={[70, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(222, 47%, 10%)',
                  border: '1px solid hsl(222, 30%, 18%)',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="baseline"
                stroke="hsl(215, 20%, 55%)"
                fill="transparent"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="optimized"
                stroke="hsl(175, 80%, 50%)"
                fill="url(#gradientPrimary)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Defect Distribution */}
        <div className="chart-container">
          <div className="mb-6">
            <h3 className="text-lg font-display font-semibold">Defect Severity Distribution</h3>
            <p className="text-sm text-muted-foreground">Classification by risk level</p>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={defectDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {defectDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 10%)',
                    border: '1px solid hsl(222, 30%, 18%)',
                    borderRadius: '8px',
                  }}
                />
                <Legend
                  formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Performance */}
        <div className="chart-container lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-lg font-display font-semibold">Model Performance Comparison</h3>
            <p className="text-sm text-muted-foreground">Accuracy and F1-Score by model type</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={modelPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={12} domain={[0, 100]} />
              <YAxis dataKey="name" type="category" stroke="hsl(215, 20%, 55%)" fontSize={12} width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(222, 47%, 10%)',
                  border: '1px solid hsl(222, 30%, 18%)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="accuracy" fill="hsl(175, 80%, 50%)" radius={[0, 4, 4, 0]} name="Accuracy %" />
              <Bar dataKey="f1" fill="hsl(280, 70%, 55%)" radius={[0, 4, 4, 0]} name="F1-Score %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Predictions */}
        <div className="glass-card p-6">
          <div className="mb-6">
            <h3 className="text-lg font-display font-semibold">Recent Predictions</h3>
            <p className="text-sm text-muted-foreground">Latest module analysis</p>
          </div>
          <div className="space-y-4">
            {recentPredictions.map((prediction, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      prediction.risk === 'high'
                        ? 'bg-destructive'
                        : prediction.risk === 'medium'
                        ? 'bg-warning'
                        : 'bg-success'
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium truncate max-w-[140px]">{prediction.module}</p>
                    <p className="text-xs text-muted-foreground">{prediction.time}</p>
                  </div>
                </div>
                <span
                  className={`metric-badge ${
                    prediction.risk === 'high'
                      ? 'danger'
                      : prediction.risk === 'medium'
                      ? 'warning'
                      : 'success'
                  }`}
                >
                  {(prediction.probability * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="glass-card p-6 text-left hover:bg-secondary/50 transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-display font-semibold">Train New Model</h4>
              <p className="text-sm text-muted-foreground">Start swarm optimization</p>
            </div>
          </div>
        </button>
        <button className="glass-card p-6 text-left hover:bg-secondary/50 transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-display font-semibold">Run Prediction</h4>
              <p className="text-sm text-muted-foreground">Analyze new modules</p>
            </div>
          </div>
        </button>
        <button className="glass-card p-6 text-left hover:bg-secondary/50 transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-success/10 text-success group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-display font-semibold">Quick Analysis</h4>
              <p className="text-sm text-muted-foreground">Website defect check</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
