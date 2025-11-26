import React from 'react';

export type TabId = string;

interface TabItem {
  id: TabId;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: TabId;
  onChange: (id: TabId) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div 
      className="inline-flex p-1.5 rounded-full shadow-inner border border-transparent transition-colors duration-200"
      style={{ backgroundColor: 'var(--bg-surface-highlight)' }}
    >
      <div className="flex space-x-1" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ease-out outline-none select-none
                ${isActive ? 'shadow-sm scale-100' : 'hover:opacity-80'}
              `}
              style={{
                backgroundColor: isActive ? 'var(--accent-color)' : 'transparent',
                color: isActive ? 'var(--accent-text)' : 'var(--text-secondary)',
              }}
              aria-selected={isActive}
              role="tab"
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;