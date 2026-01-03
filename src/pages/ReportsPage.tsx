import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  FileText,
  Download,
  FileSpreadsheet,
  Loader2,
  Check,
  Calendar,
  BarChart3,
  Shield,
  Brain,
} from 'lucide-react';

interface ReportConfig {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

const reportSections: ReportConfig[] = [
  { id: 'summary', label: 'Executive Summary', description: 'Overview of predictions and key findings', icon: FileText },
  { id: 'dataset', label: 'Dataset Analysis', description: 'Data quality and preprocessing details', icon: FileSpreadsheet },
  { id: 'features', label: 'Feature Importance', description: 'Selected features and their impact', icon: BarChart3 },
  { id: 'models', label: 'Model Performance', description: 'Accuracy, precision, recall, F1-score', icon: Brain },
  { id: 'predictions', label: 'Prediction Details', description: 'Individual and batch results', icon: Shield },
  { id: 'xai', label: 'Explainability Report', description: 'SHAP values and feature contributions', icon: Brain },
];

interface GeneratedReport {
  id: string;
  name: string;
  format: 'pdf' | 'excel';
  generatedAt: Date;
  size: string;
}

const mockReports: GeneratedReport[] = [
  { id: '1', name: 'Full_Analysis_Report_2024-01-15', format: 'pdf', generatedAt: new Date('2024-01-15'), size: '2.4 MB' },
  { id: '2', name: 'Predictions_Export_NASA_KC1', format: 'excel', generatedAt: new Date('2024-01-14'), size: '1.1 MB' },
  { id: '3', name: 'Model_Comparison_Report', format: 'pdf', generatedAt: new Date('2024-01-12'), size: '1.8 MB' },
];

export default function ReportsPage() {
  const [selectedSections, setSelectedSections] = useState<string[]>(['summary', 'models', 'predictions']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reports, setReports] = useState<GeneratedReport[]>(mockReports);

  const toggleSection = (id: string) => {
    setSelectedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const generateReport = async (format: 'pdf' | 'excel') => {
    setIsGenerating(true);
    setProgress(0);

    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress(i);
    }

    const newReport: GeneratedReport = {
      id: Date.now().toString(),
      name: `DefectAI_Report_${new Date().toISOString().split('T')[0]}`,
      format,
      generatedAt: new Date(),
      size: format === 'pdf' ? '2.1 MB' : '856 KB',
    };

    setReports((prev) => [newReport, ...prev]);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold">Reports & Export</h1>
        <p className="text-muted-foreground mt-1">
          Generate comprehensive PDF and Excel reports
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Builder */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-display font-semibold mb-6">Report Sections</h3>
          <div className="space-y-3">
            {reportSections.map((section) => (
              <div
                key={section.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedSections.includes(section.id)
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-border hover:border-primary/30'
                }`}
                onClick={() => toggleSection(section.id)}
              >
                <Checkbox
                  checked={selectedSections.includes(section.id)}
                  onCheckedChange={() => toggleSection(section.id)}
                />
                <div className="p-2 rounded-lg bg-primary/10">
                  <section.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{section.label}</p>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
              </div>
            ))}
          </div>

          {isGenerating && (
            <div className="mt-6">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Generating report... {progress}%
              </p>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <Button
              className="flex-1"
              onClick={() => generateReport('pdf')}
              disabled={isGenerating || selectedSections.length === 0}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              Generate PDF
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => generateReport('excel')}
              disabled={isGenerating || selectedSections.length === 0}
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Generated Reports */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-display font-semibold mb-6">Generated Reports</h3>
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-lg ${
                      report.format === 'pdf' ? 'bg-destructive/10' : 'bg-success/10'
                    }`}
                  >
                    {report.format === 'pdf' ? (
                      <FileText className={`h-5 w-5 text-destructive`} />
                    ) : (
                      <FileSpreadsheet className={`h-5 w-5 text-success`} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{report.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      {report.generatedAt.toLocaleDateString()}
                      <span>•</span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-display font-semibold mb-6">Report Preview</h3>
        <div className="bg-secondary/30 rounded-lg p-8 text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">
            Select sections and generate a report to preview
          </p>
        </div>
      </div>
    </div>
  );
}
