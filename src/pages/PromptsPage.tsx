import React, { useState } from 'react';
import { Lightbulb, Search, Copy, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PROMPT_CATEGORIES, PROMPT_TEMPLATES } from '../data/promptsData';
import { CopyButton } from '../components/common/CopyButton';

export const PromptsPage: React.FC = () => {
  const { navigate, createNewChat } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrompts = PROMPT_TEMPLATES.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.promptText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.descBn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleUsePrompt = (promptText: string) => {
    createNewChat('General', promptText);
    navigate('/chat');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white space-y-2 shadow-xl border border-emerald-800/40">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
          <Lightbulb className="w-4 h-4" />
          <span>Curated AI Prompts Library</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          রেডিমেড প্রম্পট লাইব্রেরি
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          লেখাপড়া, কন্টেন্ট তৈরি, সোশ্যাল মিডিয়া, কোডিং এবং ব্যবসার জন্য সেরা প্রম্পটগুলো এক ক্লিকে ব্যবহার করুন।
        </p>
      </div>

      {/* SEARCH AND CATEGORY FILTER TOOLBAR */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-xs">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="প্রম্পট খুঁজুন (যেমন: কভার লেটার, ফেসবুক পোস্ট, পাইথন, সামারি)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Category Pill Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>ক্যাটাগরি:</span>
          </span>

          {PROMPT_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat.nameBn}
              </button>
            );
          })}
        </div>
      </div>

      {/* PROMPTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrompts.map((item) => (
          <div
            key={item.id}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-lg transition-all duration-200 space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                  {item.category}
                </span>
                <CopyButton text={item.promptText} label="" />
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                {item.titleBn}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {item.descBn}
              </p>

              {/* Prompt Box Preview */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 font-mono line-clamp-4 leading-relaxed">
                {item.promptText}
              </div>
            </div>

            <button
              onClick={() => handleUsePrompt(item.promptText)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <span>AI Chat-এ এটি রান করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="py-12 text-center text-slate-400 text-sm bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          কোনো প্রম্পট পাওয়া যায়নি। অনুসন্ধানের বানান মিলিয়ে দেখুন।
        </div>
      )}
    </div>
  );
};
