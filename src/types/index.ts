export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Dataset {
  id: string;
  name: string;
  uploadedAt: Date;
  rows: number;
  columns: number;
  size: string;
  status: 'uploaded' | 'preprocessing' | 'ready' | 'error';
}

export interface Feature {
  name: string;
  importance: number;
  selected: boolean;
  type: 'numeric' | 'categorical';
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
}

export interface Model {
  id: string;
  name: string;
  type: 'logistic' | 'svm' | 'decision_tree' | 'random_forest' | 'naive_bayes' | 'voting' | 'stacking';
  metrics: ModelMetrics;
  trainedAt: Date;
  optimized: boolean;
}

export interface Prediction {
  id: string;
  inputType: 'single' | 'batch' | 'url';
  result: 'defective' | 'non-defective';
  probability: number;
  riskLevel: 'low' | 'medium' | 'high';
  timestamp: Date;
  featureContributions: { feature: string; contribution: number }[];
}

export interface OptimizationResult {
  algorithm: 'PSO' | 'GA' | 'ACO' | 'Hybrid';
  iteration: number;
  fitness: number;
  bestParams: Record<string, number>;
  convergenceHistory: number[];
}
