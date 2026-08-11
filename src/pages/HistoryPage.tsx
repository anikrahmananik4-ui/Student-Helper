import React from 'react';
import { Clock, MessageSquare, Trash2, ArrowRight, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HistoryPage: React.FC = () => {
  const { conversations, setCurrentConversationId, deleteConversation, createNewChat, navigate } = useApp();

  const handleOpenChat = (id: string) => {
    setCurrentConversationId(id);
    navigate('/chat');
  };

  const handleCreateNew = () => {
    const newChat = createNewChat('General');
    setCurrentConversationId(newChat.id);
    navigate('/chat');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-900 text-white space-y-2 shadow-xl border border-teal-800/40">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <Clock className="w-4 h-4" />
              <span>Conversation Archive</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              চ্যাট ইতিহাস ও রেকর্ড
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              আপনার অতীতের সকল এআই কনভারসেশন ও প্রশ্নসমূহের তালিকা।
            </p>
          </div>

          <button
            onClick={handleCreateNew}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন চ্যাট</span>
          </button>
        </div>
      </div>

      {conversations.length > 0 ? (
        <div className="space-y-3">
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => handleOpenChat(c.id)}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4 cursor-pointer hover:border-emerald-500/50 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>

                <div className="min-w-0 space-y-0.5">
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {c.title}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span>মোড: {c.mode}</span>
                    <span>•</span>
                    <span>{c.messages.length} বার্তা</span>
                    <span>•</span>
                    <span>
                      {new Date(c.updatedAt).toLocaleDateString('bn-BD', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('আপনি কি এই ইতিহাস মুছে ফেলতে চান?')) {
                      deleteConversation(c.id);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="p-2 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-slate-400 space-y-3 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <MessageSquare className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
          <div className="font-bold text-slate-700 dark:text-slate-300 text-sm">
            কোনো পূর্ববর্তী কনভারসেশন রেকর্ড নেই।
          </div>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
          >
            একটি নতুন চ্যাট শুরু করুন
          </button>
        </div>
      )}
    </div>
  );
};
