import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// ROC Curve data
const rocData = Array.from({ length: 50 }, (_, i) => ({
  fpr: i / 50,
  tpr: Math.pow(i / 50, 0.5) + Math.random() * 0.1,
  random: i / 50,
}));

// Confusion Matrix data
const confusionMatrix = {
  tp: 847,
  fp: 53,
  fn: 89,
  tn: 1011,
};

// Precision-Recall data
const prData = Array.from({ length: 20 }, (_, i) => ({
  recall: (i + 1) / 20,
  precision: 0.95 - 0.4 * Math.pow((i + 1) / 20, 1.5) + Math.random() * 0.05,
}));

// Learning curve data
const learningData = [
  { size: '10%', train: 0.98, test: 0.65 },
  { size: '20%', train: 0.97, test: 0.72 },
  { size: '30%', train: 0.96, test: 0.78 },
  { size: '40%', train: 0.95, test: 0.82 },
  { size: '50%', train: 0.94, test: 0.85 },
  { size: '60%', train: 0.94, test: 0.87 },
  { size: '70%', train: 0.93, test: 0.89 },
  { size: '80%', train: 0.93, test: 0.91 },
  { size: '90%', train: 0.92, test: 0.92 },
  { size: '100%', train: 0.92, test: 0.93 },
];

export default function MetricsPage() {
  const [selectedModel, setSelectedModel] = useState('ensemble');

  const total = confusionMatrix.tp + confusionMatrix.fp + confusionMatrix.fn + confusionMatrix.tn;
  const accuracy = (confusionMatrix.tp + confusionMatrix.tn) / total;
  const precision = confusionMatrix.tp / (confusionMatrix.tp + confusionMatrix.fp);
  const recall = confusionMatrix.tp / (confusionMatrix.tp + confusionMatrix.fn);
  const f1 = (2 * precision * recall) / (precision + recall);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Evaluation Metrics</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive model performance analysis
          </p>
        </div>
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ensemble">Stacking Ensemble</SelectItem>
            <SelectItem value="rf">Random Forest</SelectItem>
            <SelectItem value="svm">SVM</SelectItem>
            <SelectItem value="lr">Logistic Regression</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 text-center">
          <p className="text-3xl font-bold text-primary">{(accuracy * 100).toFixed(2)}%</p>
          <p className="text-sm text-muted-foreground mt-1">Accuracy</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-3xl font-bold text-accent">{(precision * 100).toFixed(2)}%</p>
          <p className="text-sm text-muted-foreground mt-1">Precision</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-3xl font-bold text-warning">{(recall * 100).toFixed(2)}%</p>
          <p className="text-sm text-muted-foreground mt-1">Recall</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-3xl font-bold text-success">{(f1 * 100).toFixed(2)}%</p>
          <p className="text-sm text-muted-foreground mt-1">F1-Score</p>
        </div>
      </div>

      <Tabs defaultValue="confusion">
        <TabsList className="mb-6">
          <TabsTrigger value="confusion">Confusion Matrix</TabsTrigger>
          <TabsTrigger value="roc">ROC Curve</TabsTrigger>
          <TabsTrigger value="pr">Precision-Recall</TabsTrigger>
          <TabsTrigger value="learning">Learning Curve</TabsTrigger>
        </TabsList>

        <TabsContent value="confusion">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visual Matrix */}
            <div className="chart-container">
              <h3 className="text-lg font-display font-semibold mb-6">Confusion Matrix</h3>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="p-8 rounded-xl bg-success/20 text-center border border-success/30">
                  <p className="text-3xl font-bold text-success">{confusionMatrix.tp}</p>
                  <p className="text-sm text-muted-foreground mt-2">True Positive</p>
                </div>
                <div className="p-8 rounded-xl bg-destructive/20 text-center border border-destructive/30">
                  <p className="text-3xl font-bold text-destructive">{confusionMatrix.fp}</p>
                  <p className="text-sm text-muted-foreground mt-2">False Positive</p>
                </div>
                <div className="p-8 rounded-xl bg-warning/20 text-center border border-warning/30">
                  <p className="text-3xl font-bold text-warning">{confusionMatrix.fn}</p>
                  <p className="text-sm text-muted-foreground mt-2">False Negative</p>
                </div>
                <div className="p-8 rounded-xl bg-primary/20 text-center border border-primary/30">
                  <p className="text-3xl font-bold text-primary">{confusionMatrix.tn}</p>
                  <p className="text-sm text-muted-foreground mt-2">True Negative</p>
                </div>
              </div>
              <div className="flex justify-center gap-8 mt-6 text-sm text-muted-foreground">
                <div className="text-center">
                  <p className="font-bold text-lg">Predicted →</p>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-display font-semibold mb-6">Detailed Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <span className="text-muted-foreground">True Positive Rate (Sensitivity)</span>
                  <span className="font-bold">{(recall * 100).toFixed(2)}%</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <span className="text-muted-foreground">True Negative Rate (Specificity)</span>
                  <span className="font-bold">
                    {((confusionMatrix.tn / (confusionMatrix.tn + confusionMatrix.fp)) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <span className="text-muted-foreground">False Positive Rate</span>
                  <span className="font-bold">
                    {((confusionMatrix.fp / (confusionMatrix.fp + confusionMatrix.tn)) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <span className="text-muted-foreground">False Negative Rate</span>
                  <span className="font-bold">
                    {((confusionMatrix.fn / (confusionMatrix.fn + confusionMatrix.tp)) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <span className="font-medium">Matthews Correlation Coefficient</span>
                  <span className="font-bold text-primary">0.847</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="roc">
          <div className="chart-container">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-display font-semibold">ROC Curve</h3>
                <p className="text-sm text-muted-foreground">Area Under Curve (AUC): 0.967</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={rocData}>
                <defs>
                  <linearGradient id="rocGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(175, 80%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(175, 80%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                <XAxis
                  dataKey="fpr"
                  stroke="hsl(215, 20%, 55%)"
                  fontSize={12}
                  label={{ value: 'False Positive Rate', position: 'bottom', fill: 'hsl(215, 20%, 55%)' }}
                  tickFormatter={(value) => value.toFixed(1)}
                />
                <YAxis
                  stroke="hsl(215, 20%, 55%)"
                  fontSize={12}
                  label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fill: 'hsl(215, 20%, 55%)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 10%)',
                    border: '1px solid hsl(222, 30%, 18%)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="random"
                  stroke="hsl(215, 20%, 35%)"
                  strokeDasharray="5 5"
                  dot={false}
                  name="Random Classifier"
                />
                <Area
                  type="monotone"
                  dataKey="tpr"
                  stroke="hsl(175, 80%, 50%)"
                  fill="url(#rocGradient)"
                  strokeWidth={2}
                  name="Model"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="pr">
          <div className="chart-container">
            <div className="mb-6">
              <h3 className="text-lg font-display font-semibold">Precision-Recall Curve</h3>
              <p className="text-sm text-muted-foreground">Average Precision: 0.943</p>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={prData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                <XAxis
                  dataKey="recall"
                  stroke="hsl(215, 20%, 55%)"
                  fontSize={12}
                  label={{ value: 'Recall', position: 'bottom', fill: 'hsl(215, 20%, 55%)' }}
                />
                <YAxis
                  stroke="hsl(215, 20%, 55%)"
                  fontSize={12}
                  domain={[0, 1]}
                  label={{ value: 'Precision', angle: -90, position: 'insideLeft', fill: 'hsl(215, 20%, 55%)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 10%)',
                    border: '1px solid hsl(222, 30%, 18%)',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [value.toFixed(3), '']}
                />
                <Line
                  type="monotone"
                  dataKey="precision"
                  stroke="hsl(280, 70%, 55%)"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(280, 70%, 55%)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="learning">
          <div className="chart-container">
            <div className="mb-6">
              <h3 className="text-lg font-display font-semibold">Learning Curve</h3>
              <p className="text-sm text-muted-foreground">Training vs Validation accuracy by dataset size</p>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={learningData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                <XAxis
                  dataKey="size"
                  stroke="hsl(215, 20%, 55%)"
                  fontSize={12}
                  label={{ value: 'Training Size', position: 'bottom', fill: 'hsl(215, 20%, 55%)' }}
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
                  formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, '']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="train"
                  stroke="hsl(175, 80%, 50%)"
                  strokeWidth={2}
                  name="Training Score"
                />
                <Line
                  type="monotone"
                  dataKey="test"
                  stroke="hsl(280, 70%, 55%)"
                  strokeWidth={2}
                  name="Validation Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
