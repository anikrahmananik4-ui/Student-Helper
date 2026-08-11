import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-6 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            BanglaMate AI
          </span>
          <span>—</span>
          <span>"বাংলায় AI — কথা, লেখা, অনুবাদ ও কাজ এক জায়গায়"</span>
        </div>

        <div className="flex items-center gap-1 font-medium">
          <span>BanglaMate AI — Owned by </span>
          <span className="text-slate-900 dark:text-slate-100 font-bold">
            Sahadatur Rahman Anik
          </span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline ml-1" />
        </div>
      </div>
    </footer>
  );
};
