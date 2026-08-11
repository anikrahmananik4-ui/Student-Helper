import { ChatMessage, ChatMode, QuizQuestion } from '../types';

export async function sendChatMessage(
  messages: ChatMessage[],
  mode: ChatMode = 'General',
  userPreferences?: any
): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, mode, userPreferences }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'AI উত্তর দিতে পারেনি।');
  }
  return data.text;
}

export async function generateWriting(payload: {
  type: string;
  topic: string;
  keyInfo?: string;
  audience?: string;
  language?: string;
  style?: string;
  length?: string;
}): Promise<string> {
  const res = await fetch('/api/writing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'লেখা তৈরি করা যায়নি।');
  }
  return data.text;
}

export async function translateText(payload: {
  text: string;
  sourceLang?: string;
  targetLang?: string;
  formality?: string;
}): Promise<string> {
  const res = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'অনুবাদ করা সম্ভব হয়নি।');
  }
  return data.text;
}

export async function rewriteText(payload: {
  text: string;
  style?: string;
  goal?: string;
}): Promise<string> {
  const res = await fetch('/api/rewrite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'পুনর্লিখন করা যায়নি।');
  }
  return data.text;
}

export async function summarizeText(payload: {
  text: string;
  mode?: string;
  length?: string;
}): Promise<string> {
  const res = await fetch('/api/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'সংক্ষেপ করা যায়নি।');
  }
  return data.text;
}

export async function studyAssist(payload: {
  action: 'explain' | 'notes' | 'flashcards';
  subject: string;
  level: string;
  topic: string;
  details?: string;
}): Promise<string> {
  const res = await fetch('/api/study', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'উত্তর তৈরি করা সম্ভব হয়নি।');
  }
  return data.text;
}

export async function generateQuiz(payload: {
  subject: string;
  topic: string;
  level?: string;
  questionCount?: number;
}): Promise<QuizQuestion[]> {
  const res = await fetch('/api/quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'কুইজ তৈরি করা সম্ভব হয়নি।');
  }
  return data.quiz;
}

export async function generateSocial(payload: {
  platform: string;
  topic: string;
  mood?: string;
  audience?: string;
  language?: string;
}): Promise<string> {
  const res = await fetch('/api/social', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'সোশ্যাল পোস্ট জেনারেট করা সম্ভব হয়নি।');
  }
  return data.text;
}

export async function generateEmail(payload: {
  purpose?: string;
  recipient?: string;
  details?: string;
  tone?: string;
  language?: string;
  emailType?: string;
  subjectTopic?: string;
  keyPoints?: string;
}): Promise<string> {
  const res = await fetch('/api/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'ইমেইল তৈরি সম্ভব হয়নি।');
  }
  return data.text;
}

export async function generateCV(payload: {
  fullName?: string;
  targetRole?: string;
  skills?: string;
  education?: string;
  experience?: string;
  achievements?: string;
  language?: string;
  documentType?: string;
  jobTitle?: string;
  companyName?: string;
}): Promise<string> {
  const res = await fetch('/api/cv', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'সিভি তৈরি করা সম্ভব হয়নি।');
  }
  return data.text;
}

export async function generatePrompt(payload: {
  objective: string;
  category?: string;
  targetAI?: string;
}): Promise<string> {
  const res = await fetch('/api/prompts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'প্রম্পট জেনারেট করা সম্ভব হয়নি।');
  }
  return data.text;
}

export async function analyzeDocument(formData: FormData): Promise<string> {
  const res = await fetch('/api/documents/analyze', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'ডকুমেন্ট এনালাইজ করা সম্ভব হয়নি।');
  }
  return data.text;
}

export async function fetchAdminStats(): Promise<any> {
  const res = await fetch('/api/admin/stats');
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'এডমিন ডেটা লোড করা যায়নি।');
  }
  return data.stats;
}
