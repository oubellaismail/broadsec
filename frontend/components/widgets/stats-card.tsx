import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Banknote,
  CheckCircle2,
  Clock3,
  FileWarning,
  Shield,
  Smartphone,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  description: string;
  icon:
    | 'alert'
    | 'critical'
    | 'device'
    | 'vulnerability'
    | 'reports'
    | 'triage'
    | 'resolved'
    | 'bounty';
}

export function StatsCard({
  title,
  value,
  change,
  trend,
  description,
  icon,
}: StatsCardProps) {
  const renderIcon = () => {
    const iconClasses = cn(
      'h-5 w-5',
      icon === 'alert' && 'text-yellow-500',
      icon === 'critical' && 'text-red-500',
      icon === 'device' && 'text-green-500',
      icon === 'vulnerability' && 'text-blue-500',
      icon === 'reports' && 'text-cyan-400',
      icon === 'triage' && 'text-amber-400',
      icon === 'resolved' && 'text-emerald-400',
      icon === 'bounty' && 'text-lime-400'
    );

    switch (icon) {
      case 'alert':
        return <AlertTriangle className={iconClasses} />;
      case 'critical':
        return <Zap className={iconClasses} />;
      case 'device':
        return <Smartphone className={iconClasses} />;
      case 'vulnerability':
        return <Shield className={iconClasses} />;
      case 'reports':
        return <FileWarning className={iconClasses} />;
      case 'triage':
        return <Clock3 className={iconClasses} />;
      case 'resolved':
        return <CheckCircle2 className={iconClasses} />;
      case 'bounty':
        return <Banknote className={iconClasses} />;
    }
  };

  const isCritical = icon === 'critical';

  return (
    <Card
      className={cn(
        'bg-cardBg hover:bg-cardHoverBg transition-colors',
        isCritical && 'animate-heartbeat'
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {renderIcon()}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center pt-1">
          {trend === 'up' ? (
            <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
          ) : (
            <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
          )}
          <span
            className={cn(
              'text-xs font-medium',
              trend === 'up' ? 'text-green-500' : 'text-red-500'
            )}
          >
            {change}
          </span>
          <span className="ml-2 text-xs text-muted-foreground">
            {description}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
