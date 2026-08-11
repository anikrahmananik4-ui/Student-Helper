import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callGemini } from './_lib/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { text, imageText } = body;
    const content = text || imageText || '';

    if (!content.trim()) {
      return res.status(400).json({ error: 'OCR বা টেক্সট বিশ্লেষণের জন্য ডাটা দিন।' });
    }

    const prompt = `Extract, clean up, and format the Bengali text below:\n\n${content}`;
    const output = await callGemini(prompt, 'You are an expert OCR text processor.', 0.2);
    return res.status(200).json({ success: true, text: output });
  } catch (err: any) {
    console.error('OCR API Error:', err);
    return res.status(500).json({ error: 'OCR প্রসেসিং এ ত্রুটি হয়েছে।', details: err.message });
  }
}
