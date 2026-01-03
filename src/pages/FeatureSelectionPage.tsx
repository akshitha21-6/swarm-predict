import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Layers,
  Filter,
  Sparkles,
  Check,
  X,
  ArrowRight,
  Info,
} from 'lucide-react';

interface Feature {
  name: string;
  importance: number;
  selected: boolean;
  type: 'numeric' | 'categorical';
  method: 'RFE' | 'Correlation' | 'MI' | 'Swarm';
}

const initialFeatures: Feature[] = [
  { name: 'Lines of Code (LOC)', importance: 0.92, selected: true, type: 'numeric', method: 'Swarm' },
  { name: 'Cyclomatic Complexity', importance: 0.88, selected: true, type: 'numeric', method: 'Swarm' },
  { name: 'Code Churn', importance: 0.85, selected: true, type: 'numeric', method: 'RFE' },
  { name: 'Number of Functions', importance: 0.78, selected: true, type: 'numeric', method: 'MI' },
  { name: 'Comment Density', importance: 0.71, selected: true, type: 'numeric', method: 'Correlation' },
  { name: 'Developer Experience', importance: 0.65, selected: true, type: 'numeric', method: 'RFE' },
  { name: 'Commit Frequency', importance: 0.58, selected: true, type: 'numeric', method: 'MI' },
  { name: 'Bug Fix Count', importance: 0.52, selected: true, type: 'numeric', method: 'Swarm' },
  { name: 'Module Age', importance: 0.45, selected: false, type: 'numeric', method: 'Correlation' },
  { name: 'Import Count', importance: 0.38, selected: false, type: 'numeric', method: 'RFE' },
  { name: 'Test Coverage', importance: 0.32, selected: false, type: 'numeric', method: 'MI' },
  { name: 'File Size', importance: 0.25, selected: false, type: 'numeric', method: 'Correlation' },
];

export default function FeatureSelectionPage() {
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);

  const selectedCount = features.filter((f) => f.selected).length;
  const removedCount = features.length - selectedCount;

  const toggleFeature = (name: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.name === name ? { ...f, selected: !f.selected } : f))
    );
  };

  const runSwarmOptimization = () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    const interval = setInterval(() => {
      setOptimizationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsOptimizing(false);
          // Simulate selecting optimal features
          setFeatures((prevFeatures) =>
            prevFeatures.map((f) => ({
              ...f,
              selected: f.importance >= 0.5,
              method: 'Swarm',
            }))
          );
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const chartData = features
    .sort((a, b) => b.importance - a.importance)
    .map((f) => ({
      name: f.name.length > 15 ? f.name.slice(0, 15) + '...' : f.name,
      importance: f.importance * 100,
      selected: f.selected,
    }));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Feature Selection</h1>
          <p className="text-muted-foreground mt-1">
            Optimize feature subset using RFE, Correlation, Mutual Information & Swarm Intelligence
          </p>
        </div>
        <Button onClick={runSwarmOptimization} disabled={isOptimizing}>
          <Sparkles className="h-4 w-4 mr-2" />
          {isOptimizing ? 'Optimizing...' : 'Run Swarm Optimization'}
        </Button>
      </div>

      {/* Optimization Progress */}
      {isOptimizing && (
        <div className="glass-card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 animate-pulse">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Hybrid Swarm Optimization Running...</p>
              <p className="text-sm text-muted-foreground">
                {optimizationProgress < 30 && 'Initializing PSO particles...'}
                {optimizationProgress >= 30 && optimizationProgress < 60 && 'Applying Genetic Algorithm crossover...'}
                {optimizationProgress >= 60 && optimizationProgress < 90 && 'Running Ant Colony pheromone updates...'}
                {optimizationProgress >= 90 && 'Converging to optimal solution...'}
              </p>
            </div>
          </div>
          <Progress value={optimizationProgress} className="h-2" />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Layers className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{features.length}</p>
              <p className="text-sm text-muted-foreground">Total Features</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Check className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{selectedCount}</p>
              <p className="text-sm text-muted-foreground">Selected</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <X className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{removedCount}</p>
              <p className="text-sm text-muted-foreground">Removed</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Filter className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{((selectedCount / features.length) * 100).toFixed(0)}%</p>
              <p className="text-sm text-muted-foreground">Selection Ratio</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Importance Chart */}
        <div className="chart-container">
          <h3 className="text-lg font-display font-semibold mb-6">Feature Importance Scores</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={12} domain={[0, 100]} />
              <YAxis dataKey="name" type="category" stroke="hsl(215, 20%, 55%)" fontSize={11} width={120} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(222, 47%, 10%)',
                  border: '1px solid hsl(222, 30%, 18%)',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Importance']}
              />
              <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.selected ? 'hsl(175, 80%, 50%)' : 'hsl(222, 30%, 25%)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Feature Toggle List */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-semibold">Feature Selection</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Info className="h-3 w-3" />
              Toggle to include/exclude features
            </div>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {features
              .sort((a, b) => b.importance - a.importance)
              .map((feature) => (
                <div
                  key={feature.name}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    feature.selected
                      ? 'border-primary/50 bg-primary/5'
                      : 'border-border bg-secondary/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={feature.selected}
                      onCheckedChange={() => toggleFeature(feature.name)}
                    />
                    <div>
                      <p className={`font-medium ${!feature.selected && 'text-muted-foreground'}`}>
                        {feature.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                          {feature.method}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {feature.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{(feature.importance * 100).toFixed(0)}%</p>
                    <p className="text-xs text-muted-foreground">importance</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Selection Methods */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-display font-semibold mb-4">Selection Methods Applied</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { method: 'RFE', desc: 'Recursive Feature Elimination', icon: Filter },
            { method: 'Correlation', desc: 'Pearson correlation filtering', icon: ArrowRight },
            { method: 'MI', desc: 'Mutual Information scoring', icon: Sparkles },
            { method: 'Swarm', desc: 'PSO + GA + ACO hybrid', icon: Layers },
          ].map((item) => (
            <div key={item.method} className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
              <div className="p-2 rounded-lg bg-primary/10">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">{item.method}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
