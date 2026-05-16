"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ArrowRight, Sparkles } from "lucide-react";

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export function InlineQuiz({ questions }: { questions: QuizQuestion[] }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[current];

  const handleSelect = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === q.correctAnswer) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setDone(true);
    }
  };

  const handleRestart = () => {
    setCurrent(0); setSelected(null); setAnswered(false); setScore(0); setDone(false);
  };

  const pct = Math.round((score / questions.length) * 100);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-peblo-purple flex items-center gap-1">
          🎮 Mini Quiz
        </span>
        <span className="text-[10px] font-bold text-foreground/40">
          {!done ? `${current + 1}/${questions.length}` : `${score}/${questions.length} correct`}
        </span>
      </div>

      {/* Progress bar */}
      {!done && (
        <div className="w-full h-1.5 bg-white/20 rounded-full mb-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-peblo-purple to-peblo-pink rounded-full"
            animate={{ width: `${((current + (answered ? 1 : 0)) / questions.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key={current} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
            {/* Question */}
            <p className="text-sm font-bold mb-3 leading-snug">{q.question}</p>

            {/* Options */}
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const isCorrect = i === q.correctAnswer;
                const isSelected = selected === i;
                let cls = "bg-white/40 dark:bg-white/5 border-white/30 hover:bg-peblo-purple/10 hover:border-peblo-purple/30";
                if (answered) {
                  if (isCorrect) cls = "bg-green-400/20 border-green-400/60 text-green-700 dark:text-green-300";
                  else if (isSelected) cls = "bg-red-400/20 border-red-400/60 text-red-600 dark:text-red-300";
                  else cls = "opacity-40 border-transparent bg-white/10";
                }
                return (
                  <button key={i} onClick={() => handleSelect(i)} disabled={answered}
                    className={`w-full text-left px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-between gap-2 ${cls}`}>
                    <span>{opt}</span>
                    {answered && isCorrect && <Check size={12} className="text-green-500 shrink-0" />}
                    {answered && isSelected && !isCorrect && <X size={12} className="text-red-500 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {answered && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
                <div className="p-2.5 rounded-xl bg-peblo-blue/10 border border-peblo-blue/20 text-[11px] leading-relaxed text-foreground/70">
                  <span className="font-bold text-peblo-purple">Peblo: </span>{q.explanation}
                </div>
                <button onClick={handleNext}
                  className="w-full mt-2 py-2 bg-gradient-to-r from-peblo-purple to-peblo-pink text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1">
                  {current < questions.length - 1 ? "Next" : "See Results 🏆"} <ArrowRight size={12} />
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-2">
            <div className="text-4xl mb-2">{pct >= 75 ? "🏆" : pct >= 50 ? "⭐" : "💪"}</div>
            <p className="font-bold text-sm">{pct >= 75 ? "Amazing!" : pct >= 50 ? "Good job!" : "Keep going!"}</p>
            <p className="text-xl font-heading font-bold gradient-text my-1">{score}/{questions.length}</p>
            <p className="text-[10px] text-foreground/50 mb-3">+{score * 10} XP earned! ⚡</p>
            <button onClick={handleRestart}
              className="px-4 py-2 bg-white/50 dark:bg-white/10 border border-white/30 rounded-xl text-xs font-bold hover:bg-white/70 transition-colors">
              🔄 Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
