import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callGemini } from './_lib/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { action, subject, level, topic, details } = body;

    const sysInstruction = 'You are BanglaMate Study Assistant, an expert academic tutor for Bangladeshi students (SSC, HSC, University, General Knowledge).';

    let prompt = '';
    if (action === 'explain') {
      prompt = `Explain the following topic for a ${level || 'General'} student studying ${subject || 'General Subject'}:
Topic: ${topic}
Specific Questions/Details: ${details || 'Explain from basic concepts to key highlights with simple examples.'}`;
    } else if (action === 'notes') {
      prompt = `Create comprehensive, well-structured revision study notes in Bengali for:
Level: ${level || 'HSC'}
Subject: ${subject || 'General'}
Topic: ${topic}
Include: Key definitions, important formulas/concepts, core bullet points, and exam tip notes.`;
    } else if (action === 'flashcards') {
      prompt = `Generate 6 flashcards (Question & Answer pairs) in Bengali for revision:
Subject: ${subject}
Topic: ${topic}
Format clearly with Q1, A1, Q2, A2...`;
    } else {
      prompt = `Assist student in ${subject} (${level}) regarding topic "${topic}". Details: ${details}`;
    }

    const output = await callGemini(prompt, sysInstruction, 0.5);
    return res.status(200).json({ success: true, text: output });
  } catch (err: any) {
    console.error('Study API Error:', err);
    return res.status(500).json({
      error: 'পড়াশোনার উত্তর তৈরিতে সমস্যা ঘটেছে। আবার চেষ্টা করুন।',
      details: err.message,
    });
  }
}
