import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callGemini } from './_lib/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { text, sourceLang = 'Auto', targetLang = 'Bengali', formality = 'Natural' } = body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'অনুগ্রহ করে অনুবাদ করার জন্য টেক্সট প্রদান করুন।' });
    }

    const prompt = `Translate the following text into ${targetLang}.
Source Language: ${sourceLang}
Formality/Tone Preference: ${formality}
Original Text:
"""
${text}
"""

Instructions:
1. Preserve original meaning, tone, idioms, names, numbers, and formatting.
2. Produce natural, fluid ${targetLang} rather than literal word-by-word translation.
3. Provide ONLY the final translation output without conversational meta-commentary unless clarification is vital.`;

    const sysInstruction = 'You are an expert multilingual translator specializing in Bengali and international languages.';

    const translation = await callGemini(prompt, sysInstruction, 0.3);
    return res.status(200).json({ success: true, text: translation });
  } catch (err: any) {
    console.error('Translate API Error:', err);
    return res.status(500).json({
      error: 'অনুবাদ করার সময় কোনো ত্রুটি ঘটেছে। পুনরায় চেষ্টা করুন।',
      details: err.message,
    });
  }
}
