import React, { useState } from 'react';
import {
  PenTool,
  Sparkles,
  RotateCcw,
  Heart,
  Mail,
  Briefcase,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WRITING_CATEGORIES } from '../data/toolsData';
import { generateWriting } from '../services/apiService';
import { CopyButton } from '../components/common/CopyButton';
import { TextToSpeechButton } from '../components/common/TextToSpeechButton';

export const WritingPage: React.FC = () => {
  const { navigate, addFavorite, isFavorite } = useApp();

  const [selectedType, setSelectedType] = useState('Facebook Post');
  const [topic, setTopic] = useState('');
  const [keyInfo, setKeyInfo] = useState('');
  const [audience, setAudience] = useState('');
  const [language, setLanguage] = useState('Bengali');
  const [style, setStyle] = useState('Professional');
  const [length, setLength] = useState('Medium');

  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async (customGoal?: string) => {
    if (!topic.trim()) {
      alert('অনুগ্রহ করে লেখার বিষয় বা টপিক উল্লেখ করুন।');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const payloadTopic = customGoal ? `${topic} (লক্ষ্য: ${customGoal})` : topic;
      const resText = await generateWriting({
        type: selectedType,
        topic: payloadTopic,
        keyInfo,
        audience,
        language,
        style,
        length,
      });
      setOutput(resText);
    } catch (err: any) {
      setErrorMsg(err.message || 'লেখা তৈরি করা সম্ভব হয়নি।');
    } finally {
      setIsLoading(false);
    }
  };

  const isFav = isFavorite(output);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl border border-emerald-700/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
            <PenTool className="w-4 h-4" />
            <span>AI Writing Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            প্রফেশনাল রাইটিং স্টুডিও
          </h1>
          <p className="text-xs sm:text-sm text-slate-200">
            পোস্ট, ইমেইল, আর্টিকেল, আবেদনপত্র কিংবা ক্রিয়েটিভ কনটেন্ট লিখুন সহজেই।
          </p>
        </div>

        {/* Quick Specialized Links */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/writing/email')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 border border-white/20 transition-all"
          >
            <Mail className="w-4 h-4 text-emerald-300" />
            <span>ইমেইল রাইটার</span>
          </button>
          <button
            onClick={() => navigate('/writing/cv')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 border border-white/20 transition-all"
          >
            <Briefcase className="w-4 h-4 text-emerald-300" />
            <span>সিভি রাইটার</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: CATEGORIES & INPUT FORM */}
        <div className="lg:col-span-5 space-y-6">
          {/* Writing Category Selector */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              ১. লেখার ধরণ নির্বাচন করুন
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
              {WRITING_CATEGORIES.map((cat) => {
                const isSelected = selectedType === cat.titleBn;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedType(cat.titleBn)}
                    className={`p-2.5 rounded-xl text-left border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="truncate">{cat.titleBn}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Inputs */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              ২. বিষয় ও বিস্তারিত তথ্য
            </label>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                বিষয় বা টপিক *
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="যেমন: নতুন আইফোন রিভিউ / কফি শপের প্রচার..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                জরুরি তথ্য বা পয়েন্টসমূহ (ঐচ্ছিক)
              </label>
              <textarea
                value={keyInfo}
                onChange={(e) => setKeyInfo(e.target.value)}
                rows={2}
                placeholder="যেমন: ৫০% ছাড়, সময়সীমা ১৫ আগস্ট, ফ্রি ডেলিভারি..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            {/* Options grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  ভাষা
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium"
                >
                  <option value="Bengali">বাংলা (Bengali)</option>
                  <option value="English">English</option>
                  <option value="Mixed Bangla-English">বাংলা + English</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  স্টাইল / টোন
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium"
                >
                  <option value="Professional">প্রফেশনাল</option>
                  <option value="Friendly">বান্ধব / ফ্রেন্ডলি</option>
                  <option value="Formal">ফরমাল</option>
                  <option value="Casual">ক্যাজুয়াল</option>
                  <option value="Creative">ক্রিয়েটিভ</option>
                  <option value="Persuasive">আকর্ষণীয়</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  দৈর্ঘ্য
                </label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium"
                >
                  <option value="Short">সংক্ষিপ্ত (Short)</option>
                  <option value="Medium">মাঝারি (Medium)</option>
                  <option value="Long">বিস্তারিত (Long)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  টার্গেট অডিয়েন্স
                </label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="যেমন: তরুণ প্রজন্ম"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <button
              onClick={() => handleGenerate()}
              disabled={isLoading || !topic.trim()}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>AI তৈরি করছে...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>AI দিয়ে লিখুন</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: GENERATED OUTPUT EDITOR */}
        <div className="lg:col-span-7 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden min-h-[450px]">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                আউটপুট ওয়ার্কস্পেস ({selectedType})
              </h3>
            </div>

            {output && (
              <div className="flex items-center gap-2">
                <CopyButton text={output} />
                <TextToSpeechButton text={output} />
                <button
                  onClick={() => {
                    if (isFav) return;
                    addFavorite({
                      title: `${selectedType}: ${topic.slice(0, 20)}`,
                      category: 'Writing',
                      content: output,
                    });
                  }}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    isFav
                      ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
                  <span>{isFav ? 'সেভড' : 'সেভ'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 p-5 flex flex-col space-y-4">
            {output ? (
              <>
                <textarea
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                  rows={14}
                  className="w-full flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-sans custom-scrollbar"
                />

                {/* Quick Post-processing actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-400 font-medium mr-1">আউটপুট টিউন করুন:</span>
                  <button
                    onClick={() => handleGenerate('আরও প্রফেশনাল ও মার্জিত করে দাও')}
                    disabled={isLoading}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    আরেকটু প্রফেশনাল
                  </button>
                  <button
                    onClick={() => handleGenerate('সংক্ষিপ্ত ও পয়েন্ট আকারে ছোট করে দাও')}
                    disabled={isLoading}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    ছোট করুন
                  </button>
                  <button
                    onClick={() => handleGenerate('আরও বিস্তারিত তথ্য ও উদাহরণ যুক্ত করে বড় করো')}
                    disabled={isLoading}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    বড় করুন
                  </button>
                  <button
                    onClick={() => handleGenerate()}
                    disabled={isLoading}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>পুনরায় জেনারেট</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <PenTool className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                <div className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                  আপনার লেখা এখানে দেখতে পাবেন
                </div>
                <p className="text-xs max-w-sm">
                  বামপাশে বিষয় ও প্রয়োজনীয় অপশন পূরণ করে <b>"AI দিয়ে লিখুন"</b> বাটনে ক্লিক করুন।
                </p>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium">
                {errorMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
