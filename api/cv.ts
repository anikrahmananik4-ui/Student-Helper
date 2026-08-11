import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callGemini } from './_lib/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { fullName, targetRole, skills, education, experience, achievements, language = 'Bengali' } = body;

    const prompt = `Write a professional Resume/CV content section in ${language} for:
Full Name: ${fullName || '[Your Name]'}
Target Role: ${targetRole || '[Job Title]'}
Key Skills: ${skills || 'Not specified'}
Education Details: ${education || 'Not specified'}
Experience Details: ${experience || 'Not specified'}
Key Achievements: ${achievements || 'Not specified'}

Instructions:
- Do NOT fabricate fake credentials or companies. Use clean placeholders [e.g. "Company Name", "Year"] if facts are unspecified.
- Provide:
  1. Professional Summary / Profile Statement
  2. Bullet points for Key Skills & Core Competencies
  3. Action-oriented descriptions for Work Experience
  4. Formatted Education section`;

    const sysInstruction = 'You are an expert HR recruiter and professional CV writer.';

    const output = await callGemini(prompt, sysInstruction, 0.5);
    return res.status(200).json({ success: true, text: output });
  } catch (err: any) {
    console.error('CV API Error:', err);
    return res.status(500).json({
      error: 'সিভি টেক্সট তৈরিতে সমস্যা ঘটেছে।',
      details: err.message,
    });
  }
}
