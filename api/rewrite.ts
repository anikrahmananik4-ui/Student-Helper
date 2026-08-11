import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callGemini } from './_lib/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { text, style = 'Professional', goal = 'Improve Quality' } = body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'অনুগ্রহ করে পুনর্লিখনের জন্য টেক্সট দিন।' });
    }

    const prompt = `Rewrite the following text according to the target style and goal:
Target Style: ${style}
Goal: ${goal} (e.g. Shorter, Longer, Simple Bengali, Formal Bengali, Creative, Grammar Correction)
Original Text:
"""
${text}
"""

Instructions:
- Keep the original factual information intact.
- Enhance readability, vocabulary, sentence flow, and grammar.
- Provide the rewritten text directly.`;

    const sysInstruction = 'You are a master Bengali editor and copy proofreader.';

    const rewritten = await callGemini(prompt, sysInstruction, 0.6);
    return res.status(200).json({ success: true, text: rewritten });
  } catch (err: any) {
    console.error('Rewrite API Error:', err);
    return res.status(500).json({
      error: 'পুনর্লিখনে সমস্যা হয়েছে। আবার চেষ্টা করুন।',
      details: err.message,
    });
  }
}
