import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callGemini } from './_lib/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { messages, mode = 'General', userPreferences } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'অনুগ্রহ করে অন্তত একটি বার্তা প্রদান করুন।' });
    }

    const lastUserMessage = messages[messages.length - 1].content;

    let modeInstruction = 'Mode: General AI Assistant. Be helpful, concise, and clear in natural Bengali.';
    if (mode === 'Study') {
      modeInstruction = 'Mode: Study Assistant. Explain concepts simply with step-by-step breakdowns, key takeaways, and examples in Bengali.';
    } else if (mode === 'Writing') {
      modeInstruction = 'Mode: Polished Writing Studio. Deliver beautifully formatted, eloquent, and creative Bengali prose.';
    } else if (mode === 'Coding') {
      modeInstruction = 'Mode: Technical & Coding Specialist. Provide clean code snippets, explanations, and debugging advice with clear Bengali commentary.';
    } else if (mode === 'Business') {
      modeInstruction = 'Mode: Professional Corporate & Business Consultant. Use professional Bengali business etiquette and clear structured points.';
    } else if (mode === 'Creative') {
      modeInstruction = 'Mode: Creative Writer. Use rich vocabulary, storytelling, emotional depth, and imaginative tone.';
    } else if (mode === 'Professional') {
      modeInstruction = 'Mode: Formal & Professional. Maintain polite, formal, and authoritative Bengali communication.';
    }

    if (userPreferences?.name) {
      modeInstruction += ` The user's name is ${userPreferences.name}. Greet or address them warmly if appropriate.`;
    }

    const formattedHistory = messages
      .slice(-10)
      .map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const fullPrompt = `Below is the recent conversation history:\n${formattedHistory}\n\nPlease respond appropriately to the latest user message: "${lastUserMessage}"`;

    const aiResponse = await callGemini(fullPrompt, modeInstruction, 0.7);
    return res.status(200).json({ success: true, text: aiResponse });
  } catch (err: any) {
    console.error('Chat API Error:', err);
    return res.status(500).json({
      error: 'দুঃখিত, এই মুহূর্তে AI উত্তর দিতে পারছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।',
      details: err.message,
    });
  }
}
