import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Brain,
  Upload,
  FileCode,
  AlertTriangle,
  Check,
  Loader2,
  Info,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface PredictionResult {
  id: string;
  moduleName: string;
  result: 'defective' | 'non-defective';
  probability: number;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  featureContributions: { feature: string; contribution: number; direction: 'positive' | 'negative' }[];
}

const mockFeatureContributions = [
  { feature: 'Cyclomatic Complexity', contribution: 0.28, direction: 'positive' as const },
  { feature: 'Lines of Code', contribution: 0.22, direction: 'positive' as const },
  { feature: 'Code Churn', contribution: 0.18, direction: 'positive' as const },
  { feature: 'Comment Density', contribution: -0.15, direction: 'negative' as const },
  { feature: 'Developer Experience', contribution: -0.12, direction: 'negative' as const },
  { feature: 'Test Coverage', contribution: -0.05, direction: 'negative' as const },
];

export default function PredictionsPage() {
  const [activeTab, setActiveTab] = useState('single');
  const [isLoading, setIsLoading] = useState(false);
  const [singleInput, setSingleInput] = useState({
    loc: '',
    cc: '',
    commentDensity: '',
    numFunctions: '',
    codeChurn: '',
  });
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  const handleSinglePredict = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const probability = Math.random();
    const result: PredictionResult = {
      id: Date.now().toString(),
      moduleName: 'input_module.py',
      result: probability > 0.5 ? 'defective' : 'non-defective',
      probability,
      riskLevel: probability > 0.7 ? 'high' : probability > 0.4 ? 'medium' : 'low',
      confidence: 0.85 + Math.random() * 0.1,
      featureContributions: mockFeatureContributions,
    };

    setPrediction(result);
    setIsLoading(false);
  };

  const chartData = prediction?.featureContributions.map((f) => ({
    feature: f.feature.length > 15 ? f.feature.slice(0, 15) + '...' : f.feature,
    contribution: Math.abs(f.contribution) * 100,
    direction: f.direction,
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold">Defect Prediction</h1>
        <p className="text-muted-foreground mt-1">
          Predict defects with explainable AI insights
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="single">Single Prediction</TabsTrigger>
          <TabsTrigger value="batch">Batch Upload</TabsTrigger>
          <TabsTrigger value="code">Code Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-display font-semibold mb-6">Module Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lines of Code</label>
                  <Input
                    type="number"
                    placeholder="e.g., 250"
                    value={singleInput.loc}
                    onChange={(e) => setSingleInput({ ...singleInput, loc: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cyclomatic Complexity</label>
                  <Input
                    type="number"
                    placeholder="e.g., 15"
                    value={singleInput.cc}
                    onChange={(e) => setSingleInput({ ...singleInput, cc: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Comment Density</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="e.g., 0.25"
                    value={singleInput.commentDensity}
                    onChange={(e) => setSingleInput({ ...singleInput, commentDensity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Number of Functions</label>
                  <Input
                    type="number"
                    placeholder="e.g., 12"
                    value={singleInput.numFunctions}
                    onChange={(e) => setSingleInput({ ...singleInput, numFunctions: e.target.value })}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium">Code Churn</label>
                  <Input
                    type="number"
                    placeholder="e.g., 45"
                    value={singleInput.codeChurn}
                    onChange={(e) => setSingleInput({ ...singleInput, codeChurn: e.target.value })}
                  />
                </div>
              </div>
              <Button className="w-full mt-6" onClick={handleSinglePredict} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Predict Defect
                  </>
                )}
              </Button>
            </div>

            {/* Prediction Result */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-display font-semibold mb-6">Prediction Result</h3>
              {prediction ? (
                <div className="space-y-6">
                  {/* Main Result */}
                  <div
                    className={`p-6 rounded-xl text-center ${
                      prediction.result === 'defective'
                        ? 'bg-destructive/10 border border-destructive/30'
                        : 'bg-success/10 border border-success/30'
                    }`}
                  >
                    <div
                      className={`inline-flex p-4 rounded-full mb-4 ${
                        prediction.result === 'defective' ? 'bg-destructive/20' : 'bg-success/20'
                      }`}
                    >
                      {prediction.result === 'defective' ? (
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                      ) : (
                        <Check className="h-8 w-8 text-success" />
                      )}
                    </div>
                    <h4 className="text-2xl font-display font-bold capitalize mb-2">
                      {prediction.result.replace('-', ' ')}
                    </h4>
                    <p className="text-muted-foreground">
                      {(prediction.probability * 100).toFixed(1)}% defect probability
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <p className="text-sm text-muted-foreground">Risk Level</p>
                      <p
                        className={`text-xl font-bold capitalize ${
                          prediction.riskLevel === 'high'
                            ? 'text-destructive'
                            : prediction.riskLevel === 'medium'
                            ? 'text-warning'
                            : 'text-success'
                        }`}
                      >
                        {prediction.riskLevel}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <p className="text-sm text-muted-foreground">Confidence</p>
                      <p className="text-xl font-bold">{(prediction.confidence * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Brain className="h-12 w-12 mb-4 opacity-50" />
                  <p>Enter metrics and click Predict</p>
                </div>
              )}
            </div>
          </div>

          {/* Explainability */}
          {prediction && (
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Info className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-display font-semibold">Explainable AI - Why This Prediction?</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-4">Feature Contributions</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                      <XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                      <YAxis dataKey="feature" type="category" stroke="hsl(215, 20%, 55%)" fontSize={11} width={100} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(222, 47%, 10%)',
                          border: '1px solid hsl(222, 30%, 18%)',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [`${value.toFixed(1)}%`, 'Contribution']}
                      />
                      <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
                        {chartData?.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.direction === 'positive' ? 'hsl(0, 75%, 55%)' : 'hsl(150, 70%, 45%)'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground mb-4">Contribution Details</h4>
                  {prediction.featureContributions.map((fc) => (
                    <div
                      key={fc.feature}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                    >
                      <div className="flex items-center gap-3">
                        {fc.direction === 'positive' ? (
                          <TrendingUp className="h-4 w-4 text-destructive" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-success" />
                        )}
                        <span className="text-sm">{fc.feature}</span>
                      </div>
                      <span
                        className={`font-bold ${
                          fc.direction === 'positive' ? 'text-destructive' : 'text-success'
                        }`}
                      >
                        {fc.direction === 'positive' ? '+' : ''}
                        {(fc.contribution * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="batch" className="space-y-6">
          <div className="glass-card p-12">
            <div className="text-center space-y-4">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <p className="font-medium">Upload CSV for Batch Prediction</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload a file with multiple modules for bulk analysis
                </p>
              </div>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Select CSV File
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="code" className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-display font-semibold mb-4">Paste Source Code</h3>
            <Textarea
              placeholder="Paste your Python, JavaScript, Java, or other source code here..."
              className="h-64 font-mono text-sm"
            />
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                <FileCode className="h-4 w-4 inline mr-1" />
                Supports Python, JavaScript, Java, C++, Go
              </p>
              <Button>
                <Brain className="h-4 w-4 mr-2" />
                Analyze Code
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
