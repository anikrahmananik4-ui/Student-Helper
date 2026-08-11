import React, { useState } from 'react';
import {
  Languages,
  ArrowRightLeft,
  Sparkles,
  RefreshCw,
  Sliders,
  Heart,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translateText } from '../services/apiService';
import { CopyButton } from '../components/common/CopyButton';
import { TextToSpeechButton } from '../components/common/TextToSpeechButton';
import { VoiceInputButton } from '../components/common/VoiceInputButton';

const SUPPORTED_LANGUAGES = [
  'Bengali (বাংলা)',
  'English',
  'Arabic (العربية)',
  'Hindi (हिंदी)',
  'Urdu (اردو)',
  'Spanish (Español)',
  'French (Français)',
  'German (Deutsch)',
  'Chinese (中文)',
  'Japanese (日本語)',
  'Korean (한국어)',
  'Italian (Italiano)',
  'Portuguese (Português)',
  'Russian (Русский)',
];

export const TranslationPage: React.FC = () => {
  const { addFavorite, isFavorite } = useApp();

  const [sourceLang, setSourceLang] = useState('Auto Detect');
  const [targetLang, setTargetLang] = useState('Bengali (বাংলা)');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [formality, setFormality] = useState('Natural');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      alert('অনুগ্রহ করে অনুবাদ করার জন্য টেক্সট লিখুন।');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await translateText({
        text: inputText,
        sourceLang,
        targetLang,
        formality,
      });
      setTranslatedText(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'অনুবাদ করা সম্ভব হয়নি।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = () => {
    if (sourceLang === 'Auto Detect') {
      setSourceLang(targetLang);
      setTargetLang('English');
    } else {
      const temp = sourceLang;
      setSourceLang(targetLang);
      setTargetLang(temp);
    }
    const tempText = inputText;
    setInputText(translatedText);
    setTranslatedText(tempText);
  };

  const isFav = isFavorite(translatedText);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-slate-900 to-teal-950 text-white space-y-2 shadow-xl border border-blue-800/40">
        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
          <Languages className="w-4 h-4" />
          <span>Professional Translation Studio</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          নিখুঁত ও প্রাঞ্জল অনুবাদক
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          বাংলা, ইংরেজি সহ ১৪+ ভাষায় প্রাকৃতিক ও সঠিক অনুবাদ পান চোখের নিমেষে।
        </p>
      </div>

      {/* LANGUAGE SELECTOR TOOLBAR */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              উৎস ভাষা (SOURCE)
            </label>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <option value="Auto Detect">স্বয়ংক্রিয় শনাক্তকরণ (Auto Detect)</option>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-center sm:hidden py-1">
            <button
              onClick={handleSwap}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              লক্ষ্য ভাষা (TARGET)
            </label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-emerald-600 dark:text-emerald-400"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleSwap}
          className="hidden sm:flex p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 hover:text-emerald-600 transition-colors"
          title="ভাষা পরিবর্তন করুন"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>
      </div>

      {/* TRANSLATION BOXES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Box */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              মূল টেক্সট
            </span>
            <VoiceInputButton
              onTranscript={(text) => setInputText((prev) => (prev ? prev + ' ' + text : text))}
            />
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={10}
            placeholder="এখানে অনুবাদ করতে চাওয়া টেক্সট লিখুন বা পেস্ট করুন..."
            className="w-full flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 resize-none font-sans"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">{inputText.length} অক্ষর</span>
            <button
              onClick={handleTranslate}
              disabled={isLoading || !inputText.trim()}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>অনুবাদ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Languages className="w-4 h-4" />
                  <span>অনুবাদ করুন</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Box */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              অনূদিত টেক্সট ({targetLang})
            </span>

            {translatedText && (
              <div className="flex items-center gap-2">
                <CopyButton text={translatedText} />
                <TextToSpeechButton text={translatedText} />
                <button
                  onClick={() => {
                    if (isFav) return;
                    addFavorite({
                      title: `অনুবাদ: ${inputText.slice(0, 20)}...`,
                      category: 'Translation',
                      content: translatedText,
                    });
                  }}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 min-h-[220px]">
            {translatedText ? (
              <textarea
                value={translatedText}
                onChange={(e) => setTranslatedText(e.target.value)}
                rows={10}
                className="w-full h-full p-3 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 text-slate-900 dark:text-slate-100 text-sm leading-relaxed focus:outline-hidden resize-none font-sans"
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <Languages className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                <div className="text-xs font-medium">এখানে ফলাফল দেখতে পাবেন</div>
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
