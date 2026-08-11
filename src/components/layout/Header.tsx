import React from 'react';
import { Menu, Search, Sparkles, Sun, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    activeRoute,
    navigate,
    setIsSearchOpen,
    isDarkMode,
    setIsDarkMode,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useApp();

  const handleToggle = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const getPageTitle = () => {
    switch (activeRoute) {
      case '/':
        return 'হোম ড্যাশবোর্ড';
      case '/chat':
        return 'AI Chat Studio';
      case '/writing':
        return 'AI Writing Workspace';
      case '/writing/email':
        return 'Email Writer';
      case '/writing/cv':
        return 'CV & Resume Writer';
      case '/translation':
        return 'Translation Tool';
      case '/rewrite':
        return 'Rewrite Content';
      case '/summarize':
        return 'Summarizer';
      case '/study':
        return 'Study Assistant';
      case '/social':
        return 'Social Media Writer';
      case '/documents':
        return 'Document / PDF Assistant';
      case '/prompts':
        return 'Prompt Generator';
      case '/favorites':
        return 'Saved Favorites';
      case '/history':
        return 'Conversation History';
      case '/settings':
        return 'Settings';
      case '/admin':
        return 'Admin Dashboard';
      default:
        return 'BanglaMate AI';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={() => navigate('/')}
          className="flex md:hidden items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-tight">
            BanglaMate AI
          </span>
        </button>

        <h1 className="hidden md:block text-base font-bold text-slate-800 dark:text-slate-100">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-all"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">সার্চ করুন...</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md font-mono">
            Ctrl K
          </kbd>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="থিম পরিবর্তন"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
};
