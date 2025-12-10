import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  suffix?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

const variantStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
};

export function StatCard({ icon: Icon, label, value, suffix, variant = 'default' }: StatCardProps) {
  return (
    <Card className="flex-1">
      <CardContent className="p-4 flex flex-col items-center justify-center text-center">
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-2", variantStyles[variant])}>
          <Icon className="w-5 h-5" />
        </div>
        <p className="text-2xl font-bold text-foreground">
          {value}{suffix && <span className="text-lg ml-0.5">{suffix}</span>}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}
