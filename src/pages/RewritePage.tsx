import React, { useState } from 'react';
import { RefreshCw, Sparkles, Sliders, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { rewriteText } from '../services/apiService';
import { CopyButton } from '../components/common/CopyButton';
import { TextToSpeechButton } from '../components/common/TextToSpeechButton';

const REWRITE_STYLES = [
  { id: 'Professional', labelBn: 'প্রফেশনাল ও মার্জিত' },
  { id: 'Simple', labelBn: 'সহজ বাংলা (Simple)' },
  { id: 'Shorter', labelBn: 'সংক্ষিপ্তকরণ (Shorter)' },
  { id: 'Longer', labelBn: 'বিস্তারিতকরণ (Longer)' },
  { id: 'Friendly', labelBn: 'বান্ধব / ফ্রেন্ডলি' },
  { id: 'Formal', labelBn: 'ফরমাল' },
  { id: 'Creative', labelBn: 'ক্রিয়েটিভ ও আকর্ষনীয়' },
  { id: 'Grammar', labelBn: 'বানান ও ব্যাকরণ সংশোধন' },
];

export const RewritePage: React.FC = () => {
  const { addFavorite, isFavorite } = useApp();

  const [inputText, setInputText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Professional');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRewrite = async () => {
    if (!inputText.trim()) {
      alert('অনুগ্রহ করে পুনর্লিখনের জন্য টেক্সট প্রদান করুন।');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await rewriteText({
        text: inputText,
        style: selectedStyle,
        goal: selectedStyle,
      });
      setOutputText(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'পুনর্লিখন করা সম্ভব হয়নি।');
    } finally {
      setIsLoading(false);
    }
  };

  const isFav = isFavorite(outputText);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 text-white space-y-2 shadow-xl border border-teal-800/40">
        <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
          <RefreshCw className="w-4 h-4" />
          <span>Content Rewrite Studio</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          লেখা রিরাইট ও উন্নত করুন
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          আপনার যেকোনো লেখার মান, শব্দচয়ন ও বানান সুন্দর করুন মূল অর্থ অপরিবর্তিত রেখে।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUT & STYLES */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              ১. আপনার অরিজিনাল টেক্সট দিন
            </label>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={8}
              placeholder="এখানে আপনার টেক্সট পেস্ট করুন..."
              className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 resize-none font-sans"
            />

            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider pt-2">
              ২. রিরাইট স্টাইল নির্বাচন করুন
            </label>

            <div className="grid grid-cols-2 gap-2">
              {REWRITE_STYLES.map((style) => {
                const isSelected = selectedStyle === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-2.5 rounded-xl text-left text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {style.labelBn}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleRewrite}
              disabled={isLoading || !inputText.trim()}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all mt-2"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>রিরাইট হচ্ছে...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Rewrite করুন</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* OUTPUT WORKSPACE */}
        <div className="lg:col-span-6 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col space-y-3 min-h-[400px]">
          <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              পুনর্লিখিত আউটপুট ({selectedStyle})
            </span>

            {outputText && (
              <div className="flex items-center gap-2">
                <CopyButton text={outputText} />
                <TextToSpeechButton text={outputText} />
                <button
                  onClick={() => {
                    if (isFav) return;
                    addFavorite({
                      title: `রিরাইট: ${inputText.slice(0, 20)}...`,
                      category: 'Writing',
                      content: outputText,
                    });
                  }}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>
            )}
          </div>

          <div className="flex-1">
            {outputText ? (
              <textarea
                value={outputText}
                onChange={(e) => setOutputText(e.target.value)}
                rows={12}
                className="w-full h-full p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-slate-900 dark:text-slate-100 text-sm leading-relaxed focus:outline-hidden resize-none font-sans"
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <RefreshCw className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                <div className="text-xs font-medium">এখানে রিরাইট করা নতুন সংস্করণ দেখাবে</div>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium">
              {errorMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
