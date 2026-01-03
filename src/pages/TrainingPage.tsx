import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Cpu, Play, Check, Loader2, Layers } from 'lucide-react';

interface ModelConfig {
  id: string;
  name: string;
  type: string;
  selected: boolean;
  trained: boolean;
  training: boolean;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    rocAuc: number;
  } | null;
}

const initialModels: ModelConfig[] = [
  { id: 'lr', name: 'Logistic Regression', type: 'logistic', selected: true, trained: false, training: false, metrics: null },
  { id: 'svm', name: 'Support Vector Machine', type: 'svm', selected: true, trained: false, training: false, metrics: null },
  { id: 'dt', name: 'Decision Tree', type: 'decision_tree', selected: true, trained: false, training: false, metrics: null },
  { id: 'rf', name: 'Random Forest', type: 'random_forest', selected: true, trained: false, training: false, metrics: null },
  { id: 'nb', name: 'Naive Bayes', type: 'naive_bayes', selected: true, trained: false, training: false, metrics: null },
  { id: 'vote', name: 'Voting Ensemble', type: 'voting', selected: true, trained: false, training: false, metrics: null },
  { id: 'stack', name: 'Stacking Ensemble', type: 'stacking', selected: true, trained: false, training: false, metrics: null },
];

const generateMetrics = () => ({
  accuracy: 0.75 + Math.random() * 0.22,
  precision: 0.72 + Math.random() * 0.25,
  recall: 0.70 + Math.random() * 0.27,
  f1: 0.71 + Math.random() * 0.26,
  rocAuc: 0.73 + Math.random() * 0.24,
});

export default function TrainingPage() {
  const [models, setModels] = useState<ModelConfig[]>(initialModels);
  const [isTraining, setIsTraining] = useState(false);
  const [currentTrainingIndex, setCurrentTrainingIndex] = useState(-1);
  const [smoteEnabled, setSmoteEnabled] = useState(true);
  const [swarmOptimized, setSwarmOptimized] = useState(true);

  const selectedModels = models.filter((m) => m.selected);
  const trainedModels = models.filter((m) => m.trained);

  const toggleModel = (id: string) => {
    setModels((prev) =>
      prev.map((m) => (m.id === id ? { ...m, selected: !m.selected } : m))
    );
  };

  const trainModels = async () => {
    setIsTraining(true);
    const toTrain = models.filter((m) => m.selected && !m.trained);

    for (let i = 0; i < toTrain.length; i++) {
      const model = toTrain[i];
      setCurrentTrainingIndex(models.findIndex((m) => m.id === model.id));

      setModels((prev) =>
        prev.map((m) => (m.id === model.id ? { ...m, training: true } : m))
      );

      // Simulate training time
      await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

      const metrics = generateMetrics();
      // Make ensemble models slightly better
      if (model.type === 'voting' || model.type === 'stacking') {
        metrics.accuracy = Math.min(0.99, metrics.accuracy + 0.05);
        metrics.f1 = Math.min(0.99, metrics.f1 + 0.05);
      }

      setModels((prev) =>
        prev.map((m) =>
          m.id === model.id ? { ...m, training: false, trained: true, metrics } : m
        )
      );
    }

    setCurrentTrainingIndex(-1);
    setIsTraining(false);
  };

  const radarData = trainedModels
    .filter((m) => m.metrics)
    .slice(0, 4)
    .map((m) => ({
      name: m.name.split(' ')[0],
      ...m.metrics,
    }));

  const radarMetrics = [
    { key: 'accuracy', name: 'Accuracy' },
    { key: 'precision', name: 'Precision' },
    { key: 'recall', name: 'Recall' },
    { key: 'f1', name: 'F1-Score' },
    { key: 'rocAuc', name: 'ROC-AUC' },
  ];

  const radarFormatted = radarMetrics.map((metric) => ({
    metric: metric.name,
    ...Object.fromEntries(radarData.map((d) => [d.name, (d as any)[metric.key] * 100])),
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Model Training</h1>
          <p className="text-muted-foreground mt-1">
            Train individual and ensemble ML models with swarm optimization
          </p>
        </div>
        <Button onClick={trainModels} disabled={isTraining || selectedModels.length === 0}>
          {isTraining ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Training...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Train Selected Models
            </>
          )}
        </Button>
      </div>

      {/* Training Options */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-display font-semibold mb-4">Training Configuration</h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <Checkbox
              id="smote"
              checked={smoteEnabled}
              onCheckedChange={(checked) => setSmoteEnabled(!!checked)}
            />
            <label htmlFor="smote" className="text-sm">
              <span className="font-medium">SMOTE Oversampling</span>
              <p className="text-xs text-muted-foreground">Balance class distribution</p>
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              id="swarm"
              checked={swarmOptimized}
              onCheckedChange={(checked) => setSwarmOptimized(!!checked)}
            />
            <label htmlFor="swarm" className="text-sm">
              <span className="font-medium">Swarm Optimization</span>
              <p className="text-xs text-muted-foreground">Tune hyperparameters with PSO+GA+ACO</p>
            </label>
          </div>
        </div>
      </div>

      {/* Model Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-display font-semibold mb-6">Select Models</h3>
          <div className="space-y-3">
            {models.map((model) => (
              <div
                key={model.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                  model.selected
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-border bg-secondary/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={model.selected}
                    onCheckedChange={() => toggleModel(model.id)}
                    disabled={model.training}
                  />
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        model.type.includes('ensemble') || model.type === 'voting' || model.type === 'stacking'
                          ? 'bg-accent/10'
                          : 'bg-primary/10'
                      }`}
                    >
                      {model.type === 'voting' || model.type === 'stacking' ? (
                        <Layers className="h-4 w-4 text-accent" />
                      ) : (
                        <Cpu className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{model.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{model.type.replace('_', ' ')}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {model.training && (
                    <span className="metric-badge warning">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Training
                    </span>
                  )}
                  {model.trained && !model.training && (
                    <span className="metric-badge success">
                      <Check className="h-3 w-3" />
                      Trained
                    </span>
                  )}
                  {model.metrics && (
                    <span className="text-lg font-bold text-primary">
                      {(model.metrics.accuracy * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Radar Chart */}
        <div className="chart-container">
          <h3 className="text-lg font-display font-semibold mb-6">Model Comparison</h3>
          {trainedModels.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={radarFormatted}>
                <PolarGrid stroke="hsl(222, 30%, 18%)" />
                <PolarAngleAxis dataKey="metric" stroke="hsl(215, 20%, 55%)" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="hsl(215, 20%, 55%)" fontSize={10} />
                {radarData.slice(0, 4).map((model, index) => (
                  <Radar
                    key={model.name}
                    name={model.name}
                    dataKey={model.name}
                    stroke={
                      index === 0
                        ? 'hsl(175, 80%, 50%)'
                        : index === 1
                        ? 'hsl(280, 70%, 55%)'
                        : index === 2
                        ? 'hsl(45, 95%, 55%)'
                        : 'hsl(150, 70%, 45%)'
                    }
                    fill={
                      index === 0
                        ? 'hsl(175, 80%, 50%)'
                        : index === 1
                        ? 'hsl(280, 70%, 55%)'
                        : index === 2
                        ? 'hsl(45, 95%, 55%)'
                        : 'hsl(150, 70%, 45%)'
                    }
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                ))}
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[350px] text-muted-foreground">
              <div className="text-center">
                <Cpu className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Train models to see comparison</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trained Model Details */}
      {trainedModels.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-display font-semibold mb-6">Training Results</h3>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Model</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Accuracy</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Precision</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Recall</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">F1-Score</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">ROC-AUC</th>
                </tr>
              </thead>
              <tbody>
                {trainedModels.map((model) => (
                  <tr key={model.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="py-3 px-4 font-medium">{model.name}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold ${model.metrics!.accuracy > 0.9 ? 'text-success' : ''}`}>
                        {(model.metrics!.accuracy * 100).toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">{(model.metrics!.precision * 100).toFixed(2)}%</td>
                    <td className="py-3 px-4 text-center">{(model.metrics!.recall * 100).toFixed(2)}%</td>
                    <td className="py-3 px-4 text-center">{(model.metrics!.f1 * 100).toFixed(2)}%</td>
                    <td className="py-3 px-4 text-center">{(model.metrics!.rocAuc * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
