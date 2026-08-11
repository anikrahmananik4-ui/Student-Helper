import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Briefcase, Sparkles, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateCV } from '../services/apiService';
import { CopyButton } from '../components/common/CopyButton';
import { TextToSpeechButton } from '../components/common/TextToSpeechButton';

export const CVPage: React.FC = () => {
  const { addFavorite, isFavorite } = useApp();

  const [documentType, setDocumentType] = useState<'Cover Letter' | 'CV Summary' | 'Full Resume Outline'>('Cover Letter');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [education, setEducation] = useState('');
  const [language, setLanguage] = useState('English');

  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!jobTitle.trim()) {
      alert('অনুগ্রহ করে পদের নাম বা জব টাইটেল উল্লেখ করুন।');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await generateCV({
        documentType,
        jobTitle,
        companyName,
        experience,
        skills,
        education,
        language,
      });
      setOutput(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'সিভি/কভার লেটার তৈরি করা সম্ভব হয়নি।');
    } finally {
      setIsLoading(false);
    }
  };

  const isFav = isFavorite(output);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-900 text-white space-y-2 shadow-xl border border-emerald-800/40">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
          <Briefcase className="w-4 h-4" />
          <span>AI Career & Resume Builder</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          সিভি, রিজিউমি ও কভার লেটার রাইটার
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          আপনার অভিজ্ঞতা অনুযায়ী ইমপ্যাক্টফুল কভার লেটার ও প্রফেশনাল রিজিউমি সমারি তৈরি করুন।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUT FORM */}
        <div className="lg:col-span-5 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
              ডকুমেন্টের ধরণ
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setDocumentType('Cover Letter')}
                className={`py-2 px-1 text-center text-xs font-bold rounded-xl border transition-all ${
                  documentType === 'Cover Letter'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                কভার লেটার
              </button>
              <button
                onClick={() => setDocumentType('CV Summary')}
                className={`py-2 px-1 text-center text-xs font-bold rounded-xl border transition-all ${
                  documentType === 'CV Summary'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                সিভি সমারি
              </button>
              <button
                onClick={() => setDocumentType('Full Resume Outline')}
                className={`py-2 px-1 text-center text-xs font-bold rounded-xl border transition-all ${
                  documentType === 'Full Resume Outline'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                ফুল সিভি
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                জব টাইটেল / পদের নাম *
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="যেমন: Software Engineer / Marketing Exec..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                কোম্পানির নাম (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="যেমন: Acme Tech Ltd"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              অভিজ্ঞতা ও পূর্ববর্তী কাজ (Years / Key Roles)
            </label>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              rows={2}
              placeholder="যেমন: ৩ বছরের ফ্রন্টএন্ড ডেভেলপার অভিজ্ঞতা, রিয়েক্ট ও টেলউইন্ডে কাজের দক্ষতা..."
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                মূল স্কিলসমূহ (Skills)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="যেমন: JavaScript, UI Design..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                শিক্ষাগত যোগ্যতা
              </label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="যেমন: B.Sc in CSE"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>
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
              <option value="English">English (স্ট্যান্ডার্ড ফরম্যাট)</option>
              <option value="Bengali">বাংলা (Bengali)</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !jobTitle.trim()}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>তৈরি হচ্ছে...</span>
              </>
            ) : (
              <>
                <Briefcase className="w-4 h-4" />
                <span>জেনারেট করুন</span>
              </>
            )}
          </button>
        </div>

        {/* OUTPUT WORKSPACE */}
        <div className="lg:col-span-7 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col space-y-3 min-h-[400px]">
          <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {documentType} আউটপুট
            </span>

            {output && (
              <div className="flex items-center gap-2">
                <CopyButton text={output} />
                <TextToSpeechButton text={output} />
                <button
                  onClick={() => {
                    if (isFav) return;
                    addFavorite({
                      title: `${documentType}: ${jobTitle.slice(0, 20)}`,
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

          <div className="flex-1 overflow-y-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 custom-scrollbar">
            {output ? (
              <div className="prose dark:prose-invert prose-sm max-w-none text-slate-900 dark:text-slate-100 leading-relaxed">
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <Briefcase className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                <div className="text-xs font-medium">এখানে আপনার সিভি/কভার লেটার দেখতে পাবেন</div>
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
