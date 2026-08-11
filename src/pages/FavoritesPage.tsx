import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Heart, Trash2, Copy, Bookmark, MessageSquare, PenTool, Languages } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CopyButton } from '../components/common/CopyButton';
import { TextToSpeechButton } from '../components/common/TextToSpeechButton';

export const FavoritesPage: React.FC = () => {
  const { favorites, removeFavorite } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-900 via-slate-900 to-emerald-950 text-white space-y-2 shadow-xl border border-amber-800/40">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
          <Heart className="w-4 h-4 fill-amber-400" />
          <span>Saved Favorites Collection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          সেভড ও প্রিয় আউটপুটসমূহ
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          আপনার পছন্দ অনুযায়ী পছন্দসই লেখা, উত্তর ও অনুবাদ এক নজরে রিভিউ করুন বা কপি করুন।
        </p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between space-y-3 shadow-xs hover:border-amber-400/50 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(item.timestamp).toLocaleDateString('bn-BD')}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {item.title}
                </h3>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-800 dark:text-slate-200 max-h-48 overflow-y-auto custom-scrollbar leading-relaxed">
                  <ReactMarkdown>{item.content}</ReactMarkdown>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <CopyButton text={item.content} />
                  <TextToSpeechButton text={item.content} />
                </div>

                <button
                  onClick={() => removeFavorite(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors text-xs flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>মুছে ফেলুন</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-slate-400 space-y-3 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <Bookmark className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
          <div className="font-bold text-slate-700 dark:text-slate-300 text-sm">
            আপনার কোনো সেভ করা লেখা নেই।
          </div>
          <p className="text-xs max-w-sm mx-auto">
            চ্যাট, রাইটিং বা অনুবাদ টুল ব্যবহারের সময় পছন্দসই উত্তরের পাশে <b>"সেভ করুন"</b> বাটনে ক্লিক করুন।
          </p>
        </div>
      )}
    </div>
  );
};
