import React from 'react';
import { Home, MessageSquare, PenTool, Languages, Settings, MoreHorizontal } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MobileBottomNavProps {
  onOpenMore: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMore }) => {
  const { activeRoute, navigate } = useApp();

  const navItems = [
    { label: 'হোম', icon: Home, route: '/' },
    { label: 'Chat', icon: MessageSquare, route: '/chat' },
    { label: 'Write', icon: PenTool, route: '/writing' },
    { label: 'অনুবাদ', icon: Languages, route: '/translation' },
    { label: 'সেটিংস', icon: Settings, route: '/settings' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeRoute === item.route;
        return (
          <button
            key={item.route}
            onClick={() => navigate(item.route)}
            className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
              isActive
                ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}

      <button
        onClick={onOpenMore}
        className="flex flex-col items-center py-1 px-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
      >
        <MoreHorizontal className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">আরও</span>
      </button>
    </div>
  );
};
