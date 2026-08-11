import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callGemini } from './_lib/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { purpose, recipient, details, tone = 'Formal', language = 'Bengali' } = body;

    const prompt = `Write a complete email in ${language}.
Purpose: ${purpose}
Recipient: ${recipient}
Key Details: ${details}
Tone: ${tone} (e.g. Formal, Professional, Friendly, Apology, Request, Follow-up, Complaint, Thank you)

Formatting required:
- Subject Line: [Catchy, clear subject line]
- Salutation
- Email Body (structured in clear paragraphs)
- Closing Sign-off`;

    const sysInstruction = 'You are a professional corporate communications specialist.';

    const output = await callGemini(prompt, sysInstruction, 0.5);
    return res.status(200).json({ success: true, text: output });
  } catch (err: any) {
    console.error('Email API Error:', err);
    return res.status(500).json({
      error: 'ইমেইল তৈরিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।',
      details: err.message,
    });
  }
}
