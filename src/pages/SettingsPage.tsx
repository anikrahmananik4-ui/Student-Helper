import React, { useState } from 'react';
import { Sliders, Sun, Moon, Check, Save, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { preferences, updatePreferences, isDarkMode, setIsDarkMode } = useApp();

  const [responseLanguage, setResponseLanguage] = useState(
    preferences.responseLanguage || 'Bengali'
  );
  const [tone, setTone] = useState(preferences.tone || 'Balanced');
  const [formality, setFormality] = useState(preferences.formality || 'Standard');
  const [customInstructions, setCustomInstructions] = useState(
    preferences.customInstructions || ''
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({
      responseLanguage,
      tone,
      formality,
      customInstructions,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('আপনি কি সকল সেটিংস ডিফল্টে রিসেট করতে চান?')) {
      updatePreferences({
        responseLanguage: 'Bengali',
        tone: 'Balanced',
        formality: 'Standard',
        customInstructions: '',
      });
      setResponseLanguage('Bengali');
      setTone('Balanced');
      setFormality('Standard');
      setCustomInstructions('');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-900 text-white space-y-2 shadow-xl border border-teal-800/40">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
          <Sliders className="w-4 h-4" />
          <span>App Customization</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          অ্যাপ ও এআই সেটিংস
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          এআই-এর উত্তর দেওয়ার ভাষা, টোন এবং আপনার নিজস্ব পার্সোনাল পছন্দ সেট করুন।
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* APPEARANCE */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b pb-3 border-slate-100 dark:border-slate-800">
            <span>অ্যাপ থিম ও রঙ</span>
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                ডার্ক মোড (Dark Theme)
              </div>
              <div className="text-xs text-slate-500">
                চোখের আরামের জন্য কালো ও গাঢ় ব্যাকগ্রাউন্ড ব্যবহার করুন।
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold text-xs transition-all ${
                isDarkMode
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-slate-100 text-slate-800 border-slate-300'
              }`}
            >
              {isDarkMode ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>{isDarkMode ? 'ডার্ক মোড এনাবলড' : 'লাইট মোড এনাবলড'}</span>
            </button>
          </div>
        </div>

        {/* AI RESPONSE PREFERENCES */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b pb-3 border-slate-100 dark:border-slate-800">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>AI রেসপন্স প্রেফারেন্স</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ডিফল্ট উত্তরের ভাষা
              </label>
              <select
                value={responseLanguage}
                onChange={(e) => setResponseLanguage(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="Bengali">বাংলা (Bengali)</option>
                <option value="English">English</option>
                <option value="Mixed">বাংলা + English (Banglish / Mixed)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                উত্তরের টোন
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="Balanced">ব্যালেন্সড ও প্রাঞ্জল</option>
                <option value="Creative">ক্রিয়েটিভ ও আকর্ষনীয়</option>
                <option value="Precise">সঠিক ও সংক্ষিপ্ত (Precise)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ফরমালিটি
              </label>
              <select
                value={formality}
                onChange={(e) => setFormality(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="Standard">মানসম্মত ও স্বাভাবিক</option>
                <option value="Formal">অত্যন্ত শালীন ও ফরমাল</option>
                <option value="Casual">অনানুষ্ঠানিক ও ফ্রেন্ডলি</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              কাস্টম নির্দেশিকা (Custom Instructions)
            </label>
            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              rows={4}
              placeholder="যেমন: সব সময় সহজ বাংলায় পয়েন্ট আকারে উত্তর দেবে। আমি একজন বিশ্ববিদ্যালয়ের শিক্ষার্থী..."
              className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 resize-none font-sans"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              এই নির্দেশিকাটি সকল চ্যাট ও লেখার ক্ষেত্রে AI বিবেচনা করবে।
            </p>
          </div>
        </div>

        {/* API ENGINE STATUS */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>AI ইঞ্জিনের তথ্য</span>
          </h2>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center justify-between">
            <span>মডেল: Gemini 2.5 Flash / Flash Lite (Server Proxy)</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px]">Active</span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>রিসেট করুন</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>সেভ হয়েছে!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>সেটিংস সেভ করুন</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
