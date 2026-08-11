import React from 'react';
import {
  Home,
  MessageSquare,
  PenTool,
  Languages,
  RefreshCw,
  FileText,
  GraduationCap,
  Share2,
  FileSearch,
  Sparkles,
  Heart,
  History,
  Settings,
  PlusCircle,
  Sun,
  Moon,
  User,
  Mail,
  Briefcase,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const {
    activeRoute,
    navigate,
    createNewChat,
    preferences,
    isDarkMode,
    setIsDarkMode,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useApp();

  const sidebarOpen = isOpen !== undefined ? isOpen : isSidebarOpen;

  const menuItems = [
    { label: 'হোম', icon: Home, route: '/' },
    { label: 'AI Chat Studio', icon: MessageSquare, route: '/chat' },
    { label: 'Writing Studio', icon: PenTool, route: '/writing' },
    { label: 'Email Generator', icon: Mail, route: '/writing/email' },
    { label: 'CV & Cover Letter', icon: Briefcase, route: '/writing/cv' },
    { label: 'Translation Tool', icon: Languages, route: '/translation' },
    { label: 'Rewrite & Improve', icon: RefreshCw, route: '/rewrite' },
    { label: 'Summarizer', icon: FileText, route: '/summarize' },
    { label: 'Study Assistant', icon: GraduationCap, route: '/study' },
    { label: 'Social Media Posts', icon: Share2, route: '/social' },
    { label: 'Prompt Library', icon: Sparkles, route: '/prompts' },
    { label: 'Saved Favorites', icon: Heart, route: '/favorites' },
    { label: 'History & Logs', icon: History, route: '/history' },
    { label: 'Settings', icon: Settings, route: '/settings' },
  ];

  const handleNav = (route: string) => {
    navigate(route);
    setIsSidebarOpen(false);
    if (onCloseMobile) onCloseMobile();
  };

  const handleNewChat = () => {
    createNewChat();
    handleNav('/chat');
  };

  return (
    <aside
      className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-50 dark:bg-slate-900/95 border-r border-slate-200 dark:border-slate-800/80 flex flex-col transition-transform duration-200 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => handleNav('/')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-base text-slate-900 dark:text-slate-100 tracking-tight leading-none">
              BanglaMate AI
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              বাংলায় AI প্ল্যাটফর্ম
            </div>
          </div>
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={handleNewChat}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:shadow-lg hover:shadow-emerald-600/30"
        >
          <PlusCircle className="w-4 h-4" />
          <span>নতুন Chat শুরু করুন</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeRoute === item.route;
          return (
            <button
              key={item.route}
              onClick={() => handleNav(item.route)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 font-bold border border-emerald-300 dark:border-emerald-800'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer / User & Theme */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-200 dark:bg-emerald-900 flex items-center justify-center text-emerald-800 dark:text-emerald-200 font-bold text-xs shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {preferences.name || 'গেস্ট ব্যবহারকারী'}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                গেমিনি এআই চালিত
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="থিম পরিবর্তন"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
