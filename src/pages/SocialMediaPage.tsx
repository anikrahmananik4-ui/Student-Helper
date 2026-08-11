import React, { useState } from 'react';
import { Share2, Sparkles, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateSocial } from '../services/apiService';
import { CopyButton } from '../components/common/CopyButton';
import { TextToSpeechButton } from '../components/common/TextToSpeechButton';

const PLATFORMS = [
  { id: 'Facebook', nameBn: 'Facebook Caption' },
  { id: 'Instagram', nameBn: 'Instagram Post & Hashtags' },
  { id: 'TikTok', nameBn: 'TikTok Script & Caption' },
  { id: 'YouTube', nameBn: 'YouTube Title & Description' },
];

export const SocialMediaPage: React.FC = () => {
  const { addFavorite, isFavorite } = useApp();

  const [platform, setPlatform] = useState('Facebook');
  const [topic, setTopic] = useState('');
  const [mood, setMood] = useState('Engaging & Friendly');
  const [audience, setAudience] = useState('');
  const [language, setLanguage] = useState('Bengali');

  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert('অনুগ্রহ করে সোশ্যাল পোস্টের বিষয় বা পোস্টের উদ্দেশ্য উল্লেখ করুন।');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await generateSocial({
        platform,
        topic,
        mood,
        audience,
        language,
      });
      setOutput(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'ক্যাপশন তৈরি করা সম্ভব হয়নি।');
    } finally {
      setIsLoading(false);
    }
  };

  const isFav = isFavorite(output);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 text-white space-y-2 shadow-xl border border-teal-800/40">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
          <Share2 className="w-4 h-4" />
          <span>Social Media Assistant</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          সোশ্যাল মিডিয়া ক্যাপশন ও পোস্ট রাইটার
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          ফেসবুক, ইনস্টাগ্রাম, টিকটক ও ইউটিউবের জন্য আকর্ষনীয় ক্যাপশন, হ্যাশট্যাগ ও সিটিএ তৈরি করুন।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUT FORM */}
        <div className="lg:col-span-5 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            ১. প্ল্যাটফর্ম নির্বাচন করুন
          </label>

          <div className="grid grid-cols-2 gap-2">
            {PLATFORMS.map((p) => {
              const isSelected = platform === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`p-2.5 rounded-xl text-left text-xs font-bold border transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {p.nameBn}
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              পোস্টের বিষয় বা ছবি/ভিডিওর ডিটেইলস *
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={3}
              placeholder="যেমন: বৃষ্টির দিনে এক কাপ লাল চা ও গান শোনাক ছবি..."
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 resize-none font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                মুড / Vibe
              </label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
              >
                <option value="Engaging & Friendly">আকর্ষণীয় ও ফ্রেন্ডলি</option>
                <option value="Funny & Humorous">মজার ও হাস্যরসাত্মক</option>
                <option value="Emotional & Deep">আবেগঘন ও গভীর</option>
                <option value="Promotional & Sales">প্রোমোশনাল / পণ্য প্রচার</option>
                <option value="Educational & Informative">শিক্ষণীয় ও ইনফরমেটিভ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                ভাষা
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
              >
                <option value="Bengali">বাংলা (Bengali)</option>
                <option value="English">English</option>
                <option value="Banglish">Banglish</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>ক্যাপশন তৈরি হচ্ছে...</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>ক্যাপশন জেনারেট করুন</span>
              </>
            )}
          </button>
        </div>

        {/* OUTPUT WORKSPACE */}
        <div className="lg:col-span-7 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col space-y-3 min-h-[400px]">
          <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              সোশ্যাল মিডিয়া রেজাল্ট ({platform})
            </span>

            {output && (
              <div className="flex items-center gap-2">
                <CopyButton text={output} />
                <TextToSpeechButton text={output} />
                <button
                  onClick={() => {
                    if (isFav) return;
                    addFavorite({
                      title: `ক্যাপশন: ${topic.slice(0, 20)}...`,
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
                rows={12}
                className="w-full h-full p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-slate-900 dark:text-slate-100 text-sm leading-relaxed focus:outline-hidden resize-none font-sans"
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <Share2 className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                <div className="text-xs font-medium">এখানে তৈরি হওয়া সোশ্যাল ক্যাপশন দেখাবে</div>
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
