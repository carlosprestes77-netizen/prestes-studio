import React, { useState } from 'react';

// Providers
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Components
import Header from './components/Header';
import Tabs, { TabId } from './components/Tabs';

// Pages
import DashboardPage from './pages/DashboardPage';
import EventosPage from './pages/EventosPage';
import DividasPage from './pages/DividasPage';
import RelatoriosPage from './pages/RelatoriosPage';
import BackupPage from './pages/BackupPage';
import { theme } from './theme';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const { isDark } = useTheme();

  const tabItems = [
    { id: 'dashboard' as TabId, label: 'Dashboard' },
    { id: 'eventos' as TabId, label: 'Agenda & Jobs' },
    { id: 'dividas' as TabId, label: 'Dívidas' },
    { id: 'relatorios' as TabId, label: 'Relatórios' },
    { id: 'backup' as TabId, label: 'Backup' },
  ];

  // URL da imagem de fundo (Estilo Tech/Bokeh Azul e Roxo)
  const bgImage = "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2232&auto=format&fit=crop";

  // Aplicação FORÇADA do background via JS style com Imagem + Overlay
  const appStyle: React.CSSProperties = {
    // Definindo a cor de fundo base como fallback
    backgroundColor: isDark ? theme.dark.colors.background : theme.light.colors.background,
    color: isDark ? theme.dark.colors.textPrimary : theme.light.colors.textPrimary,
    minHeight: '100vh',
    
    // Configuração da Imagem de Fundo
    backgroundImage: isDark 
      // Modo Escuro: Overlay escuro suave para manter contraste (60% a 80% opacidade)
      ? `linear-gradient(to bottom, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.85)), url('${bgImage}')`
      // Modo Claro: Overlay branco forte (92%) para manter o aspecto "Clean" mas com textura de fundo
      : `linear-gradient(to bottom, rgba(245, 247, 250, 0.92), rgba(245, 247, 250, 0.94)), url('${bgImage}')`,
    
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed', // Efeito Parallax (imagem fixa enquanto scrolla)
  };

  return (
    <div 
      style={appStyle}
      className="transition-all duration-300 font-sans selection:bg-violet-500/30 selection:text-violet-900 pb-20 flex flex-col"
    >
      <Header />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Navegação Centralizada */}
        <div className="flex justify-center w-full">
          <Tabs 
            tabs={tabItems} 
            activeTab={activeTab} 
            onChange={(id) => setActiveTab(id)} 
          />
        </div>
        
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          {activeTab === 'dashboard' && <DashboardPage />}
          {activeTab === 'eventos' && <EventosPage />}
          {activeTab === 'dividas' && <DividasPage />}
          {activeTab === 'relatorios' && <RelatoriosPage />}
          {activeTab === 'backup' && <BackupPage />}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;