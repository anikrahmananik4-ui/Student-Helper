import React, { useState } from 'react';
import { Search, X, MessageSquare, PenTool, Sparkles, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QUICK_TOOLS } from '../../data/toolsData';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, navigate, conversations, favorites } = useApp();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const filteredTools = QUICK_TOOLS.filter(
    (t) =>
      t.titleBn.toLowerCase().includes(query.toLowerCase()) ||
      t.titleEn.toLowerCase().includes(query.toLowerCase()) ||
      t.descBn.toLowerCase().includes(query.toLowerCase())
  );

  const filteredChats = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.messages.some((m) => m.content.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredFavorites = favorites.filter(
    (f) =>
      f.title.toLowerCase().includes(query.toLowerCase()) ||
      f.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="বাংলায় অনুসন্ধান করুন (যেমন: পোস্ট, অনুবাদ, কুইজ, কভার লেটার)..."
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden text-base font-medium"
            autoFocus
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-6">
          {/* Quick Tools */}
          {filteredTools.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>টুলস & ফিচারস ({filteredTools.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigate(tool.route);
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl text-left border border-slate-100 dark:border-slate-800/80 hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all"
                  >
                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      <PenTool className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {tool.titleBn}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                        {tool.descBn}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat History */}
          {filteredChats.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>পুরোনো কথোপকথন ({filteredChats.length})</span>
              </h3>
              <div className="space-y-1.5">
                {filteredChats.slice(0, 5).map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigate('/chat');
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                        {chat.title}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0 ml-2">
                      {chat.messages.length} বার্তা
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Saved Favorites */}
          {filteredFavorites.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                <span>সেভ করা লেখা ({filteredFavorites.length})</span>
              </h3>
              <div className="space-y-1.5">
                {filteredFavorites.slice(0, 4).map((fav) => (
                  <button
                    key={fav.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigate('/favorites');
                    }}
                    className="w-full p-2.5 rounded-xl text-left bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 hover:border-amber-400 transition-all"
                  >
                    <div className="text-xs font-bold text-amber-800 dark:text-amber-300">
                      {fav.title} ({fav.category})
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {fav.content}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredTools.length === 0 &&
            filteredChats.length === 0 &&
            filteredFavorites.length === 0 && (
              <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                কোনো ফলাফল পাওয়া যায়নি। অন্য কিছু লিখে চেষ্টা করুন।
              </div>
            )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 flex justify-between items-center">
          <span>দ্রুত সার্চ করতে <b>Ctrl + K</b> চাপুন</span>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="hover:text-slate-600 dark:hover:text-slate-200"
          >
            বন্ধ করুন (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
