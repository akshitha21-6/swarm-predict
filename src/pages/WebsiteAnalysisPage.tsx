import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Globe,
  Search,
  Loader2,
  Check,
  X,
  AlertTriangle,
  Shield,
  FileCode,
  Link2,
  Gauge,
} from 'lucide-react';

interface WebsiteAnalysis {
  url: string;
  htmlSize: number;
  scriptCount: number;
  brokenLinks: number;
  jsComplexity: number;
  securityHeaders: {
    name: string;
    present: boolean;
  }[];
  defectProbability: number;
  riskLevel: 'low' | 'medium' | 'high';
  issues: string[];
}

export default function WebsiteAnalysisPage() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null);

  const analyzeWebsite = async () => {
    if (!url) return;
    
    setIsAnalyzing(true);
    setProgress(0);
    setAnalysis(null);

    // Simulate progressive analysis
    const stages = [
      { progress: 20, text: 'Fetching page...' },
      { progress: 40, text: 'Analyzing HTML structure...' },
      { progress: 60, text: 'Checking JavaScript complexity...' },
      { progress: 80, text: 'Validating security headers...' },
      { progress: 100, text: 'Generating report...' },
    ];

    for (const stage of stages) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setProgress(stage.progress);
    }

    // Generate mock analysis
    const probability = Math.random();
    const mockAnalysis: WebsiteAnalysis = {
      url,
      htmlSize: Math.floor(Math.random() * 500 + 100),
      scriptCount: Math.floor(Math.random() * 20 + 5),
      brokenLinks: Math.floor(Math.random() * 5),
      jsComplexity: Math.floor(Math.random() * 80 + 20),
      securityHeaders: [
        { name: 'Content-Security-Policy', present: Math.random() > 0.4 },
        { name: 'X-Frame-Options', present: Math.random() > 0.3 },
        { name: 'X-Content-Type-Options', present: Math.random() > 0.2 },
        { name: 'Strict-Transport-Security', present: Math.random() > 0.5 },
        { name: 'X-XSS-Protection', present: Math.random() > 0.3 },
      ],
      defectProbability: probability,
      riskLevel: probability > 0.7 ? 'high' : probability > 0.4 ? 'medium' : 'low',
      issues: [
        ...(Math.random() > 0.5 ? ['High JavaScript complexity detected'] : []),
        ...(Math.random() > 0.6 ? ['Missing critical security headers'] : []),
        ...(Math.random() > 0.7 ? ['Large DOM size may impact performance'] : []),
        ...(Math.random() > 0.8 ? ['Potential accessibility issues'] : []),
      ],
    };

    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold">Website Defect Analysis</h1>
        <p className="text-muted-foreground mt-1">
          Analyze websites for potential defects and security vulnerabilities
        </p>
      </div>

      {/* URL Input */}
      <div className="glass-card p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="url"
              placeholder="Enter website URL (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <Button onClick={analyzeWebsite} disabled={isAnalyzing || !url} size="lg">
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Analyze
              </>
            )}
          </Button>
        </div>

        {isAnalyzing && (
          <div className="mt-6">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {progress < 20 && 'Fetching page...'}
              {progress >= 20 && progress < 40 && 'Analyzing HTML structure...'}
              {progress >= 40 && progress < 60 && 'Checking JavaScript complexity...'}
              {progress >= 60 && progress < 80 && 'Validating security headers...'}
              {progress >= 80 && 'Generating report...'}
            </p>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Overall Result */}
          <div
            className={`glass-card p-6 border-l-4 ${
              analysis.riskLevel === 'high'
                ? 'border-l-destructive'
                : analysis.riskLevel === 'medium'
                ? 'border-l-warning'
                : 'border-l-success'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-display font-semibold">Analysis Complete</h3>
                <p className="text-muted-foreground text-sm">{analysis.url}</p>
              </div>
              <div className="text-right">
                <p
                  className={`text-3xl font-bold ${
                    analysis.riskLevel === 'high'
                      ? 'text-destructive'
                      : analysis.riskLevel === 'medium'
                      ? 'text-warning'
                      : 'text-success'
                  }`}
                >
                  {(analysis.defectProbability * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                  {analysis.riskLevel} Risk
                </p>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <FileCode className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">HTML Size</span>
              </div>
              <p className="text-2xl font-bold">{analysis.htmlSize} KB</p>
            </div>
            <div className="glass-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <Gauge className="h-5 w-5 text-accent" />
                <span className="text-sm text-muted-foreground">Scripts</span>
              </div>
              <p className="text-2xl font-bold">{analysis.scriptCount}</p>
            </div>
            <div className="glass-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <Link2 className="h-5 w-5 text-warning" />
                <span className="text-sm text-muted-foreground">Broken Links</span>
              </div>
              <p className={`text-2xl font-bold ${analysis.brokenLinks > 0 ? 'text-warning' : 'text-success'}`}>
                {analysis.brokenLinks}
              </p>
            </div>
            <div className="glass-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-5 w-5 text-success" />
                <span className="text-sm text-muted-foreground">JS Complexity</span>
              </div>
              <p className="text-2xl font-bold">{analysis.jsComplexity}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Headers */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-display font-semibold mb-6">Security Headers</h3>
              <div className="space-y-3">
                {analysis.securityHeaders.map((header) => (
                  <div
                    key={header.name}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      header.present ? 'bg-success/10' : 'bg-destructive/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {header.present ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <X className="h-4 w-4 text-destructive" />
                      )}
                      <span className="text-sm font-mono">{header.name}</span>
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        header.present ? 'text-success' : 'text-destructive'
                      }`}
                    >
                      {header.present ? 'Present' : 'Missing'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Issues */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-display font-semibold mb-6">Detected Issues</h3>
              {analysis.issues.length > 0 ? (
                <div className="space-y-3">
                  {analysis.issues.map((issue, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-warning/10"
                    >
                      <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                      <span className="text-sm">{issue}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-success/10">
                  <Check className="h-5 w-5 text-success" />
                  <span>No critical issues detected</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
