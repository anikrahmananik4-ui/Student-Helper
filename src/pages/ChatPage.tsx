import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Send,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  Heart,
  MessageSquare,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessage, ChatMode } from '../types';
import { sendChatMessage } from '../services/apiService';
import { CopyButton } from '../components/common/CopyButton';
import { TextToSpeechButton } from '../components/common/TextToSpeechButton';
import { VoiceInputButton } from '../components/common/VoiceInputButton';

const CHAT_MODES: { mode: ChatMode; labelBn: string; icon: string }[] = [
  { mode: 'General', labelBn: 'সাধারণ AI (General)', icon: '💬' },
  { mode: 'Study', labelBn: 'পড়াশোনা (Study)', icon: '🎓' },
  { mode: 'Writing', labelBn: 'লেখালেখি (Writing)', icon: '✍️' },
  { mode: 'Coding', labelBn: 'প্রোগ্রামিং (Coding)', icon: '💻' },
  { mode: 'Business', labelBn: 'বিজনেস (Business)', icon: '💼' },
  { mode: 'Creative', labelBn: 'ক্রিয়েটিভ (Creative)', icon: '🎨' },
  { mode: 'Professional', labelBn: 'প্রফেশনাল (Professional)', icon: '👔' },
];

export const ChatPage: React.FC = () => {
  const {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    createNewChat,
    saveConversation,
    deleteConversation,
    addFavorite,
    isFavorite,
    preferences,
  } = useApp();

  const [inputMsg, setInputMsg] = useState('');
  const [selectedMode, setSelectedMode] = useState<ChatMode>('General');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active Conversation
  const activeConv = conversations.find((c) => c.id === currentConversationId) || null;

  useEffect(() => {
    if (!currentConversationId && conversations.length > 0) {
      setCurrentConversationId(conversations[0].id);
    } else if (conversations.length === 0) {
      const newC = createNewChat('General');
      setCurrentConversationId(newC.id);
    }
  }, [conversations, currentConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, isLoading]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMsg;
    if (!textToSend.trim() || isLoading) return;

    setErrorMsg(null);
    setInputMsg('');

    let targetConv = activeConv;
    if (!targetConv) {
      targetConv = createNewChat(selectedMode, textToSend.trim());
    }

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('bn-BD', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const updatedMessages = [...(targetConv.messages || []), userMsg];
    const updatedConv = {
      ...targetConv,
      title:
        targetConv.messages.length === 0
          ? textToSend.slice(0, 30) + (textToSend.length > 30 ? '...' : '')
          : targetConv.title,
      messages: updatedMessages,
    };

    saveConversation(updatedConv);
    setIsLoading(true);

    try {
      const aiResponseText = await sendChatMessage(
        updatedMessages,
        selectedMode,
        preferences
      );

      const assistantMsg: ChatMessage = {
        id: 'msg_ai_' + Date.now(),
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date().toLocaleTimeString('bn-BD', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      saveConversation({
        ...updatedConv,
        messages: [...updatedMessages, assistantMsg],
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'AI উত্তর দেওয়া সম্ভব হয়নি।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!activeConv || activeConv.messages.length === 0) return;
    const lastUserIndex = [...activeConv.messages]
      .reverse()
      .findIndex((m) => m.role === 'user');

    if (lastUserIndex === -1) return;

    const actualIdx = activeConv.messages.length - 1 - lastUserIndex;
    const trimmedMsgs = activeConv.messages.slice(0, actualIdx + 1);

    saveConversation({ ...activeConv, messages: trimmedMsgs });
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const aiResponseText = await sendChatMessage(
        trimmedMsgs,
        selectedMode,
        preferences
      );

      const assistantMsg: ChatMessage = {
        id: 'msg_ai_' + Date.now(),
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date().toLocaleTimeString('bn-BD', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      saveConversation({
        ...activeConv,
        messages: [...trimmedMsgs, assistantMsg],
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'পুনরায় চেষ্টা ব্যর্থ হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (activeConv && window.confirm('আপনি কি এই চ্যাটের সব মেসেজ মুছে ফেলতে চান?')) {
      saveConversation({ ...activeConv, messages: [] });
    }
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col lg:flex-row gap-4 animate-in fade-in duration-200">
      {/* CHAT HISTORY SIDEBAR */}
      <div className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shrink-0">
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>কনভারসেশন ইতিহাস</span>
          </div>
          <button
            onClick={() => createNewChat(selectedMode)}
            className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 transition-colors"
            title="নতুন চ্যাট"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {conversations.map((c) => {
            const isSelected = c.id === currentConversationId;
            return (
              <div
                key={c.id}
                className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-300 dark:border-emerald-800'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
                onClick={() => setCurrentConversationId(c.id)}
              >
                <div className="min-w-0 pr-2">
                  <div className="text-xs truncate">{c.title}</div>
                  <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                    {c.messages.length} বার্তা
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(c.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        {/* Chat Top Toolbar */}
        <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          {/* Mode Selector */}
          <div className="flex items-center gap-2">
            <div className="relative inline-block text-left">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>মোড:</span>
                <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value as ChatMode)}
                  className="bg-transparent focus:outline-hidden font-bold cursor-pointer text-emerald-600 dark:text-emerald-400"
                >
                  {CHAT_MODES.map((m) => (
                    <option key={m.mode} value={m.mode} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                      {m.icon} {m.labelBn}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeConv && activeConv.messages.length > 0 && (
              <button
                onClick={handleClearChat}
                className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-1"
                title="কথোপকথন ক্লিয়ার করুন"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ক্লিয়ার</span>
              </button>
            )}
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          {activeConv && activeConv.messages.length > 0 ? (
            activeConv.messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              const isFav = isFavorite(msg.content);

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 sm:gap-4 ${
                    isAssistant ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 shadow-xs space-y-2 ${
                      isAssistant
                        ? 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80'
                        : 'bg-emerald-600 text-white shadow-emerald-600/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] opacity-75 font-medium border-b pb-2 mb-2 border-slate-200 dark:border-slate-700/50">
                      <span>{isAssistant ? 'BanglaMate AI' : 'আপনি'}</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {/* Content Rendering */}
                    <div className="prose dark:prose-invert prose-sm max-w-none text-sm leading-relaxed overflow-x-auto">
                      {isAssistant ? (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>

                    {/* Action bar for Assistant messages */}
                    {isAssistant && (
                      <div className="pt-3 flex flex-wrap items-center gap-2 border-t border-slate-200 dark:border-slate-700/60">
                        <CopyButton text={msg.content} />
                        <TextToSpeechButton text={msg.content} />

                        <button
                          onClick={() => {
                            if (isFav) return;
                            addFavorite({
                              title: msg.content.slice(0, 30) + '...',
                              category: 'Chat',
                              content: msg.content,
                            });
                          }}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                            isFav
                              ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
                          <span>{isFav ? 'সেভড' : 'সেভ করুন'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {!isAssistant && (
                    <div className="w-8 h-8 rounded-xl bg-slate-800 dark:bg-slate-700 text-slate-100 flex items-center justify-center shrink-0 shadow-md">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            /* EMPTY CHAT STATE */
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                এখনও কোনো কথোপকথন শুরু হয়নি।
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md">
                নিচে আপনার প্রশ্ন বা বিষয় লিখুন। বাংলামেট এআই যেকোনো প্রশ্নের দ্রুত ও সঠিক উত্তর তৈরি করে দেবে।
              </p>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs max-w-lg w-full text-left">
                <button
                  onClick={() => handleSend('বাংলাদেশের স্বাধীনতা যুদ্ধ সম্পর্কে সহজ বাংলায় আলোচনা করো।')}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all text-slate-700 dark:text-slate-300"
                >
                  "বাংলাদেশের স্বাধীনতা যুদ্ধ সম্পর্কে সংক্ষেপে বলো"
                </button>
                <button
                  onClick={() => handleSend('একজন ছাত্রের দৈনিক রুটিন তৈরির পরামর্শ দাও।')}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all text-slate-700 dark:text-slate-300"
                >
                  "একজন শিক্ষার্থীর জন্য আইডিয়াল দৈনিক রুটিন বানাও"
                </button>
              </div>
            </div>
          )}

          {/* LOADING SKELETON */}
          {isLoading && (
            <div className="flex gap-3 items-center text-slate-500 text-xs py-2 animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>AI ভাবছে... উত্তর তৈরি হচ্ছে...</span>
              </div>
            </div>
          )}

          {/* ERROR FALLBACK */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center justify-between">
              <span>{errorMsg}</span>
              <button
                onClick={handleRegenerate}
                className="px-3 py-1 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>আবার চেষ্টা করুন</span>
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT BAR */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm focus-within:border-emerald-500 transition-all"
          >
            <VoiceInputButton
              onTranscript={(text) => setInputMsg((prev) => (prev ? prev + ' ' + text : text))}
            />

            <textarea
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="বাংলা বা English-এ আপনার বার্তা লিখুন (Shift + Enter নতুন লাইনের জন্য)..."
              rows={1}
              className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs sm:text-sm focus:outline-hidden resize-none py-1.5"
            />

            <button
              type="submit"
              disabled={!inputMsg.trim() || isLoading}
              className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition-all shadow-md shrink-0"
              title="পাঠান"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
