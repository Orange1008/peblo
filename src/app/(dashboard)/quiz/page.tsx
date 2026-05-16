"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ArrowRight, Sparkles, Trophy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import confetti from "canvas-confetti";

const mockQuiz = [
  {
    question: "What do plants use to make their own food? 🌱",
    options: ["🍕 Pizza and cheese", "☀️ Sunlight and water", "🍦 Ice cream and milk", "🌙 Moonlight and juice"],
    correctAnswer: 1,
    explanation: "Plants are like little chefs! They use sunlight + water + air to cook their own food in a process called Photosynthesis! 🧑‍🍳✨",
    emoji: "🌿",
  },
  {
    question: "True or False: The Sun is actually a giant star! ⭐",
    options: ["✅ True!", "❌ False!"],
    correctAnswer: 0,
    explanation: "Absolutely true! The Sun is the closest star to Earth. It's SO huge that over 1 million Earths could fit inside it! 🤯",
    emoji: "☀️",
  },
  {
    question: "Which dinosaur had THREE horns on its head? 🦖",
    options: ["😤 T-Rex", "🦴 Stegosaurus", "🔱 Triceratops", "🏃 Velociraptor"],
    correctAnswer: 2,
    explanation: "The Triceratops used its three cool horns to fight off predators like a superhero! 🦸 It also had a huge bony shield on its head!",
    emoji: "🦕",
  },
  {
    question: "What is 7 × 8? 🧮",
    options: ["54", "56", "64", "48"],
    correctAnswer: 1,
    explanation: "7 × 8 = 56! Here's a trick: 7 × 7 = 49, then just add 7 more = 56! Easy peasy! 🎉",
    emoji: "⚡",
  },
];

export default function QuizPage() {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const q = mockQuiz[currentQuestion];
  const progress = ((currentQuestion + (isAnswered ? 1 : 0)) / mockQuiz.length) * 100;

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    const correct = index === q.correctAnswer;
    if (correct) {
      setScore(s => s + 1);
      toast({ title: "🎉 Correct! Amazing!", description: "+10 XP earned! You're on fire! 🔥" });
    } else {
      toast({ title: "❌ Not quite!", description: "Check the explanation below to learn more! 📚" });
    }
  };

  const handleNext = () => {
    if (currentQuestion < mockQuiz.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      (confetti as any)?.({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setQuizFinished(false);
    setIsAnswered(false);
    setSelectedOption(null);
  };

  const percentage = Math.round((score / mockQuiz.length) * 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] pb-10 px-2">

      {/* Header */}
      <div className="w-full max-w-2xl mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-4xl">🎮</div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Fun Quiz Time!</h1>
            <p className="text-sm text-foreground/55 font-medium">Answer correctly to earn XP ⚡</p>
          </div>
        </div>
        {!quizFinished && (
          <div className="flex flex-col items-end gap-1">
            <span className="font-bold text-peblo-purple text-sm">Question {currentQuestion + 1} of {mockQuiz.length}</span>
            <div className="w-32 h-3 bg-white/30 dark:bg-black/30 rounded-full overflow-hidden border border-white/20">
              <motion.div className="h-full bg-gradient-to-r from-peblo-purple to-peblo-pink" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
            </div>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!quizFinished ? (
          <motion.div
            key={currentQuestion}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-2xl glass-card rounded-[2.5rem] p-8 md:p-10 border border-white/40 shadow-2xl relative overflow-hidden"
          >
            {/* decorative glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-peblo-purple/10 rounded-full blur-3xl" />

            {/* Question emoji */}
            <div className="text-6xl text-center mb-4">{q.emoji}</div>

            <h2 className="text-xl md:text-2xl font-heading font-bold text-center mb-8 leading-tight">
              {q.question}
            </h2>

            <div className="space-y-3">
              {q.options.map((option, i) => {
                const isSelected = selectedOption === i;
                const isCorrect = i === q.correctAnswer;
                let cls = "bg-white/50 dark:bg-white/5 border-white/40 hover:bg-white/80 hover:border-peblo-purple/40 hover:scale-[1.02]";
                if (isAnswered) {
                  if (isCorrect) cls = "bg-green-400/20 border-green-400/60 text-green-700 dark:text-green-300 scale-[1.01] shadow-green-200/50 shadow-lg";
                  else if (isSelected) cls = "bg-red-400/20 border-red-400/60 text-red-700 dark:text-red-300";
                  else cls = "bg-white/20 border-transparent opacity-40";
                }

                return (
                  <motion.button
                    key={i}
                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                    onClick={() => handleSelect(i)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-2xl border-2 text-left font-bold transition-all duration-200 flex items-center justify-between gap-3 ${cls}`}
                  >
                    <span className="text-base">{option}</span>
                    {isAnswered && isCorrect && <Check className="text-green-500 shrink-0" size={22} />}
                    {isAnswered && isSelected && !isCorrect && <X className="text-red-500 shrink-0" size={22} />}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: 10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  className="mt-6"
                >
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-peblo-blue/10 to-peblo-purple/10 border border-peblo-blue/20">
                    <div className="flex items-center gap-2 font-bold text-peblo-purple mb-1 text-sm">
                      <Sparkles size={15} /> Peblo says:
                    </div>
                    <p className="text-sm text-foreground/75 leading-relaxed font-medium">{q.explanation}</p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNext}
                      className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-peblo-purple to-peblo-pink text-white rounded-2xl font-bold shadow-lg hover:shadow-peblo-purple/30"
                    >
                      {currentQuestion < mockQuiz.length - 1 ? "Next Question 👉" : "See Results 🏆"} <ArrowRight size={18} />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Results Screen */
          <motion.div
            key="results"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-xl glass-card rounded-[3rem] p-12 border border-white/40 shadow-2xl text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-peblo-purple/10 via-transparent to-peblo-pink/10 animate-pulse" />
            <div className="text-8xl mb-4">{percentage >= 75 ? "🏆" : percentage >= 50 ? "⭐" : "💪"}</div>
            <h2 className="text-4xl font-heading font-bold mb-2 relative z-10">
              {percentage >= 75 ? "Amazing job!" : percentage >= 50 ? "Pretty good!" : "Keep going!"}
            </h2>
            <p className="text-6xl font-heading font-bold gradient-text my-4">{score}/{mockQuiz.length}</p>
            <p className="text-foreground/60 font-medium mb-2">You scored {percentage}%!</p>
            <p className="text-peblo-purple font-bold mb-8">+{score * 10} XP earned! ⚡</p>

            <div className="flex gap-3 justify-center relative z-10">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={handleRestart} className="px-6 py-3 bg-white/60 dark:bg-white/10 border-2 border-white/50 rounded-2xl font-bold hover:bg-white/80 transition-colors">
                🔄 Try Again
              </motion.button>
              <Link href="/notes">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="px-6 py-3 bg-gradient-to-r from-peblo-purple to-peblo-pink text-white rounded-2xl font-bold shadow-lg">
                  📚 Back to Notes
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
