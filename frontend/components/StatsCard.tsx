'use client';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: 'emerald' | 'blue' | 'purple' | 'orange' | 'red' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
}

export default function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'neutral',
  size = 'md' 
}: StatsCardProps) {
  const colorClasses = {
    emerald: 'text-emerald-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    orange: 'text-orange-400',
    red: 'text-red-400',
    neutral: 'text-neutral-300',
  };

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-2">
        {icon && <span className="text-lg">{icon}</span>}
        <div className="text-sm text-neutral-400">{title}</div>
      </div>
      <div className={`font-bold ${sizeClasses[size]} ${colorClasses[color]}`}>
        {value}
      </div>
      {subtitle && (
        <div className="text-xs text-neutral-500 mt-1">{subtitle}</div>
      )}
    </div>
  );
}
