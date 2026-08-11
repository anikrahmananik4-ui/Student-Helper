import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callGemini } from './_lib/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { type, topic, keyInfo, audience, language = 'Bengali', style = 'Professional', length = 'Medium' } = body;

    if (!topic || topic.trim() === '') {
      return res.status(400).json({ error: 'অনুগ্রহ করে লেখার বিষয় বা টপিক উল্লেখ করুন।' });
    }

    const prompt = `Write a ${type || 'content piece'} on the following topic:
Topic: ${topic}
Additional Key Details: ${keyInfo || 'None provided'}
Target Audience: ${audience || 'General Bangladeshi audience'}
Output Language: ${language}
Tone/Style: ${style}
Desired Length: ${length} (Short = ~100-150 words, Medium = ~250-400 words, Long = ~600+ words)

Ensure high-quality, elegant formatting with proper paragraphing, headlines, bullet points if appropriate, and localized natural tone.`;

    const sysInstruction = `You are a professional content creator and copywriter specializing in ${language}. Produce engaging, polished content ready to copy and share.`;

    const output = await callGemini(prompt, sysInstruction, 0.7);
    return res.status(200).json({ success: true, text: output });
  } catch (err: any) {
    console.error('Writing API Error:', err);
    return res.status(500).json({
      error: 'লেখা তৈরিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।',
      details: err.message,
    });
  }
}
