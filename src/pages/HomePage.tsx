import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  MessageSquare,
  PenTool,
  Languages,
  RefreshCw,
  FileText,
  GraduationCap,
  Share2,
  FileSearch,
  ChevronRight,
  Heart,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QUICK_TOOLS } from '../data/toolsData';

export const HomePage: React.FC = () => {
  const { navigate, createNewChat, conversations, favorites } = useApp();
  const [heroPrompt, setHeroPrompt] = useState('');

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroPrompt.trim()) return;
    createNewChat('General', heroPrompt.trim());
    navigate('/chat');
  };

  const getToolIcon = (name: string) => {
    switch (name) {
      case 'MessageSquare':
        return MessageSquare;
      case 'PenTool':
        return PenTool;
      case 'Languages':
        return Languages;
      case 'RefreshCw':
        return RefreshCw;
      case 'FileText':
        return FileText;
      case 'GraduationCap':
        return GraduationCap;
      case 'Share2':
        return Share2;
      case 'FileSearch':
        return FileSearch;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12 animate-in fade-in duration-300">
      {/* HERO SECTION */}
      <section className="relative rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl border border-emerald-800/40">
        {/* Decorative Background Accents */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>বাংলাভাষীদের নিজস্ব AI অ্যাসিস্ট্যান্ট</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            আপনি কী করতে চান?
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            বাংলায় AI ব্যবহার করে লিখুন, অনুবাদ করুন, শিখুন এবং আপনার দৈনন্দিন কাজ সহজ করুন।
          </p>

          {/* LARGE HERO INPUT FORM */}
          <form onSubmit={handleHeroSubmit} className="pt-2">
            <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl focus-within:border-emerald-400 transition-all">
              <input
                type="text"
                value={heroPrompt}
                onChange={(e) => setHeroPrompt(e.target.value)}
                placeholder="আপনার প্রশ্ন বা কাজ লিখুন (যেমন: ফেসবুক পোস্ট লিখে দাও, অনুবাদ করো)..."
                className="w-full px-4 py-3 bg-transparent text-white placeholder-slate-400 text-sm sm:text-base focus:outline-hidden font-medium"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shrink-0 shadow-lg transition-all"
              >
                <span>AI দিয়ে শুরু করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Action Shortcut Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-medium text-slate-300">
            <span className="text-slate-400">দ্রুত শুরু করুন:</span>
            <button
              onClick={() => navigate('/chat')}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/10 flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Chat</span>
            </button>

            <button
              onClick={() => navigate('/writing')}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/10 flex items-center gap-1.5"
            >
              <PenTool className="w-3.5 h-3.5 text-emerald-400" />
              <span>Write</span>
            </button>

            <button
              onClick={() => navigate('/translation')}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/10 flex items-center gap-1.5"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-400" />
              <span>Translate</span>
            </button>
          </div>
        </div>
      </section>

      {/* QUICK ACTION CARDS GRID */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              জনপ্রিয় AI ফিচারসমূহ
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              আপনার প্রয়োজনীয় টুলটি নির্বাচন করুন
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_TOOLS.slice(0, 8).map((tool) => {
            const Icon = getToolIcon(tool.iconName);
            return (
              <button
                key={tool.id}
                onClick={() => navigate(tool.route)}
                className="group relative p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 text-left transition-all duration-200 flex flex-col justify-between"
              >
                {tool.badge && (
                  <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                    {tool.badge}
                  </span>
                )}

                <div>
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {tool.titleBn}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {tool.descBn}
                  </p>
                </div>

                <div className="mt-4 flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>ব্যবহার করুন</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* RECENT CHATS & FAVORITES OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Chats */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                সাম্প্রতিক কথোপকথন
              </h3>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              সব দেখুন
            </button>
          </div>

          {conversations.length > 0 ? (
            <div className="space-y-2">
              {conversations.slice(0, 4).map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => navigate('/chat')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-100 dark:border-slate-800 text-left transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                      {chat.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                    {new Date(chat.updatedAt).toLocaleDateString('bn-BD')}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              এখনও কোনো কথোপকথন শুরু হয়নি।
            </div>
          )}
        </div>

        {/* Saved Favorites */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                প্রিয় ও সেভ করা আউটপুট
              </h3>
            </div>
            <button
              onClick={() => navigate('/favorites')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              সব দেখুন
            </button>
          </div>

          {favorites.length > 0 ? (
            <div className="space-y-2">
              {favorites.slice(0, 4).map((fav) => (
                <div
                  key={fav.id}
                  onClick={() => navigate('/favorites')}
                  className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 cursor-pointer hover:border-amber-400 transition-all"
                >
                  <div className="text-xs font-bold text-amber-900 dark:text-amber-300 flex justify-between">
                    <span>{fav.title}</span>
                    <span className="text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-1.5 py-0.5 rounded-sm">
                      {fav.category}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-1">
                    {fav.content}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              আপনার প্রিয় কোনো লেখা সেভ করা নেই।
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
