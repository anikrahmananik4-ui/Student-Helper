import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callGemini } from './_lib/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { platform, topic, mood, audience, language = 'Bengali' } = body;

    const prompt = `Generate a compelling ${platform || 'Facebook'} post/caption.
Topic: ${topic}
Mood/Vibe: ${mood || 'Engaging & Friendly'}
Audience: ${audience || 'General Bangladeshi audience'}
Language: ${language}

Include:
1. Main Caption (with emojis and call to action)
2. 5-8 relevant trending Hashtags
3. A catchy Call-To-Action (CTA) phrase`;

    const sysInstruction = 'You are an expert social media manager and digital creator specializing in viral Bangladeshi social content.';

    const output = await callGemini(prompt, sysInstruction, 0.8);
    return res.status(200).json({ success: true, text: output });
  } catch (err: any) {
    console.error('Social API Error:', err);
    return res.status(500).json({
      error: 'সোশ্যাল মিডিয়া ক্যাপশন তৈরিতে সমস্যা হয়েছে।',
      details: err.message,
    });
  }
}
