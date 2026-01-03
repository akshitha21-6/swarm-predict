import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-primary',
  className,
}: StatCardProps) {
  return (
    <div className={cn('stat-card', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-display font-bold">{value}</p>
          {change && (
            <span
              className={cn(
                'metric-badge',
                changeType === 'positive' && 'success',
                changeType === 'negative' && 'danger',
                changeType === 'neutral' && 'bg-muted text-muted-foreground'
              )}
            >
              {change}
            </span>
          )}
        </div>
        <div className={cn('p-3 rounded-xl bg-primary/10', iconColor)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
