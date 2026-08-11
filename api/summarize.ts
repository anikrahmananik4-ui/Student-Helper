import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callGemini } from './_lib/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { text, mode = 'Key Points', length = 'Medium' } = body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'অনুগ্রহ করে সংক্ষেপ করার জন্য টেক্সট প্রদান করুন।' });
    }

    const prompt = `Summarize the following text:
Format Mode: ${mode} (e.g. Short summary, Detailed summary, Bullet summary, Key points, Action items)
Length: ${length}
Original Content:
"""
${text}
"""

Provide a clean, easy-to-read response in natural Bengali with clear bullet points or headers as appropriate.`;

    const sysInstruction = 'You are an expert document summarizer and analytical assistant.';

    const summary = await callGemini(prompt, sysInstruction, 0.4);
    return res.status(200).json({ success: true, text: summary });
  } catch (err: any) {
    console.error('Summarize API Error:', err);
    return res.status(500).json({
      error: 'সংক্ষেপণে সমস্যা ঘটেছে। আবার চেষ্টা করুন।',
      details: err.message,
    });
  }
}
