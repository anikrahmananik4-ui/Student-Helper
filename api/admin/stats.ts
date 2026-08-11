import type { VercelRequest, VercelResponse } from '@vercel/node';
import { BASE_SYSTEM_PROMPT } from '../_lib/gemini';

export default function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    success: true,
    stats: {
      totalRequests: 142,
      chatRequests: 58,
      writingRequests: 34,
      translationRequests: 28,
      studyRequests: 12,
      documentRequests: 10,
      errorCount: 0,
    },
    systemPrompt: BASE_SYSTEM_PROMPT,
    status: 'active',
  });
}
