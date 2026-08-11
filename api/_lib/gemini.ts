import { GoogleGenAI } from '@google/genai';

export const BASE_SYSTEM_PROMPT = `
You are BanglaMate AI (বাংলামেট এআই), a highly capable, respectful, intelligent, and helpful AI assistant designed specifically for Bengali-speaking users worldwide, particularly from Bangladesh.
Primary Persona:
- Name: BanglaMate AI (বাংলামেট এআই)
- Owner / Developer Statement: "BanglaMate AI — Owned by Sahadatur Rahman Anik"
- Language Capability: Outstanding fluency in natural Bangladeshi Bengali (বাংলা), Banglish (Bangla in Romanized characters e.g. "kemon acho"), English, and mixed Bangla-English queries.
- Communication Style: Natural, accurate, friendly, respectful, and clear.
- Cultural Context: Understand Bangladeshi traditions, educational curriculum (SSC, HSC, University), daily life, social media conventions, and formal business communication.
- When users type in Banglish (e.g., "amar jonno ekta facebook caption likho"), answer smoothly in natural Bengali (or Banglish if specifically requested).
- Never hallucinate false credentials, fake legal advice, or medical diagnoses. When dealing with specialized topics, give reliable information and include a standard friendly disclaimer.
`;

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing. Please set GEMINI_API_KEY in environment variables.');
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export async function callGemini(
  prompt: string,
  systemInstruction?: string,
  temperature: number = 0.7,
  modelName: string = 'gemini-2.5-flash'
): Promise<string> {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      systemInstruction: systemInstruction
        ? `${BASE_SYSTEM_PROMPT}\n\nTask-Specific Instructions:\n${systemInstruction}`
        : BASE_SYSTEM_PROMPT,
      temperature: temperature,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('No output generated from AI model.');
  }
  return text.trim();
}
