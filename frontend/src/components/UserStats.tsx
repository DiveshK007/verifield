import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Users, Coins, TrendingUp } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  change?: number;
}

const StatCard = ({ icon, label, value, suffix = '', prefix = '', change }: StatCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (value - startValue) * easedProgress);
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [value]);

  return (
    <Card className="bg-surface border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-soft">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold text-foreground animate-counter">
                {prefix}{displayValue.toLocaleString()}{suffix}
              </p>
            </div>
          </div>
          {change && (
            <Badge variant={change > 0 ? "default" : "secondary"} className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{change}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const UserStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        icon={<Database className="h-5 w-5" />}
        label="Total Datasets"
        value={47}
        change={12}
      />
      <StatCard
        icon={<Users className="h-5 w-5" />}
        label="Total Users"
        value={1284}
        change={8}
      />
      <StatCard
        icon={<Coins className="h-5 w-5" />}
        label="Credits Earned"
        value={15420}
        change={23}
      />
    </div>
  );
};

export default UserStats;