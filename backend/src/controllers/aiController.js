const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are Peblo Buddy 🤖 — a friendly, enthusiastic AI tutor for kids aged 8-16.
Your tone is playful, encouraging, and uses simple language with emojis.
When generating JSON (quizzes/flashcards) respond ONLY with valid JSON, no markdown.`;

// Helper: call Groq
async function askGroq(userPrompt, jsonMode = false) {
  const resp = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user",   content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: jsonMode ? 1500 : 800,
  });
  return resp.choices[0]?.message?.content?.trim() || "";
}

// ── POST /api/ai ──────────────────────────────────
exports.aiAction = async (req, res, next) => {
  try {
    const { type, content = "", userMessage = "" } = req.body;
    if (!type) return res.status(400).json({ error: "type is required" });

    let text = "";
    let parsed = null;

    switch (type) {

      case "summarize":
        text = await askGroq(
          `Summarize this in 5 fun bullet points a kid would love:\n\n${content}`
        );
        break;

      case "explain":
        text = await askGroq(
          `Explain this like I'm 10 years old, using analogies and emojis:\n\n${content}`
        );
        break;

      case "quiz":
        const quizRaw = await askGroq(
          `Create exactly 4 multiple-choice quiz questions from this content.
Return ONLY a JSON array, each item: { "question": "", "options": ["","","",""], "correctAnswer": 0, "explanation": "" }.
Content:\n${content}`,
          true
        );
        try { parsed = JSON.parse(quizRaw); } catch { parsed = []; }
        text = parsed?.length ? "" : "Sorry, couldn't generate a quiz this time!";
        break;

      case "flashcards":
        const fcRaw = await askGroq(
          `Create exactly 5 flashcards from this content.
Return ONLY a JSON array, each item: { "front": "term/question", "back": "explanation" }.
Content:\n${content}`,
          true
        );
        try { parsed = JSON.parse(fcRaw); } catch { parsed = []; }
        text = parsed?.length ? "" : "Sorry, couldn't generate flashcards this time!";
        break;

      case "chat":
        text = await askGroq(userMessage || content);
        break;

      default:
        return res.status(400).json({ error: `Unknown type: ${type}` });
    }

    res.json({ text, parsed });
  } catch (err) {
    console.error("AI error:", err.message);
    if (err.status === 429) {
      return res.status(429).json({ error: "AI is busy — try again in a moment! ⏳" });
    }
    next(err);
  }
};
