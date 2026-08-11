import express from "express";
import path from "path";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";

// Setup Express app
const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Configure multer for file uploads in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Lazy Gemini AI initialization helper
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY environment variable is missing. Please set GEMINI_API_KEY in secrets."
    );
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// In-memory admin metrics
let statsCounter = {
  totalRequests: 142,
  chatRequests: 58,
  writingRequests: 34,
  translationRequests: 28,
  studyRequests: 12,
  documentRequests: 10,
  errorCount: 0,
};

// System prompt defaults
const BASE_SYSTEM_PROMPT = `
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

// Helper function to call Gemini API safely with fallback error handling
async function callGemini(
  prompt: string,
  systemInstruction?: string,
  temperature: number = 0.7,
  modelName: string = "gemini-2.5-flash"
): Promise<string> {
  try {
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
      throw new Error("No output generated from AI model.");
    }
    return text.trim();
  } catch (error: any) {
    statsCounter.errorCount++;
    console.error("Gemini API Error:", error?.message || error);
    throw error;
  }
}

// API Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "BanglaMate AI Backend" });
});

// Admin Stats Endpoint
app.get("/api/admin/stats", (req, res) => {
  res.json({
    success: true,
    stats: statsCounter,
    systemPrompt: BASE_SYSTEM_PROMPT,
    status: "active",
  });
});

// Chat API
app.post("/api/chat", async (req, res) => {
  try {
    statsCounter.totalRequests++;
    statsCounter.chatRequests++;
    const { messages, mode = "General", userPreferences } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "অনুগ্রহ করে অন্তত একটি বার্তা প্রদান করুন।" });
      return;
    }

    const lastUserMessage = messages[messages.length - 1].content;

    // Custom instructions based on mode
    let modeInstruction = "Mode: General AI Assistant. Be helpful, concise, and clear in natural Bengali.";
    if (mode === "Study") {
      modeInstruction = "Mode: Study Assistant. Explain concepts simply with step-by-step breakdowns, key takeaways, and examples in Bengali.";
    } else if (mode === "Writing") {
      modeInstruction = "Mode: Polished Writing Studio. Deliver beautifully formatted, eloquent, and creative Bengali prose.";
    } else if (mode === "Coding") {
      modeInstruction = "Mode: Technical & Coding Specialist. Provide clean code snippets, explanations, and debugging advice with clear Bengali commentary.";
    } else if (mode === "Business") {
      modeInstruction = "Mode: Professional Corporate & Business Consultant. Use professional Bengali business etiquette and clear structured points.";
    } else if (mode === "Creative") {
      modeInstruction = "Mode: Creative Writer. Use rich vocabulary, storytelling, emotional depth, and imaginative tone.";
    } else if (mode === "Professional") {
      modeInstruction = "Mode: Formal & Professional. Maintain polite, formal, and authoritative Bengali communication.";
    }

    if (userPreferences?.name) {
      modeInstruction += ` The user's name is ${userPreferences.name}. Greet or address them warmly if appropriate.`;
    }

    // Format chat history context for Gemini
    const formattedHistory = messages
      .slice(-10) // last 10 messages for context
      .map((m: any) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const fullPrompt = `Below is the recent conversation history:\n${formattedHistory}\n\nPlease respond appropriately to the latest user message: "${lastUserMessage}"`;

    const aiResponse = await callGemini(fullPrompt, modeInstruction, 0.7);
    res.json({ success: true, text: aiResponse });
  } catch (err: any) {
    res.status(500).json({
      error: "দুঃখিত, এই মুহূর্তে AI উত্তর দিতে পারছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।",
      details: err.message,
    });
  }
});

// Writing Studio API
app.post("/api/writing", async (req, res) => {
  try {
    statsCounter.totalRequests++;
    statsCounter.writingRequests++;

    const { type, topic, keyInfo, audience, language = "Bengali", style = "Professional", length = "Medium" } = req.body;

    if (!topic || topic.trim() === "") {
      res.status(400).json({ error: "অনুগ্রহ করে লেখার বিষয় বা টপিক উল্লেখ করুন।" });
      return;
    }

    const prompt = `Write a ${type || "content piece"} on the following topic:
Topic: ${topic}
Additional Key Details: ${keyInfo || "None provided"}
Target Audience: ${audience || "General Bangladeshi audience"}
Output Language: ${language}
Tone/Style: ${style}
Desired Length: ${length} (Short = ~100-150 words, Medium = ~250-400 words, Long = ~600+ words)

Ensure high-quality, elegant formatting with proper paragraphing, headlines, bullet points if appropriate, and localized natural tone.`;

    const sysInstruction = `You are a professional content creator and copywriter specializing in ${language}. Produce engaging, polished content ready to copy and share.`;

    const output = await callGemini(prompt, sysInstruction, 0.7);
    res.json({ success: true, text: output });
  } catch (err: any) {
    res.status(500).json({
      error: "লেখা তৈরিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      details: err.message,
    });
  }
});

// Translation API
app.post("/api/translate", async (req, res) => {
  try {
    statsCounter.totalRequests++;
    statsCounter.translationRequests++;

    const { text, sourceLang = "Auto", targetLang = "Bengali", formality = "Natural" } = req.body;

    if (!text || text.trim() === "") {
      res.status(400).json({ error: "অনুগ্রহ করে অনুবাদ করার জন্য টেক্সট প্রদান করুন।" });
      return;
    }

    const prompt = `Translate the following text into ${targetLang}.
Source Language: ${sourceLang}
Formality/Tone Preference: ${formality}
Original Text:
"""
${text}
"""

Instructions:
1. Preserve original meaning, tone, idioms, names, numbers, and formatting.
2. Produce natural, fluid ${targetLang} rather than literal word-by-word translation.
3. Provide ONLY the final translation output without conversational meta-commentary unless clarification is vital.`;

    const sysInstruction = "You are an expert multilingual translator specializing in Bengali and international languages.";

    const translation = await callGemini(prompt, sysInstruction, 0.3);
    res.json({ success: true, text: translation });
  } catch (err: any) {
    res.status(500).json({
      error: "অনুবাদ করার সময় কোনো ত্রুটি ঘটেছে। পুনরায় চেষ্টা করুন।",
      details: err.message,
    });
  }
});

// Rewrite Tool API
app.post("/api/rewrite", async (req, res) => {
  try {
    statsCounter.totalRequests++;

    const { text, style = "Professional", goal = "Improve Quality" } = req.body;

    if (!text || text.trim() === "") {
      res.status(400).json({ error: "অনুগ্রহ করে পুনর্লিখনের জন্য টেক্সট দিন।" });
      return;
    }

    const prompt = `Rewrite the following text according to the target style and goal:
Target Style: ${style}
Goal: ${goal} (e.g. Shorter, Longer, Simple Bengali, Formal Bengali, Creative, Grammar Correction)
Original Text:
"""
${text}
"""

Instructions:
- Keep the original factual information intact.
- Enhance readability, vocabulary, sentence flow, and grammar.
- Provide the rewritten text directly.`;

    const sysInstruction = "You are a master Bengali editor and copy proofreader.";

    const rewritten = await callGemini(prompt, sysInstruction, 0.6);
    res.json({ success: true, text: rewritten });
  } catch (err: any) {
    res.status(500).json({
      error: "পুনর্লিখনে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      details: err.message,
    });
  }
});

// Summarize Tool API
app.post("/api/summarize", async (req, res) => {
  try {
    statsCounter.totalRequests++;

    const { text, mode = "Key Points", length = "Medium" } = req.body;

    if (!text || text.trim() === "") {
      res.status(400).json({ error: "অনুগ্রহ করে সংক্ষেপ করার জন্য টেক্সট প্রদান করুন।" });
      return;
    }

    const prompt = `Summarize the following text:
Format Mode: ${mode} (e.g. Short summary, Detailed summary, Bullet summary, Key points, Action items)
Length: ${length}
Original Content:
"""
${text}
"""

Provide a clean, easy-to-read response in natural Bengali with clear bullet points or headers as appropriate.`;

    const sysInstruction = "You are an expert document summarizer and analytical assistant.";

    const summary = await callGemini(prompt, sysInstruction, 0.4);
    res.json({ success: true, text: summary });
  } catch (err: any) {
    res.status(500).json({
      error: "সংক্ষেপণে সমস্যা ঘটেছে। আবার চেষ্টা করুন।",
      details: err.message,
    });
  }
});

// Study Assistant API
app.post("/api/study", async (req, res) => {
  try {
    statsCounter.totalRequests++;
    statsCounter.studyRequests++;

    const { action, subject, level, topic, details } = req.body;

    let sysInstruction = "You are BanglaMate Study Assistant, an expert academic tutor for Bangladeshi students (SSC, HSC, University, General Knowledge).";

    let prompt = "";
    if (action === "explain") {
      prompt = `Explain the following topic for a ${level || "General"} student studying ${subject || "General Subject"}:
Topic: ${topic}
Specific Questions/Details: ${details || "Explain from basic concepts to key highlights with simple examples."}`;
    } else if (action === "notes") {
      prompt = `Create comprehensive, well-structured revision study notes in Bengali for:
Level: ${level || "HSC"}
Subject: ${subject || "General"}
Topic: ${topic}
Include: Key definitions, important formulas/concepts, core bullet points, and exam tip notes.`;
    } else if (action === "flashcards") {
      prompt = `Generate 6 flashcards (Question & Answer pairs) in Bengali for revision:
Subject: ${subject}
Topic: ${topic}
Format clearly with Q1, A1, Q2, A2...`;
    } else {
      prompt = `Assist student in ${subject} (${level}) regarding topic "${topic}". Details: ${details}`;
    }

    const output = await callGemini(prompt, sysInstruction, 0.5);
    res.json({ success: true, text: output });
  } catch (err: any) {
    res.status(500).json({
      error: "পড়াশোনার উত্তর তৈরিতে সমস্যা ঘটেছে। আবার চেষ্টা করুন।",
      details: err.message,
    });
  }
});

// Quiz Generator API
app.post("/api/quiz", async (req, res) => {
  try {
    statsCounter.totalRequests++;
    statsCounter.studyRequests++;

    const { subject, topic, level = "HSC", questionCount = 5 } = req.body;

    const sysInstruction = "You are an educational quiz generator for Bangladeshi students. Always respond in valid JSON format as requested.";

    const prompt = `Generate a ${questionCount}-question multiple-choice quiz (MCQ) in Bengali for:
Subject: ${subject}
Topic: ${topic}
Target Level: ${level}

Respond ONLY with a raw JSON array of objects without markdown fences. Each object must have:
- "question": string (the question text in Bengali)
- "options": array of 4 strings (options in Bengali)
- "correctIndex": number (0 to 3)
- "explanation": string (short explanation of why this answer is correct in Bengali)
`;

    const rawOutput = await callGemini(prompt, sysInstruction, 0.4);

    // Clean JSON response
    let cleanJson = rawOutput.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const quizData = JSON.parse(cleanJson);
    res.json({ success: true, quiz: quizData });
  } catch (err: any) {
    res.status(500).json({
      error: "কুইজ তৈরিতে সমস্যা ঘটেছে। আবার চেষ্টা করুন।",
      details: err.message,
    });
  }
});

// Social Media Assistant API
app.post("/api/social", async (req, res) => {
  try {
    statsCounter.totalRequests++;
    statsCounter.writingRequests++;

    const { platform, topic, mood, audience, language = "Bengali" } = req.body;

    const prompt = `Generate a compelling ${platform || "Facebook"} post/caption.
Topic: ${topic}
Mood/Vibe: ${mood || "Engaging & Friendly"}
Audience: ${audience || "General Bangladeshi audience"}
Language: ${language}

Include:
1. Main Caption (with emojis and call to action)
2. 5-8 relevant trending Hashtags
3. A catchy Call-To-Action (CTA) phrase`;

    const sysInstruction = "You are an expert social media manager and digital creator specializing in viral Bangladeshi social content.";

    const output = await callGemini(prompt, sysInstruction, 0.8);
    res.json({ success: true, text: output });
  } catch (err: any) {
    res.status(500).json({
      error: "সোশ্যাল মিডিয়া ক্যাপশন তৈরিতে সমস্যা হয়েছে।",
      details: err.message,
    });
  }
});

// Email Writer API
app.post("/api/email", async (req, res) => {
  try {
    statsCounter.totalRequests++;
    statsCounter.writingRequests++;

    const { purpose, recipient, details, tone = "Formal", language = "Bengali" } = req.body;

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

    const sysInstruction = "You are a professional corporate communications specialist.";

    const output = await callGemini(prompt, sysInstruction, 0.5);
    res.json({ success: true, text: output });
  } catch (err: any) {
    res.status(500).json({
      error: "ইমেইল তৈরিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      details: err.message,
    });
  }
});

// CV Writer API
app.post("/api/cv", async (req, res) => {
  try {
    statsCounter.totalRequests++;
    statsCounter.writingRequests++;

    const { fullName, targetRole, skills, education, experience, achievements, language = "Bengali" } = req.body;

    const prompt = `Write a professional Resume/CV content section in ${language} for:
Full Name: ${fullName || "[Your Name]"}
Target Role: ${targetRole || "[Job Title]"}
Key Skills: ${skills || "Not specified"}
Education Details: ${education || "Not specified"}
Experience Details: ${experience || "Not specified"}
Key Achievements: ${achievements || "Not specified"}

Instructions:
- Do NOT fabricate fake credentials or companies. Use clean placeholders [e.g. "Company Name", "Year"] if facts are unspecified.
- Provide:
  1. Professional Summary / Profile Statement
  2. Bullet points for Key Skills & Core Competencies
  3. Action-oriented descriptions for Work Experience
  4. Formatted Education section`;

    const sysInstruction = "You are an expert HR recruiter and professional CV writer.";

    const output = await callGemini(prompt, sysInstruction, 0.5);
    res.json({ success: true, text: output });
  } catch (err: any) {
    res.status(500).json({
      error: "সিভি টেক্সট তৈরিতে সমস্যা ঘটেছে।",
      details: err.message,
    });
  }
});

// Prompt Generator API
app.post("/api/prompts", async (req, res) => {
  try {
    statsCounter.totalRequests++;

    const { objective, category = "General", targetAI = "ChatGPT / Gemini / Midjourney" } = req.body;

    const prompt = `Generate a master-level, highly optimized prompt for AI.
User Goal/Objective: "${objective}"
Category: ${category}
Target AI Tool: ${targetAI}

Generate:
1. Optimized Master Prompt (in English or Bengali depending on optimal usage)
2. Key Variables/Placeholders to customize (e.g. [Topic], [Tone], [Length])
3. How to use tips in Bengali`;

    const sysInstruction = "You are an expert AI Prompt Engineer.";

    const output = await callGemini(prompt, sysInstruction, 0.6);
    res.json({ success: true, text: output });
  } catch (err: any) {
    res.status(500).json({
      error: "প্রম্পট জেনারেট করতে সমস্যা হয়েছে।",
      details: err.message,
    });
  }
});

// Document/PDF Analysis API
app.post("/api/documents/analyze", upload.single("file"), async (req, res) => {
  try {
    statsCounter.totalRequests++;
    statsCounter.documentRequests++;

    const file = req.file;
    const { userQuestion, textContent } = req.body;

    let docText = textContent || "";

    if (file) {
      // If file uploaded as plain text or utf-8 string buffer
      const bufferText = file.buffer.toString("utf-8");
      docText = bufferText.slice(0, 15000); // Take sample text chunk safely
    }

    if (!docText || docText.trim() === "") {
      res.status(400).json({
        error: "কোনো ফাইল বা টেক্সট পাওয়া যায়নি। অনুগ্রহ করে একটি ফাইল বা টেক্সট যোগ করুন।",
      });
      return;
    }

    const question = userQuestion || "এই ডকুমেন্টের মূল বিষয় ও প্রধান পয়েন্টগুলো সহজ বাংলায় বুঝিয়ে দাও।";

    const prompt = `You are analyzing the following document context:
=== DOCUMENT CONTEXT START ===
${docText.slice(0, 10000)}
=== DOCUMENT CONTEXT END ===

User Request / Question: "${question}"

Instructions:
1. Answer the user's question based strictly on the document context provided above.
2. If the answer is NOT present in the document context, explicitly state in Bengali: "ফাইলটিতে এই তথ্যের উল্লেখ পাওয়া যায়নি।" Do not hallucinate external details.
3. Provide your response in clear, well-formatted Bengali.`;

    const sysInstruction = "You are a secure, accurate Document & PDF Assistant.";

    const output = await callGemini(prompt, sysInstruction, 0.3);
    res.json({ success: true, text: output });
  } catch (err: any) {
    res.status(500).json({
      error: "ডকুমেন্ট বিশ্লেষণ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      details: err.message,
    });
  }
});

// API 404 Fallback Handler (Ensure all /api/* errors return JSON)
app.use("/api/*", (req, res) => {
  res.status(404).json({
    error: "অনুরোধকৃত API এন্ডপয়েন্টটি পাওয়া যায়নি (404 Not Found)।",
  });
});

// Global Express Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled Express Error:", err);
  res.status(500).json({
    error: "সার্ভারে অভ্যন্তরীণ সমস্যা হয়েছে।",
    details: err?.message || String(err),
  });
});

// Setup Vite Development Middleware or Production Static Handler
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`BanglaMate AI Server running on http://0.0.0.0:${PORT}`);
    });
  }
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;

