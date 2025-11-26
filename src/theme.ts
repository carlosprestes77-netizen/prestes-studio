export const theme = {
  light: {
    colors: {
      background: '#F5F7FA', // Fundo principal suave solicitado
      surface: '#FFFFFF',    // Card branco puro
      surfaceHighlight: '#F3F4F6', // Cinza muito leve para hovers
      textPrimary: '#1F2937', // Grafite escuro e legível
      textSecondary: '#6B7280', // Cinza médio suave
      border: '#E5E7EB',     // Bordas sutis
      
      // Acentos Suaves (Pastel)
      primary: '#8B5CF6',    // Roxo base (marca)
      primarySoft: '#EDE9FE', // Lilás muito claro (fundos de ícones)
      accent: '#C7B8FF',     // Lilás de destaque (tabs ativas)
      accentText: '#4B297B', // Texto para contraste no lilás
      
      success: '#10B981',
      successSoft: '#D1FAE5',
      danger: '#F43F5E',
      dangerSoft: '#FFE4E6',
      warning: '#F59E0B',
      warningSoft: '#FEF3C7',
    },
    shadows: {
      sm: '0 1px 2px rgba(0,0,0,0.04)',
      card: '0 4px 12px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.02)', // Sombra super difusa
      floating: '0 10px 25px -5px rgba(0,0,0,0.05)',
    }
  },
  dark: {
    colors: {
      background: '#0F172A', // Slate 900
      surface: '#1E293B',    // Slate 800
      surfaceHighlight: '#334155',
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      border: '#334155',
      
      primary: '#A78BFA',
      primarySoft: 'rgba(139, 92, 246, 0.15)',
      accent: '#818CF8',
      accentText: '#FFFFFF',
      
      success: '#34D399',
      successSoft: 'rgba(52, 211, 153, 0.1)',
      danger: '#FB7185',
      dangerSoft: 'rgba(251, 113, 133, 0.1)',
      warning: '#FBBF24',
      warningSoft: 'rgba(251, 191, 36, 0.1)',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      card: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
      floating: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
    }
  },
  layout: {
    radius: {
      sm: '0.5rem',   // 8px
      md: '0.75rem',  // 12px
      lg: '1rem',     // 16px
      xl: '1.25rem',  // 20px
      full: '9999px',
    }
  }
};

export const defaultConfig = {
  theme: 'light' as const,
  monthlyBudgetLimit: 5000,
  userName: 'Prestes',
};