import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, Sparkles, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { summarizeText } from '../services/apiService';
import { CopyButton } from '../components/common/CopyButton';
import { TextToSpeechButton } from '../components/common/TextToSpeechButton';

const SUMMARY_MODES = [
  { id: 'Key Points', labelBn: 'মূল পয়েন্টসমূহ (Key Points)' },
  { id: 'Short summary', labelBn: 'সংক্ষিপ্ত সারসংক্ষেপ (Short)' },
  { id: 'Detailed summary', labelBn: 'বিস্তারিত বিবরণী (Detailed)' },
  { id: 'Bullet summary', labelBn: 'বুলেট তালিকা (Bullets)' },
  { id: 'Action items', labelBn: 'করনীয় কাজ (Action Items)' },
];

export const SummarizePage: React.FC = () => {
  const { addFavorite, isFavorite } = useApp();

  const [inputText, setInputText] = useState('');
  const [selectedMode, setSelectedMode] = useState('Key Points');
  const [summaryOutput, setSummaryOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      alert('অনুগ্রহ করে সংক্ষেপ করার জন্য টেক্সট প্রদান করুন।');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await summarizeText({
        text: inputText,
        mode: selectedMode,
      });
      setSummaryOutput(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'সংক্ষেপ করা সম্ভব হয়নি।');
    } finally {
      setIsLoading(false);
    }
  };

  const isFav = isFavorite(summaryOutput);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-900 text-white space-y-2 shadow-xl border border-emerald-800/40">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
          <FileText className="w-4 h-4" />
          <span>AI Text Summarizer</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          বড় লেখা সহজে সংক্ষেপ করুন
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          যেকোনো আর্টিকেল, রিপোর্ট বা ডকুমেন্টের মূল ভাব ও গুরুত্বপূর্ণ পয়েন্ট বের করুন সেকেন্ডে।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUT FORM */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              ১. আপনার দীর্ঘ টেক্সট পেস্ট করুন
            </label>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={9}
              placeholder="এখানে দীর্ঘ লেখা বা রিপোর্ট পেস্ট করুন..."
              className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 resize-none font-sans"
            />

            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider pt-2">
              ২. সংক্ষেপের ধরণ নির্বাচন করুন
            </label>

            <div className="grid grid-cols-2 gap-2">
              {SUMMARY_MODES.map((mode) => {
                const isSelected = selectedMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={`p-2.5 rounded-xl text-left text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {mode.labelBn}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleSummarize}
              disabled={isLoading || !inputText.trim()}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all mt-2"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>সংক্ষেপ করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>সংক্ষেপ করুন</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* OUTPUT WORKSPACE */}
        <div className="lg:col-span-6 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col space-y-3 min-h-[400px]">
          <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              সারসংক্ষেপ আউটপুট ({selectedMode})
            </span>

            {summaryOutput && (
              <div className="flex items-center gap-2">
                <CopyButton text={summaryOutput} />
                <TextToSpeechButton text={summaryOutput} />
                <button
                  onClick={() => {
                    if (isFav) return;
                    addFavorite({
                      title: `সারসংক্ষেপ: ${inputText.slice(0, 20)}...`,
                      category: 'Writing',
                      content: summaryOutput,
                    });
                  }}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 custom-scrollbar">
            {summaryOutput ? (
              <div className="prose dark:prose-invert prose-sm max-w-none text-slate-900 dark:text-slate-100 leading-relaxed">
                <ReactMarkdown>{summaryOutput}</ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <FileText className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                <div className="text-xs font-medium">এখানে সারসংক্ষেপ পয়েন্ট দেখতে পাবেন</div>
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
