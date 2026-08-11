import React, { useState } from 'react';
import { Sparkles, ArrowRight, MessageSquare, PenTool, Languages, GraduationCap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, navigate, updatePreferences } = useApp();
  const [nameInput, setNameInput] = useState('');

  if (!isOnboardingOpen) return null;

  const handleStart = (route: string = '/') => {
    if (nameInput.trim()) {
      updatePreferences({ name: nameInput.trim() });
    }
    localStorage.setItem('banglamate_has_visited', 'true');
    setIsOnboardingOpen(false);
    navigate(route);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Accent Glow */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              BanglaMate AI-তে স্বাগতম
            </h2>
            <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              বাংলায় AI — কথা, লেখা, অনুবাদ ও কাজ এক জায়গায়
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          বাংলাভাষী ব্যবহারকারীদের জন্য তৈরি একটি বিশ্বমানের AI প্ল্যাটফর্ম। আপনি কোনো প্রশ্ন করতে পারেন, কনটেন্ট লিখতে পারেন, অনুবাদ করতে পারেন কিংবা পড়াশোনায় সাহায্য নিতে পারেন।
        </p>

        {/* User Name Entry */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            আপনার নাম (ঐচ্ছিক):
          </label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="যেমন: অনিক বা Anik"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
            আজ আপনি প্রথম কী করতে চান?
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleStart('/chat')}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-left transition-all"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">AI Chat</div>
                <div className="text-[10px] text-slate-500">প্রশ্ন করুন</div>
              </div>
            </button>

            <button
              onClick={() => handleStart('/writing')}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-left transition-all"
            >
              <PenTool className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">AI Writing</div>
                <div className="text-[10px] text-slate-500">পোস্ট বা প্রবন্ধ লিখুন</div>
              </div>
            </button>

            <button
              onClick={() => handleStart('/translation')}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-left transition-all"
            >
              <Languages className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Translation</div>
                <div className="text-[10px] text-slate-500">বাংলা অনুবাদ</div>
              </div>
            </button>

            <button
              onClick={() => handleStart('/study')}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-left transition-all"
            >
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Study Helper</div>
                <div className="text-[10px] text-slate-500">পড়াশোনা ও কুইজ</div>
              </div>
            </button>
          </div>
        </div>

        <button
          onClick={() => handleStart('/')}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
        >
          <span>প্লাটফর্মে প্রবেশ করুন</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
