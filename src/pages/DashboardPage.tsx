import React from 'react';
import StatCard from '../components/StatCard';
import { useFinance } from '../hooks/useFinance';
import { useTheme } from '../context/ThemeContext';
import { theme } from '../theme';
import { formatCurrency } from '../utils/helpers';
import { DollarSign, TrendingUp, TrendingDown, CheckCircle, AlertCircle, Calendar, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardPage: React.FC = () => {
  const { stats } = useFinance();
  const { isDark } = useTheme();

  // Estilos dinâmicos para containers
  const containerStyle = {
    backgroundColor: isDark ? theme.dark.colors.surface : theme.light.colors.surface,
    borderColor: isDark ? theme.dark.colors.border : theme.light.colors.border,
    color: isDark ? theme.dark.colors.textPrimary : theme.light.colors.textPrimary,
    boxShadow: isDark ? 'none' : theme.light.shadows.sm,
  };

  const textSecondaryStyle = {
    color: isDark ? theme.dark.colors.textSecondary : theme.light.colors.textSecondary
  };

  // Prepare data for chart (Last 6 months)
  const chartData = stats.monthlyMatrix.slice(-6).map(item => ({
    name: item.month,
    Receita: item.received,
    Dívidas: item.totalDebts
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Renda Bruta Total" 
          value={formatCurrency(stats.grossIncome)} 
          icon={DollarSign}
          color="blue"
        />
        <StatCard 
          title="Recebido" 
          value={formatCurrency(stats.receivedIncome)} 
          icon={CheckCircle}
          trend={{ value: 100, isPositive: true }}
          color="emerald"
        />
        <StatCard 
          title="A Receber" 
          value={formatCurrency(stats.receivableIncome)} 
          icon={TrendingUp}
          color="amber"
        />
        <StatCard 
          title="Dívidas Totais" 
          value={formatCurrency(stats.totalDebt)} 
          icon={AlertCircle}
          color="rose"
        />
        <StatCard 
          title="Dívidas Pagas" 
          value={formatCurrency(stats.paidDebt)} 
          icon={CheckCircle}
          color="emerald"
        />
        <StatCard 
          title="Dívidas em Aberto" 
          value={formatCurrency(stats.openDebt)} 
          icon={TrendingDown}
          trend={{ value: 0, isPositive: false }}
          color="rose"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-1">
        <div 
          className="rounded-xl border p-6 transition-colors duration-300"
          style={containerStyle}
        >
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-medium flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Tendência: Receita vs. Dívidas (Últimos 6 meses)
            </h3>
          </div>
          
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E2E8F0"} opacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    stroke={isDark ? "#94A3B8" : "#64748b"} 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke={isDark ? "#94A3B8" : "#64748b"} 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `R$${value}`} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#1E293B' : '#FFFFFF', 
                      borderColor: isDark ? '#334155' : '#E2E8F0', 
                      borderRadius: '12px', 
                      color: isDark ? '#F8FAFC' : '#1E293B',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                    itemStyle={{ color: isDark ? '#F8FAFC' : '#1E293B' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Receita" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Dívidas" 
                    stroke="#ef4444" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                Sem dados suficientes para o gráfico.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Matrix Table */}
      <div 
        className="rounded-xl border shadow-sm overflow-hidden transition-colors duration-300"
        style={containerStyle}
      >
        <div 
          className="p-6 border-b"
          style={{ borderColor: isDark ? theme.dark.colors.border : theme.light.colors.border }}
        >
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Visão Mensal Detalhada
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead 
              className="text-xs uppercase"
              style={{ 
                backgroundColor: isDark ? '#0F172A' : '#F8FAFC', // Slate 900 vs Slate 50 equivalent
                color: isDark ? theme.dark.colors.textSecondary : theme.light.colors.textSecondary
              }}
            >
              <tr>
                <th className="px-6 py-3">Mês</th>
                <th className="px-6 py-3 text-blue-600 dark:text-blue-400">Total Eventos</th>
                <th className="px-6 py-3 text-emerald-600 dark:text-emerald-400">Recebido</th>
                <th className="px-6 py-3 text-amber-600 dark:text-amber-400">A Receber</th>
                <th className="px-6 py-3 text-red-600 dark:text-red-400">Total Dívidas</th>
                <th className="px-6 py-3">Pago (Dívida)</th>
                <th className="px-6 py-3">Aberto (Dívida)</th>
              </tr>
            </thead>
            <tbody 
              className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}
            >
              {stats.monthlyMatrix.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    Nenhum dado registrado ainda.
                  </td>
                </tr>
              ) : (
                stats.monthlyMatrix.map((row) => (
                  <tr 
                    key={row.month} 
                    className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">{row.month}</td>
                    <td className="px-6 py-4">{formatCurrency(row.totalEvents)}</td>
                    <td className="px-6 py-4">{formatCurrency(row.received)}</td>
                    <td className="px-6 py-4">{formatCurrency(row.receivable)}</td>
                    <td className="px-6 py-4">{formatCurrency(row.totalDebts)}</td>
                    <td className="px-6 py-4">{formatCurrency(row.debtsPaid)}</td>
                    <td className="px-6 py-4">{formatCurrency(row.debtsOpen)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;