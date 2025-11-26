import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { theme } from '../theme';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'violet' | 'emerald' | 'rose' | 'amber' | 'blue';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  trend,
  color = 'violet',
  className 
}) => {
  const { isDark } = useTheme();

  // Lógica FORÇADA para cores, ignorando classes CSS globais
  const cardStyle = {
    backgroundColor: isDark ? theme.dark.colors.surface : theme.light.colors.surface,
    borderColor: isDark ? theme.dark.colors.border : theme.light.colors.border,
    // Sombra apenas no modo claro, como pedido
    boxShadow: isDark ? 'none' : theme.light.shadows.card,
    color: isDark ? theme.dark.colors.textPrimary : theme.light.colors.textPrimary,
  };

  const colorStyles = {
    violet: isDark ? 'bg-violet-500/10 text-violet-400' : 'bg-violet-50 text-violet-600',
    emerald: isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600',
    rose: isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600',
    amber: isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600',
    blue: isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600',
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-[24px] border transition-all duration-300 hover:-translate-y-1 ${className || ''}`}
      style={cardStyle}
    >
      <div className="p-6 flex flex-col h-full justify-between">
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
             {Icon && (
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${colorStyles[color]}`}>
                  <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                </div>
              )}
              <h3 
                className="text-[13px] font-medium uppercase tracking-wide"
                style={{ color: isDark ? theme.dark.colors.textSecondary : theme.light.colors.textSecondary }}
              >
                {title}
              </h3>
          </div>
          
          {trend && (
            <div className={`
              flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold
              ${trend.isPositive 
                ? (isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600')
                : (isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600')}
            `}>
              {trend.isPositive ? '+' : '-'} {trend.value}%
            </div>
          )}
        </div>
        
        <div className="space-y-1">
           <span className="text-3xl font-bold tracking-tight font-sans">
              {value}
           </span>
           {subtitle && (
            <p 
              className="text-xs font-medium"
              style={{ color: isDark ? theme.dark.colors.textSecondary : theme.light.colors.textSecondary }}
            >
              {subtitle}
            </p>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default StatCard;