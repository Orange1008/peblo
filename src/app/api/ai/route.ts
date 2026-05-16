import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// System prompt - fun, kid-friendly AI tutor
const SYSTEM_PROMPT = `You are Peblo Buddy, a fun and friendly AI study assistant designed for kids aged 10-15. 
Your personality:
- Always enthusiastic and encouraging 🌟
- Explain things simply using fun analogies, comparisons, and examples from everyday life
- Use emojis to make responses lively and engaging
- Keep responses concise but complete (2-4 short paragraphs max)
- Celebrate correct thinking and gently correct mistakes
- Never use complex academic jargon without immediately explaining it in simple words
- Make learning feel like a fun adventure!`;

type ActionType = "chat" | "summarize" | "explain" | "quiz" | "flashcards";

function buildPrompt(type: ActionType, content: string, userMessage?: string): string {
  switch (type) {
    case "chat":
      return userMessage || "Hello!";

    case "summarize":
      return `Please summarize the following note in a fun, easy-to-understand way for a student. Use bullet points and emojis. Keep it short (5 bullet points max):\n\n${content}`;

    case "explain":
      return `Explain the following note content as if you're talking to a curious 10-year-old. Use a fun analogy or real-world example. Make it exciting!\n\n${content}`;

    case "quiz":
      return `Based on this note, create 3 fun multiple-choice quiz questions. Format as JSON array like this:
[
  {
    "question": "Question text here? 🤔",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Why this is correct, explained simply! ✨"
  }
]
Only respond with the JSON array, nothing else.

Note content:
${content}`;

    case "flashcards":
      return `Based on this note, create 4 flashcard pairs. Format as JSON array:
[
  { "front": "Term or concept", "back": "Simple, fun explanation with emoji" }
]
Only respond with the JSON array, nothing else.

Note content:
${content}`;

    default:
      return content;
  }
}

export async function POST(req: NextRequest) {
  // Lazy-init Groq so a missing key gives a clean error, not a module crash
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "AI is not configured yet. Please add GROQ_API_KEY to .env.local" },
      { status: 503 }
    );
  }
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  try {
    const { type, content, userMessage } = await req.json() as {
      type: ActionType;
      content?: string;
      userMessage?: string;
    };

    if (!type) {
      return NextResponse.json({ error: "Missing type" }, { status: 400 });
    }

    const userPrompt = buildPrompt(type, content || "", userMessage);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const text = completion.choices[0]?.message?.content || "Hmm, I couldn't think of anything! Try again 🤔";

    // For quiz and flashcards, try to parse JSON
    if (type === "quiz" || type === "flashcards") {
      try {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        return NextResponse.json({ text, parsed, type });
      } catch {
        return NextResponse.json({ text, parsed: null, type });
      }
    }

    return NextResponse.json({ text, type });
  } catch (err: any) {
    console.error("Groq API error:", err);
    return NextResponse.json(
      { error: err?.message || "AI request failed" },
      { status: 500 }
    );
  }
}
