import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md text-center space-y-6">
            <div className="inline-flex p-4 rounded-2xl bg-primary/10 animate-pulse-glow">
              <Brain className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl font-display font-bold">
              Hybrid Swarm-Optimized <span className="gradient-text">ML Framework</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Advanced software defect prediction using PSO, GA, and ACO optimization algorithms combined with ensemble machine learning.
            </p>
            <div className="flex justify-center gap-8 pt-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">99.2%</p>
                <p className="text-sm text-muted-foreground">Accuracy</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-success">500+</p>
                <p className="text-sm text-muted-foreground">Projects Analyzed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">12</p>
                <p className="text-sm text-muted-foreground">ML Models</p>
              </div>
            </div>
          </div>
        </div>
        {/* Animated particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-primary animate-float" />
        <div className="absolute top-3/4 right-1/4 w-3 h-3 rounded-full bg-accent animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 rounded-full bg-success animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 lg:hidden mb-4">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-2xl font-display font-bold">DefectAI</span>
            </div>
            <h2 className="text-3xl font-display font-bold">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to continue to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Create one
              </Link>
            </p>

            <div className="glass-card p-4 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Demo Credentials:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <p className="text-primary">Admin:</p>
                  <p>admin@defectai.com</p>
                  <p>admin123</p>
                </div>
                <div className="space-y-1">
                  <p className="text-primary">User:</p>
                  <p>user@defectai.com</p>
                  <p>user123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
