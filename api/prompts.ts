import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callGemini } from './_lib/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { objective, category = 'General', targetAI = 'ChatGPT / Gemini / Midjourney' } = body;

    const prompt = `Generate a master-level, highly optimized prompt for AI.
User Goal/Objective: "${objective}"
Category: ${category}
Target AI Tool: ${targetAI}

Generate:
1. Optimized Master Prompt (in English or Bengali depending on optimal usage)
2. Key Variables/Placeholders to customize (e.g. [Topic], [Tone], [Length])
3. How to use tips in Bengali`;

    const sysInstruction = 'You are an expert AI Prompt Engineer.';

    const output = await callGemini(prompt, sysInstruction, 0.6);
    return res.status(200).json({ success: true, text: output });
  } catch (err: any) {
    console.error('Prompts API Error:', err);
    return res.status(500).json({
      error: 'প্রম্পট জেনারেট করতে সমস্যা হয়েছে।',
      details: err.message,
    });
  }
}
