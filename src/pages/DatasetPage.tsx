import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  FileSpreadsheet,
  Check,
  AlertCircle,
  Loader2,
  Database,
  Trash2,
  Eye,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';

interface UploadedDataset {
  id: string;
  name: string;
  size: string;
  rows: number;
  columns: number;
  status: 'uploading' | 'preprocessing' | 'ready' | 'error';
  uploadedAt: Date;
}

const mockDatasets: UploadedDataset[] = [
  {
    id: '1',
    name: 'NASA_KC1.csv',
    size: '2.4 MB',
    rows: 2109,
    columns: 22,
    status: 'ready',
    uploadedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'PROMISE_CM1.csv',
    size: '1.8 MB',
    rows: 498,
    columns: 21,
    status: 'ready',
    uploadedAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    name: 'Eclipse_Bug_Dataset.csv',
    size: '5.2 MB',
    rows: 4702,
    columns: 28,
    status: 'ready',
    uploadedAt: new Date('2024-01-12'),
  },
];

const mockPreviewData = [
  { loc: 156, cc: 12, comment_density: 0.23, num_functions: 8, code_churn: 45, defective: 1 },
  { loc: 89, cc: 5, comment_density: 0.45, num_functions: 3, code_churn: 12, defective: 0 },
  { loc: 234, cc: 18, comment_density: 0.12, num_functions: 15, code_churn: 78, defective: 1 },
  { loc: 67, cc: 3, comment_density: 0.56, num_functions: 2, code_churn: 5, defective: 0 },
  { loc: 312, cc: 25, comment_density: 0.08, num_functions: 22, code_churn: 134, defective: 1 },
];

export default function DatasetPage() {
  const [datasets, setDatasets] = useState<UploadedDataset[]>(mockDatasets);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<UploadedDataset | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const simulateUpload = useCallback((file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          const newDataset: UploadedDataset = {
            id: Date.now().toString(),
            name: file.name,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            rows: Math.floor(Math.random() * 5000) + 500,
            columns: Math.floor(Math.random() * 20) + 10,
            status: 'ready',
            uploadedAt: new Date(),
          };
          
          setDatasets((prev) => [newDataset, ...prev]);
          toast.success('Dataset uploaded and preprocessed successfully!');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find((f) => f.name.endsWith('.csv'));
    
    if (csvFile) {
      simulateUpload(csvFile);
    } else {
      toast.error('Please upload a CSV file');
    }
  }, [simulateUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateUpload(file);
    }
  }, [simulateUpload]);

  const handleDelete = useCallback((id: string) => {
    setDatasets((prev) => prev.filter((d) => d.id !== id));
    if (selectedDataset?.id === id) {
      setSelectedDataset(null);
    }
    toast.success('Dataset deleted');
  }, [selectedDataset]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold">Dataset Upload & Preprocessing</h1>
        <p className="text-muted-foreground mt-1">
          Upload NASA, PROMISE, or custom datasets for defect analysis
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-12 transition-all ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        }`}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="absolute inset-0 opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        <div className="text-center space-y-4">
          {isUploading ? (
            <>
              <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin" />
              <div className="space-y-2">
                <p className="font-medium">Processing dataset...</p>
                <div className="max-w-xs mx-auto">
                  <Progress value={uploadProgress} className="h-2" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {uploadProgress < 30 && 'Uploading file...'}
                  {uploadProgress >= 30 && uploadProgress < 60 && 'Handling missing values...'}
                  {uploadProgress >= 60 && uploadProgress < 80 && 'Normalizing features...'}
                  {uploadProgress >= 80 && 'Encoding labels...'}
                </p>
              </div>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <p className="font-medium">Drop your CSV file here, or click to browse</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Supports NASA, PROMISE, and custom defect datasets
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Preprocessing Steps */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-display font-semibold mb-4">Automatic Preprocessing Pipeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: '1', label: 'Missing Value Handling', desc: 'Mean/mode imputation' },
            { step: '2', label: 'Normalization', desc: 'Min-Max & Z-score scaling' },
            { step: '3', label: 'Encoding', desc: 'Label & one-hot encoding' },
            { step: '4', label: 'Validation', desc: 'Data quality checks' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-sm">
                {item.step}
              </div>
              <div>
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dataset List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Datasets */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-semibold">Uploaded Datasets</h3>
            <span className="text-sm text-muted-foreground">{datasets.length} datasets</span>
          </div>
          <div className="space-y-3">
            {datasets.map((dataset) => (
              <div
                key={dataset.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedDataset?.id === dataset.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedDataset(dataset)}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{dataset.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {dataset.rows.toLocaleString()} rows • {dataset.columns} columns • {dataset.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {dataset.status === 'ready' && (
                    <span className="metric-badge success">
                      <Check className="h-3 w-3" />
                      Ready
                    </span>
                  )}
                  {dataset.status === 'error' && (
                    <span className="metric-badge danger">
                      <AlertCircle className="h-3 w-3" />
                      Error
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(dataset.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dataset Preview */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-semibold">Dataset Preview</h3>
            {selectedDataset && (
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
          {selectedDataset ? (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">LOC</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">CC</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Comments</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Functions</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Churn</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Defective</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPreviewData.map((row, index) => (
                    <tr key={index} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className="py-3 px-4">{row.loc}</td>
                      <td className="py-3 px-4">{row.cc}</td>
                      <td className="py-3 px-4">{row.comment_density.toFixed(2)}</td>
                      <td className="py-3 px-4">{row.num_functions}</td>
                      <td className="py-3 px-4">{row.code_churn}</td>
                      <td className="py-3 px-4">
                        <span className={`metric-badge ${row.defective ? 'danger' : 'success'}`}>
                          {row.defective ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Showing first 5 rows of {selectedDataset.rows.toLocaleString()} • Read-only preview
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Eye className="h-12 w-12 mb-4 opacity-50" />
              <p>Select a dataset to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
