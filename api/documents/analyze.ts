import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callGemini } from '../_lib/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let userQuestion = '';
    let textContent = '';

    if (typeof req.body === 'object' && req.body !== null) {
      userQuestion = req.body.userQuestion || '';
      textContent = req.body.textContent || '';
    } else if (typeof req.body === 'string') {
      try {
        const parsed = JSON.parse(req.body);
        userQuestion = parsed.userQuestion || '';
        textContent = parsed.textContent || '';
      } catch {
        textContent = req.body;
      }
    }

    if (!textContent || textContent.trim() === '') {
      return res.status(400).json({
        error: 'কোনো ফাইল বা টেক্সট পাওয়া যায়নি। অনুগ্রহ করে একটি ফাইল বা টেক্সট যোগ করুন।',
      });
    }

    const question = userQuestion || 'এই ডকুমেন্টের মূল বিষয় ও প্রধান পয়েন্টগুলো সহজ বাংলায় বুঝিয়ে দাও।';

    const prompt = `You are analyzing the following document context:
=== DOCUMENT CONTEXT START ===
${textContent.slice(0, 10000)}
=== DOCUMENT CONTEXT END ===

User Request / Question: "${question}"

Instructions:
1. Answer the user's question based strictly on the document context provided above.
2. If the answer is NOT present in the document context, explicitly state in Bengali: "ফাইলটিতে এই তথ্যের উল্লেখ পাওয়া যায়নি।" Do not hallucinate external details.
3. Provide your response in clear, well-formatted Bengali.`;

    const sysInstruction = 'You are a secure, accurate Document & PDF Assistant.';

    const output = await callGemini(prompt, sysInstruction, 0.3);
    return res.status(200).json({ success: true, text: output });
  } catch (err: any) {
    console.error('Document Analyze API Error:', err);
    return res.status(500).json({
      error: 'ডকুমেন্ট বিশ্লেষণ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।',
      details: err.message,
    });
  }
}
