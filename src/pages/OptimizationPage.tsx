import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Play, Pause, RotateCcw, Zap, Bug, Dna } from 'lucide-react';

interface ConvergencePoint {
  iteration: number;
  pso: number;
  ga: number;
  aco: number;
  hybrid: number;
}

const generateConvergenceData = (iterations: number): ConvergencePoint[] => {
  const data: ConvergencePoint[] = [];
  for (let i = 0; i <= iterations; i++) {
    data.push({
      iteration: i,
      pso: 0.6 + 0.35 * (1 - Math.exp(-i / 20)) + Math.random() * 0.02,
      ga: 0.58 + 0.33 * (1 - Math.exp(-i / 25)) + Math.random() * 0.02,
      aco: 0.55 + 0.36 * (1 - Math.exp(-i / 22)) + Math.random() * 0.02,
      hybrid: 0.65 + 0.32 * (1 - Math.exp(-i / 15)) + Math.random() * 0.01,
    });
  }
  return data;
};

export default function OptimizationPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [convergenceData, setConvergenceData] = useState<ConvergencePoint[]>([]);
  const maxIterations = 100;

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrentIteration((prev) => {
        if (prev >= maxIterations) {
          setIsRunning(false);
          return prev;
        }
        const newData = generateConvergenceData(prev + 1);
        setConvergenceData(newData);
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    if (currentIteration >= maxIterations) {
      setCurrentIteration(0);
      setConvergenceData([]);
    }
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentIteration(0);
    setConvergenceData([]);
  };

  const latestData = convergenceData[convergenceData.length - 1] || {
    pso: 0,
    ga: 0,
    aco: 0,
    hybrid: 0,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Swarm Optimization Engine</h1>
          <p className="text-muted-foreground mt-1">
            Hybrid PSO + GA + ACO for hyperparameter tuning and feature selection
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isRunning ? (
            <Button variant="outline" onClick={() => setIsRunning(false)}>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          ) : (
            <Button onClick={handleStart}>
              <Play className="h-4 w-4 mr-2" />
              {currentIteration > 0 ? 'Resume' : 'Start Optimization'}
            </Button>
          )}
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-primary/10 ${isRunning ? 'animate-pulse' : ''}`}>
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">
                {isRunning ? 'Optimization in Progress...' : currentIteration === maxIterations ? 'Optimization Complete' : 'Ready to Optimize'}
              </p>
              <p className="text-sm text-muted-foreground">
                Iteration {currentIteration} / {maxIterations}
              </p>
            </div>
          </div>
          <span className="text-2xl font-bold text-primary">
            {((currentIteration / maxIterations) * 100).toFixed(0)}%
          </span>
        </div>
        <Progress value={(currentIteration / maxIterations) * 100} className="h-2" />
      </div>

      {/* Algorithm Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 border-l-4 border-l-primary">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-medium">PSO</span>
          </div>
          <p className="text-3xl font-bold">{(latestData.pso * 100).toFixed(1)}%</p>
          <p className="text-sm text-muted-foreground">Particle Swarm</p>
        </div>
        <div className="glass-card p-5 border-l-4 border-l-accent">
          <div className="flex items-center gap-3 mb-3">
            <Dna className="h-5 w-5 text-accent" />
            <span className="font-medium">GA</span>
          </div>
          <p className="text-3xl font-bold">{(latestData.ga * 100).toFixed(1)}%</p>
          <p className="text-sm text-muted-foreground">Genetic Algorithm</p>
        </div>
        <div className="glass-card p-5 border-l-4 border-l-warning">
          <div className="flex items-center gap-3 mb-3">
            <Bug className="h-5 w-5 text-warning" />
            <span className="font-medium">ACO</span>
          </div>
          <p className="text-3xl font-bold">{(latestData.aco * 100).toFixed(1)}%</p>
          <p className="text-sm text-muted-foreground">Ant Colony</p>
        </div>
        <div className="glass-card p-5 border-l-4 border-l-success glow-effect">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="h-5 w-5 text-success" />
            <span className="font-medium">Hybrid</span>
          </div>
          <p className="text-3xl font-bold text-success">{(latestData.hybrid * 100).toFixed(1)}%</p>
          <p className="text-sm text-muted-foreground">Combined Best</p>
        </div>
      </div>

      {/* Convergence Chart */}
      <div className="chart-container">
        <h3 className="text-lg font-display font-semibold mb-6">Convergence Analysis</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={convergenceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
            <XAxis
              dataKey="iteration"
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
              label={{ value: 'Iteration', position: 'bottom', fill: 'hsl(215, 20%, 55%)' }}
            />
            <YAxis
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
              domain={[0.5, 1]}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 10%)',
                border: '1px solid hsl(222, 30%, 18%)',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, '']}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="pso"
              stroke="hsl(175, 80%, 50%)"
              strokeWidth={2}
              dot={false}
              name="PSO"
            />
            <Line
              type="monotone"
              dataKey="ga"
              stroke="hsl(280, 70%, 55%)"
              strokeWidth={2}
              dot={false}
              name="GA"
            />
            <Line
              type="monotone"
              dataKey="aco"
              stroke="hsl(45, 95%, 55%)"
              strokeWidth={2}
              dot={false}
              name="ACO"
            />
            <Line
              type="monotone"
              dataKey="hybrid"
              stroke="hsl(150, 70%, 45%)"
              strokeWidth={3}
              dot={false}
              name="Hybrid"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Algorithm Details */}
      <Tabs defaultValue="pso" className="glass-card p-6">
        <TabsList className="mb-6">
          <TabsTrigger value="pso">PSO</TabsTrigger>
          <TabsTrigger value="ga">Genetic Algorithm</TabsTrigger>
          <TabsTrigger value="aco">Ant Colony</TabsTrigger>
          <TabsTrigger value="hybrid">Hybrid</TabsTrigger>
        </TabsList>
        <TabsContent value="pso" className="space-y-4">
          <h4 className="font-display font-semibold">Particle Swarm Optimization</h4>
          <p className="text-muted-foreground">
            PSO simulates bird flocking behavior where particles move through the solution space,
            adjusting their velocities based on personal and global best positions.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">Population Size</p>
              <p className="text-xl font-bold">50</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">Inertia Weight</p>
              <p className="text-xl font-bold">0.729</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">c1 (Cognitive)</p>
              <p className="text-xl font-bold">1.49</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">c2 (Social)</p>
              <p className="text-xl font-bold">1.49</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="ga" className="space-y-4">
          <h4 className="font-display font-semibold">Genetic Algorithm</h4>
          <p className="text-muted-foreground">
            GA uses evolution-inspired operators including selection, crossover, and mutation
            to evolve better solutions over generations.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">Population</p>
              <p className="text-xl font-bold">100</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">Crossover Rate</p>
              <p className="text-xl font-bold">0.85</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">Mutation Rate</p>
              <p className="text-xl font-bold">0.01</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">Selection</p>
              <p className="text-xl font-bold">Tournament</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="aco" className="space-y-4">
          <h4 className="font-display font-semibold">Ant Colony Optimization</h4>
          <p className="text-muted-foreground">
            ACO mimics ant foraging behavior using pheromone trails to find optimal paths,
            adapted here for feature selection and hyperparameter tuning.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">Ant Count</p>
              <p className="text-xl font-bold">30</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">Alpha (α)</p>
              <p className="text-xl font-bold">1.0</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">Beta (β)</p>
              <p className="text-xl font-bold">2.0</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">Evaporation</p>
              <p className="text-xl font-bold">0.5</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="hybrid" className="space-y-4">
          <h4 className="font-display font-semibold">Hybrid Swarm Optimization</h4>
          <p className="text-muted-foreground">
            Our hybrid approach combines the exploration of PSO, the genetic diversity of GA,
            and the path-finding efficiency of ACO for superior optimization performance.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">PSO Weight</p>
              <p className="text-xl font-bold">0.35</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">GA Weight</p>
              <p className="text-xl font-bold">0.35</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">ACO Weight</p>
              <p className="text-xl font-bold">0.30</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">Improvement</p>
              <p className="text-xl font-bold text-success">+12.4%</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
