import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callGemini } from './_lib/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { subject, topic, level = 'HSC', questionCount = 5 } = body;

    const sysInstruction = 'You are an educational quiz generator for Bangladeshi students. Always respond in valid JSON format as requested.';

    const prompt = `Generate a ${questionCount}-question multiple-choice quiz (MCQ) in Bengali for:
Subject: ${subject}
Topic: ${topic}
Target Level: ${level}

Respond ONLY with a raw JSON array of objects without markdown fences. Each object must have:
- "question": string (the question text in Bengali)
- "options": array of 4 strings (options in Bengali)
- "correctIndex": number (0 to 3)
- "explanation": string (short explanation of why this answer is correct in Bengali)
`;

    const rawOutput = await callGemini(prompt, sysInstruction, 0.4);

    let cleanJson = rawOutput.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const quizData = JSON.parse(cleanJson);
    return res.status(200).json({ success: true, quiz: quizData });
  } catch (err: any) {
    console.error('Quiz API Error:', err);
    return res.status(500).json({
      error: 'কুইজ তৈরিতে সমস্যা ঘটেছে। আবার চেষ্টা করুন।',
      details: err.message,
    });
  }
}
