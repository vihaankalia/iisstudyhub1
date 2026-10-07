import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Initialize Gemini Client lazily with dynamic key refresh
let aiClient: any = null;
let lastApiKey: string | undefined = undefined;

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!aiClient || lastApiKey !== apiKey) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "placeholder_key",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    lastApiKey = apiKey;
  }
  return aiClient;
};

// Priority list of compliant, high-availability Gemini models from gemini-api guidelines
const CANDIDATE_MODELS = [
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-3.1-pro-preview",
  "gemini-3.1-flash-lite"
];

async function generateWithFallback(options: {
  contents: any;
  config?: any;
}) {
  const ai = getAI();
  let lastError: any = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: options.contents,
        config: options.config,
      });
      if (response && response.text) {
        return response;
      }
    } catch (err: any) {
      console.warn(`[AI-Fallback] Model ${modelName} unavailable (${err?.status || err?.message || ""}), trying next model in pool...`);
      lastError = err;
    }
  }

  throw lastError;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// AI Chatbot Study Helper - Tailored to the student's learning pace & weak areas
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, profile, subject, chapter } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        text: "It looks like your **GEMINI_API_KEY** is not configured yet. 💡 Please head over to the **Settings > Secrets** panel in AI Studio and add `GEMINI_API_KEY` as a secret so I can connect to the CBSE Knowledge Base and help you study!"
      });
    }

    const studentName = profile?.name || "Student";
    const learningPace = profile?.learningPace || "medium";
    const weakAreas = profile?.weakAreas || [];
    const strengthAreas = profile?.strengthAreas || [];

    // Formulate a personalized system prompt based on their student persona
    let systemInstruction = `You are "NCERT Class 10 AI Tutor", an empathetic, highly skilled official CBSE Class 10 educator. Your job is to help the student learn CBSE topics deeply, clear doubts, and handle NCERT questions with 100% accuracy and clarity.

Core Tutoring Priorities:
1. Answer Directly and Accurately: When the student asks a direct question, always answer it clearly, directly, and accurately in the first 1-2 sentences. Never be evasive, avoid the question, or walk in circles.
2. Perfect Symbol & Equation Formatting: Avoid using raw LaTeX math notation, raw dollar signs ($ or $$), or backslashed LaTeX math commands (such as \\angle, \\theta, or \\pm) that clutter the reader. Instead, ALWAYS express mathematical and scientific symbols using clean, pure standard Unicode characters (e.g., ∠A, ∠B, ∠C, θ, α, β, √, ², ³, ±, °, ×, ÷, Δ, etc.) so they render beautifully in plain text and standard simple markdown.
3. Zero Generic Drift: Remain strictly focused on answering only the core concept, doubt, or calculation requested by the student. Do not introduce irrelevant side-topics, generic textbook summaries, or redundant introductory preambles.
4. Active Recall and Support: After answering their direct question fully, you can provide contextual step-by-step proofs, formulas, or check-in questions to reinforce active recall based on their pace (${learningPace.toUpperCase()}).
5. CBSE Syllabus Alignment: Stick strictly to Class 10 NCERT criteria and authentic previous board exam insights.

Student Persona:
- Name: ${studentName}
- Learning Pace: ${learningPace.toUpperCase()} (Adjust explanation flow speed accordingly).
- Weak Areas: ${weakAreas.join(", ") || "None yet"}.
- Strengths: ${strengthAreas.join(", ") || "None yet"}.`;

    if (subject) {
      systemInstruction += `\nCurrently discussing subject: ${subject}.`;
    }
    if (chapter) {
      systemInstruction += `\nCurrently studying chapter: ${chapter}.`;
    }

    // Format history for @google/genai: Gemini requires contents to start with role 'user' and alternate
    const formattedContents: any[] = [];
    if (history && Array.isArray(history)) {
      let hasSeenFirstUser = false;
      history.forEach((msg: any) => {
        const role = msg.role === "assistant" || msg.role === "model" ? "model" : "user";
        if (!hasSeenFirstUser) {
          if (role === "user") {
            hasSeenFirstUser = true;
          } else {
            // Drop initial assistant/welcome messages so history starts with a user turn
            return;
          }
        }
        const text = (msg.content || msg.text || "").trim();
        if (!text) return;

        // Ensure strictly alternating roles
        if (formattedContents.length > 0 && formattedContents[formattedContents.length - 1].role === role) {
          formattedContents[formattedContents.length - 1].parts[0].text += `\n${text}`;
        } else {
          formattedContents.push({
            role: role,
            parts: [{ text: text }],
          });
        }
      });
    }

    // Add current user message
    const cleanUserMsg = (message || "").trim();
    if (formattedContents.length > 0 && formattedContents[formattedContents.length - 1].role === "user") {
      formattedContents[formattedContents.length - 1].parts[0].text += `\n${cleanUserMsg}`;
    } else {
      formattedContents.push({
        role: "user",
        parts: [{ text: cleanUserMsg || "Hello" }],
      });
    }

    // Call Gemini with intelligent fallback across fast compliant models
    const response = await generateWithFallback({
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      text: response.text || "I'm sorry, I couldn't formulate an answer. Could you please rephrase?",
    });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    // Graceful offline fallback on any API/quota error
    const chatMsg = `⚠️ **NCERT AI Tutor (Offline Mode)**: I encountered a temporary connection or rate limit issue with the AI server. But let's keep your learning momentum going! 

Here are some immediate resources you can use:
- **Interactive Notes**: Head to the **Subjects** tab to read the full chapter-wise NCERT syllabus revision guides.
- **Chapter Worksheets**: Solve interactive multiple-choice board questions with instant step-by-step explanations.
- **Diagnostic Timed Tests**: Test your speed and precision under the **Practice & Timed Tests** tab.

If you have a specific question about Class 10 concepts, please try asking again in a few moments once the server traffic clears. Keep up the great work!`;
    res.json({ text: chatMsg });
  }
});

// AI Doubt Solver - Multimodal help to understand screenshots or captured photos Socratic-style
app.post("/api/doubt-solver", async (req, res) => {
  try {
    const { image, mimeType, userQuestion, history, profile } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        text: "It looks like your **GEMINI_API_KEY** is not configured yet. 💡 Please head over to the **Settings > Secrets** panel in AI Studio and add `GEMINI_API_KEY` as a secret so I can help analyze your doubt!"
      });
    }

    if (!image || !mimeType) {
      return res.status(400).json({ error: "Missing image or mimeType." });
    }

    const studentName = profile?.name || "Student";
    const learningPace = profile?.learningPace || "medium";

    // Specialized Socratic system instruction
    const systemInstruction = `You are the "Class 10 Socratic AI Doubt Solver", an encouraging, deeply knowledgeable science and mathematics tutor. Your job is NOT to explain or solve the problem for the student directly, but to help them UNDERSTAND it.

Core Socratic Guidelines:
1. NEVER Give Direct Answers or Final Solutions: Do not provide the final numerical values, direct options (e.g. "Hence Option B is correct"), or completed final proofs.
2. Socratic Scaffolding:
   - Identify the main concept/formula shown in the screenshot or image (e.g. "This diagram illustrates the law of refraction" or "This asks us to calculate the roots using the quadratic formula").
   - Explain the core principles/theorems behind it in 2-3 simple steps.
   - Lead the student with a strategic hint, starting step, or thought-provoking question (e.g., "Let's first identify what variables are given. What is the value of the focal length f here?").
3. Beautiful Formatting: Use clean unicode mathematical and scientific characters (e.g., ∠A, θ, α, β, √, ², ³, ±, °, ×, ÷, etc.). NEVER use raw LaTeX notation or backslashes.
4. Keep the student engaged: Support and challenge them to think, aligning with their learning pace (${learningPace.toUpperCase()}). Prompt them to take the next step.`;

    // Format parts
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: image, // base64 string
      },
    };

    const textPart = {
      text: userQuestion || "Analyze this image and guide me Socratic-style to understand the underlying Class 10 concepts."
    };

    const formattedContents: any[] = [];

    if (history && Array.isArray(history) && history.length > 0) {
      // Re-construct the visual conversation with strictly alternating roles starting with user
      let hasSeenFirstUser = false;
      history.forEach((msg: any) => {
        const role = msg.role === "assistant" || msg.role === "model" ? "model" : "user";
        if (!hasSeenFirstUser) {
          if (role === "user") {
            hasSeenFirstUser = true;
          } else {
            return;
          }
        }
        const text = (msg.content || msg.text || "").trim();
        if (!text) return;

        const parts: any[] = [];
        if (formattedContents.length === 0) {
          // Attach image to the first user turn
          parts.push(imagePart);
        }
        parts.push({ text: text });

        if (formattedContents.length > 0 && formattedContents[formattedContents.length - 1].role === role) {
          formattedContents[formattedContents.length - 1].parts.push({ text: text });
        } else {
          formattedContents.push({
            role: role,
            parts: parts,
          });
        }
      });

      // Add latest follow-up question
      const cleanFollowUp = (userQuestion || "").trim();
      if (formattedContents.length > 0 && formattedContents[formattedContents.length - 1].role === "user") {
        formattedContents[formattedContents.length - 1].parts.push({ text: cleanFollowUp || "Please guide me on this step." });
      } else {
        formattedContents.push({
          role: "user",
          parts: [{ text: cleanFollowUp || "Please guide me on this step." }],
        });
      }
    } else {
      // First turn
      formattedContents.push({
        role: "user",
        parts: [imagePart, textPart],
      });
    }

    // Generate content using fallback engine
    const response = await generateWithFallback({
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.6,
      },
    });

    res.json({
      text: response.text || "I processed the image but couldn't generate a guide. Can you upload a clearer photo?",
    });
  } catch (error: any) {
    console.error("Doubt Solver API Error:", error);
    res.json({
      text: "⚠️ **AI Doubt Solver (Offline)**: I had trouble connecting to the AI brain. Please make sure the image is clear, and try again in a moment!"
    });
  }
});

// Personalized recommendations based on weak areas
app.post("/api/recommend", async (req, res) => {
  try {
    const { profile } = req.body;
    const studentName = profile?.name || "Student";
    const learningPace = profile?.learningPace || "medium";
    const weakAreas = profile?.weakAreas || [];
    const strengthAreas = profile?.strengthAreas || [];

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        recommendation: "Please set up your `GEMINI_API_KEY` in the **Settings > Secrets** panel of AI Studio to unlock dynamic AI-powered Class 10 diagnostic booster recommendations!",
        suggestedQuizTopic: "General Quiz"
      });
    }

    if (weakAreas.length === 0) {
      return res.json({
        recommendation: `Awesome job, **${studentName}**! You don't have any specific weak areas registered yet. Take some Practice timed tests or Daily Quizzes under Mathematics, Science, Social Science, or English to evaluate your progress.`,
        suggestedQuizTopic: "General Quiz",
      });
    }

    const prompt = `Student Name: ${studentName}
Learning Pace: ${learningPace}
Weak Areas: ${weakAreas.join(", ")}
Strengths: ${strengthAreas.join(", ")}

Generate a highly tailored study recommendation summary for this Class 10 student. 
Specifically:
1. Structure a brief, 3-step action-oriented booster plan for their weakest area: ${weakAreas[0]}.
2. Write a 3-choice micro quick question (with correct answer specified) targeting ${weakAreas[0]} that they can solve right now. Formatting must be clear Markdown.
3. Suggest a topic for their next diagnostic timed test.`;

    const response = await generateWithFallback({
      contents: prompt,
      config: {
        systemInstruction: "You are a professional Class 10 academic advisor. Generate a highly specific diagnostic study recommendation. " +
          "IMPORTANT formatting guidelines: Do NOT use LaTeX math equations or symbols with dollar signs ($) or backslashes. " +
          "Instead, always use standard unicode mathematical characters (e.g., ∠A, ∠C, θ, α, β, √, ², ³, ±, °, ×, ÷, etc.) so " +
          "the text renders perfectly. Keep bullet lists simple with neat '-' or '*' symbols, avoiding doubled marks like '* *Action:*'.",
        temperature: 0.6,
      },
    });

    res.json({
      recommendation: response.text || "Please continue completing timed tests so we can evaluate your weak topics.",
    });
  } catch (error: any) {
    console.error("Recommendation System Error:", error);
    const weakAreas = req.body?.profile?.weakAreas || [];
    const targetTopic = (weakAreas && weakAreas.length > 0) ? weakAreas[0] : "General Mathematics & Science";
    const offlineRecommendation = `⚠️ **AI Tutor Note**: I'm currently running in offline revision mode due to high server traffic. But don't worry! Your learning progress is saved. Here is your Board Exam Booster recommendation:

### 🎯 Booster Action Plan for **${targetTopic}**:
1. **Formula Master**: Spend 10 minutes reviewing the critical concepts, diagrams, and reactions for **${targetTopic}** in your Subjects notes.
2. **Interactive Worksheet**: Attempt at least 20 board questions in the **Practice worksheet** section.
3. **Daily Drill**: Test your active recall under the Practice Timed Test tab to solidify your understanding.

Keep up the incredible studying momentum! You're doing amazing!`;

    res.json({
      recommendation: offlineRecommendation,
    });
  }
});

// Intelligent Exam Paper Assembly using Gemini Reasoning Engine
// Strict Rule: Gemini structures, filters, and selects from candidate IDs. It NEVER invents questions.
app.post("/api/assemble-paper", async (req, res) => {
  try {
    const { 
      subjectIds, 
      subjectNames, 
      totalMarks, 
      selectedChapterTitles, 
      difficulty, 
      candidateQuestions 
    } = req.body;

    if (!candidateQuestions || !Array.isArray(candidateQuestions) || candidateQuestions.length === 0) {
      return res.status(400).json({ error: "No candidate questions provided in search corpus." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ useFallback: true, message: "Gemini API key not configured, falling back to local assembly engine." });
    }

    const systemInstruction = `You are the Official Class 10 Examination Paper Assembly Reasoning Engine.
Your task is to review candidate questions from past official board examination papers and sample question papers, and intelligently assemble an authentic Class 10 examination paper matching exactly ${totalMarks} marks.

CRITICAL SYSTEM RESTRICTION:
- YOU MUST NEVER INVENT, WRITE, OR ALTER QUESTION TEXT.
- You must ONLY select from the provided candidate question IDs.
- The total sum of marks of your selected question IDs must equal ${totalMarks}.
- Do NOT select duplicate questions.
- Organize your selection into standard Board Examination Sections:
  * Section A: 1-mark questions (MCQs, Assertion-Reason)
  * Section B: 2-mark questions (Very Short Answer)
  * Section C: 3-mark questions (Short Answer)
  * Section D: 5-mark questions (Long Answer)
  * Section E: 4-mark questions (Case-based, Competency, Source-based)
  * Section F: Map-based questions (if applicable)
- Intelligently balance topics across the selected chapters.
- Maximize diversity across different years and sets.
- Return ONLY a valid JSON object matching the schema:
{
  "selectedQuestionIds": ["id1", "id2", ...],
  "reasoning": "Brief explanation of how the paper was balanced across chapters and years",
  "sectionAssignments": [
    {
      "sectionKey": "A",
      "questionIds": ["id1", ...]
    },
    ...
  ]
}`;

    const prompt = `Requested Subject(s): ${subjectNames?.join(", ") || "General"}
Target Marks: ${totalMarks}
Requested Difficulty: ${difficulty || "mixed"}
Selected Chapters: ${selectedChapterTitles?.join(", ") || "All"}

Candidate Questions Pool (${candidateQuestions.length} verified past-paper questions from corpus):
${JSON.stringify(candidateQuestions.map((q: any) => ({
  id: q.id,
  marks: q.marks,
  type: q.questionType,
  ch: q.chapterTitle,
  yr: q.year,
  set: q.setCode,
  diff: q.difficulty
})))}

Assemble the optimal examination paper matching ${totalMarks} marks using only eligible candidate IDs. Output pure JSON only.`;

    const response = await generateWithFallback({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    });

    let resultJson: any = {};
    try {
      resultJson = JSON.parse(response.text || "{}");
    } catch (e) {
      console.warn("Failed to parse Gemini assembly response JSON", e);
      return res.json({ useFallback: true });
    }

    res.json({
      success: true,
      selectedQuestionIds: resultJson.selectedQuestionIds || [],
      reasoning: resultJson.reasoning || "",
      sectionAssignments: resultJson.sectionAssignments || []
    });
  } catch (error: any) {
    console.error("Gemini Paper Assembly Error:", error);
    res.json({ useFallback: true, error: error.message });
  }
});

// Mount Vite middleware / static files based on active execution mode
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
