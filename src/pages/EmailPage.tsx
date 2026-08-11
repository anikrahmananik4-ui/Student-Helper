import React, { useState } from 'react';
import { Mail, Sparkles, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateEmail } from '../services/apiService';
import { CopyButton } from '../components/common/CopyButton';
import { TextToSpeechButton } from '../components/common/TextToSpeechButton';

const EMAIL_TYPES = [
  { id: 'Formal Business', labelBn: 'অফিসিয়াল ও বিজনেস ইমেইল' },
  { id: 'Job Application / Inquiry', labelBn: 'চাকরির আবেদন বা ইমেইল' },
  { id: 'Leave Request', labelBn: 'ছুটির আবেদন (Leave Request)' },
  { id: 'Client Follow-up', labelBn: 'ক্লায়েন্ট ফলো-আপ ইমেইল' },
  { id: 'Apology / Resolution', labelBn: 'দুঃখ প্রকাশ ও ভুল স্বীকার' },
  { id: 'Friendly / Personal', labelBn: 'ব্যক্তিগত বা অনানুষ্ঠানিক ইমেইল' },
];

export const EmailPage: React.FC = () => {
  const { addFavorite, isFavorite } = useApp();

  const [emailType, setEmailType] = useState('Formal Business');
  const [recipient, setRecipient] = useState('');
  const [subjectTopic, setSubjectTopic] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [tone, setTone] = useState('Polite & Professional');
  const [language, setLanguage] = useState('English');

  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!subjectTopic.trim()) {
      alert('অনুগ্রহ করে ইমেইলের মূল বিষয় বা উদ্দেশ্য লিখুন।');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await generateEmail({
        emailType,
        recipient,
        subjectTopic,
        keyPoints,
        tone,
        language,
      });
      setOutput(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'ইমেইল তৈরি করা সম্ভব হয়নি।');
    } finally {
      setIsLoading(false);
    }
  };

  const isFav = isFavorite(output);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-900 text-white space-y-2 shadow-xl border border-teal-800/40">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
          <Mail className="w-4 h-4" />
          <span>AI Email Assistant</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          প্রফেশনাল ইমেইল জেনারেটর
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          অফিসিয়াল, বিজনেস বা পার্সোনাল ইমেইল মুহূর্তেই সুন্দর ও প্রাঞ্জল ভাষায় লিখে ফেলুন।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUT FORM */}
        <div className="lg:col-span-5 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
              ইমেইলের ধরণ
            </label>
            <select
              value={emailType}
              onChange={(e) => setEmailType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              {EMAIL_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.labelBn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              প্রাপক (Recipient / Who are you writing to?)
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="যেমন: Manager / HR / Client / Professor..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              ইমেইলের মূল উদ্দেশ্য বা বিষয় *
            </label>
            <input
              type="text"
              value={subjectTopic}
              onChange={(e) => setSubjectTopic(e.target.value)}
              placeholder="যেমন: ৩ দিনের অসুস্থতাজনিত ছুটির আবেদন..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              জরুরি পয়েন্ট বা মেসেজ (Key details)
            </label>
            <textarea
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              rows={3}
              placeholder="যেমন: আগামী ১২ থেকে ১৪ তারিখ অনুপসিত থাকব, জরুরিতে ফোনে যোগাযোগ করা যাবে..."
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                টোন / স্টাইল
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
              >
                <option value="Polite & Professional">নম্র ও প্রফেশনাল</option>
                <option value="Urgent & Direct">জরুরি ও সোজাসুজি</option>
                <option value="Formal & Respectful">অত্যন্ত ফরমাল</option>
                <option value="Friendly & Warm">বান্ধব ও অমায়িক</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                ইমেইলের ভাষা
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
              >
                <option value="English">English (প্রফেশনাল স্ট্যান্ডার্ড)</option>
                <option value="Bengali">বাংলা (Bengali)</option>
                <option value="Bilingual (Bengali + English)">দ্বিভাষিক (বাংলা + ইংলিশ)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !subjectTopic.trim()}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>ইমেইল লেখা হচ্ছে...</span>
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                <span>ইমেইল তৈরি করুন</span>
              </>
            )}
          </button>
        </div>

        {/* OUTPUT WORKSPACE */}
        <div className="lg:col-span-7 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col space-y-3 min-h-[400px]">
          <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              ইমেইল ড্রাফট
            </span>

            {output && (
              <div className="flex items-center gap-2">
                <CopyButton text={output} />
                <TextToSpeechButton text={output} />
                <button
                  onClick={() => {
                    if (isFav) return;
                    addFavorite({
                      title: `ইমেইল: ${subjectTopic.slice(0, 20)}`,
                      category: 'Writing',
                      content: output,
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
            {output ? (
              <textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                rows={14}
                className="w-full h-full p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-slate-900 dark:text-slate-100 text-sm leading-relaxed focus:outline-hidden resize-none font-sans"
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <Mail className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                <div className="text-xs font-medium">এখানে তৈরি ইমেইল ড্রাফট দেখতে পাবেন</div>
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
