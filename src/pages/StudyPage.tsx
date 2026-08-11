import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  GraduationCap,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  Award,
} from 'lucide-react';
import { STUDY_LEVELS, STUDY_SUBJECTS } from '../data/studyData';
import { studyAssist, generateQuiz } from '../services/apiService';
import { QuizQuestion } from '../types';
import { CopyButton } from '../components/common/CopyButton';
import { TextToSpeechButton } from '../components/common/TextToSpeechButton';

export const StudyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tutor' | 'quiz'>('tutor');

  // Study Tutor State
  const [level, setLevel] = useState('HSC');
  const [subject, setSubject] = useState('physics');
  const [topic, setTopic] = useState('');
  const [details, setDetails] = useState('');
  const [action, setAction] = useState<'explain' | 'notes' | 'flashcards'>('explain');
  const [tutorOutput, setTutorOutput] = useState('');
  const [isTutorLoading, setIsTutorLoading] = useState(false);

  // Quiz State
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRunTutor = async () => {
    if (!topic.trim()) {
      alert('অনুগ্রহ করে পড়ার বিষয় বা টপিক উল্লেখ করুন।');
      return;
    }

    setIsTutorLoading(true);
    setErrorMsg(null);

    try {
      const selectedSubName = STUDY_SUBJECTS.find((s) => s.id === subject)?.nameBn || subject;
      const res = await studyAssist({
        action,
        subject: selectedSubName,
        level,
        topic,
        details,
      });
      setTutorOutput(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'উত্তর তৈরি করা সম্ভব হয়নি।');
    } finally {
      setIsTutorLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      alert('অনুগ্রহ করে কুইজের বিষয় বা টপিক উল্লেখ করুন।');
      return;
    }

    setIsQuizLoading(true);
    setShowResults(false);
    setUserAnswers([]);
    setErrorMsg(null);

    try {
      const selectedSubName = STUDY_SUBJECTS.find((s) => s.id === subject)?.nameBn || subject;
      const questions = await generateQuiz({
        subject: selectedSubName,
        topic,
        level,
        questionCount: 5,
      });
      setQuizQuestions(questions);
    } catch (err: any) {
      setErrorMsg(err.message || 'কুইজ তৈরি করা সম্ভব হয়নি।');
    } finally {
      setIsQuizLoading(false);
    }
  };

  const handleAnswerSelect = (qIndex: number, optionIndex: number) => {
    if (showResults) return;
    const updated = [...userAnswers];
    updated[qIndex] = optionIndex;
    setUserAnswers(updated);
  };

  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 text-white space-y-2 shadow-xl border border-teal-800/40">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
          <GraduationCap className="w-4 h-4" />
          <span>BanglaMate AI Study Assistant</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          পড়াশোনা ও এআই কুইজ অ্যাসিস্ট্যান্ট
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          কঠিন কনসেপ্ট সহজে শিখুন, রিভিশন নোটস বানান এবং সরাসরি AI দিয়ে কুইজ তৈরি করে পরীক্ষা দিন।
        </p>
      </div>

      {/* TABS HEADER */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('tutor')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'tutor'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>পড়া বুঝুন ও নোটস বানান</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'quiz'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>AI কুইজ জেনারেটর (MCQ)</span>
        </button>
      </div>

      {/* COMMON FILTERS BAR */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            শিক্ষার স্তর
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            {STUDY_LEVELS.map((lvl) => (
              <option key={lvl.id} value={lvl.id}>
                {lvl.nameBn}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            বিষয় (Subject)
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            {STUDY_SUBJECTS.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.nameBn}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            টপিক বা অধ্যায় *
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="যেমন: নিউটনের গতিসূত্র / সালোকসংশ্লেষণ..."
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* TAB 1: STUDY TUTOR */}
      {activeTab === 'tutor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              অ্যাকশন নির্বাচন করুন
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setAction('explain')}
                className={`p-2.5 rounded-xl text-center text-xs font-bold border transition-all ${
                  action === 'explain'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                বিষয় ব্যাখ্যা
              </button>
              <button
                onClick={() => setAction('notes')}
                className={`p-2.5 rounded-xl text-center text-xs font-bold border transition-all ${
                  action === 'notes'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                নোটস তৈরি
              </button>
              <button
                onClick={() => setAction('flashcards')}
                className={`p-2.5 rounded-xl text-center text-xs font-bold border transition-all ${
                  action === 'flashcards'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                ফ্ল্যাশকার্ড
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                নির্দিষ্ট প্রশ্ন বা অতিরিক্ত নির্দেশ (ঐচ্ছিক)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                placeholder="যেমন: এই টপিক থেকে গুরুত্বপূর্ণ ৩টি প্রশ্ন উত্তর সহ বুঝিয়ে দাও..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 resize-none"
              />
            </div>

            <button
              onClick={handleRunTutor}
              disabled={isTutorLoading || !topic.trim()}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              {isTutorLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>AI টিউটর ভাবছে...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>পড়া তৈরি করুন</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col space-y-3 min-h-[400px]">
            <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                পড়াশোনার উত্তর ও নোটস
              </span>

              {tutorOutput && (
                <div className="flex items-center gap-2">
                  <CopyButton text={tutorOutput} />
                  <TextToSpeechButton text={tutorOutput} />
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 custom-scrollbar">
              {tutorOutput ? (
                <div className="prose dark:prose-invert prose-sm max-w-none text-slate-900 dark:text-slate-100 leading-relaxed">
                  <ReactMarkdown>{tutorOutput}</ReactMarkdown>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                  <div className="text-xs font-medium">এখানে AI টিউটরের উত্তর দেখতে পাবেন</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI QUIZ GENERATOR */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                কুইজ জেনারেটর নির্দেশিকা
              </h3>
              <p className="text-xs text-slate-500">
                বিষয় ও টপিক সেট করে <b>"AI কুইজ জেনারেট করুন"</b> ক্লিক করুন।
              </p>
            </div>

            <button
              onClick={handleGenerateQuiz}
              disabled={isQuizLoading || !topic.trim()}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shrink-0"
            >
              {isQuizLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>কুইজ তৈরি হচ্ছে...</span>
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4" />
                  <span>AI কুইজ জেনারেট করুন</span>
                </>
              )}
            </button>
          </div>

          {/* QUIZ DISPLAY */}
          {quizQuestions.length > 0 && (
            <div className="space-y-6">
              {quizQuestions.map((q, qIdx) => {
                const selectedOpt = userAnswers[qIdx];
                return (
                  <div
                    key={qIdx}
                    className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3"
                  >
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-start gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs shrink-0 mt-0.5">
                        প্রশ্ন {qIdx + 1}
                      </span>
                      <span>{q.question}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = selectedOpt === oIdx;
                        const isCorrect = q.correctIndex === oIdx;

                        let btnStyle =
                          'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-500';

                        if (showResults) {
                          if (isCorrect) {
                            btnStyle =
                              'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                          } else if (isSelected && !isCorrect) {
                            btnStyle =
                              'bg-red-100 dark:bg-red-950/80 border-red-500 text-red-900 dark:text-red-200 font-bold';
                          }
                        } else if (isSelected) {
                          btnStyle =
                            'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm';
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleAnswerSelect(qIdx, oIdx)}
                            className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>
                              <b>{String.fromCharCode(65 + oIdx)}.</b> {opt}
                            </span>
                            {showResults && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                            )}
                            {showResults && isSelected && !isCorrect && (
                              <XCircle className="w-4 h-4 text-red-500 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {showResults && (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                        <b>ব্যাখ্যা:</b> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* QUIZ ACTIONS / RESULT SCORE */}
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                {!showResults ? (
                  <button
                    onClick={() => setShowResults(true)}
                    disabled={userAnswers.length < quizQuestions.length}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-md"
                  >
                    উত্তর জমা দিন ও রেজাল্ট দেখুন
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        আপনার কুইজ স্কোর: {calculateScore()} / {quizQuestions.length}
                      </div>
                      <div className="text-xs text-slate-500">
                        {calculateScore() === quizQuestions.length
                          ? 'চমৎকার! আপনি সব উত্তর সঠিক দিয়েছেন।'
                          : 'ভাল হয়েছে! ব্যাখ্যাগুলো দেখে আরেকটু ঝালিয়ে নিন।'}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleGenerateQuiz}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>নতুন কুইজ বানান</span>
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium">
              {errorMsg}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
