"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw, Check, X, Shuffle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const cards = [
  { id: 1, emoji: "🔬", category: "Science Magic", front: "Mitochondria", back: "The powerhouse of the cell! 💪 It makes energy (ATP) so the cell can do its job — like a tiny battery inside your body!" },
  { id: 2, emoji: "🌱", category: "Science Magic", front: "Photosynthesis", back: "The magical way plants cook their own food! ☀️ + 💧 + 💨 = 🍬 (sugar for the plant) + 🌬️ (oxygen for us!)" },
  { id: 3, emoji: "🌍", category: "History Quest", front: "Magna Carta (1215)", back: "A super important document signed by King John that said even KINGS have to follow rules! It was one of the first steps toward rights for everyone! 👑" },
  { id: 4, emoji: "💻", category: "Coding 101", front: "What is a Loop?", back: "A loop is like telling a robot: 'Keep doing this until I say stop!' 🤖 For example: tie your shoes 10 times. The 'tie shoes' part is the loop!" },
  { id: 5, emoji: "🧮", category: "Math Wizard", front: "What is Pi (π)?", back: "Pi is about 3.14! 🥧 It's the magic number you get when you divide a circle's distance around it by its width. It goes on forever!" },
];

export default function FlashcardsPage() {
  const { toast } = useToast();
  const [deck, setDeck] = useState(cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);
  const [mastered, setMastered] = useState<number[]>([]);
  const [reviewing, setReviewing] = useState<number[]>([]);

  const current = deck[currentIndex];
  const progress = ((currentIndex + 1) / deck.length) * 100;

  const goNext = () => {
    if (currentIndex < deck.length - 1) {
      setIsFlipped(false); setDirection(1);
      setTimeout(() => setCurrentIndex(i => i + 1), 150);
    }
  };
  const goPrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false); setDirection(-1);
      setTimeout(() => setCurrentIndex(i => i - 1), 150);
    }
  };

  const handleMastered = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMastered(m => [...m, current.id]);
    toast({ title: "🏆 Mastered!", description: `"${current.front}" added to your wins! +5 XP ⚡` });
    goNext();
  };
  const handleReview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReviewing(r => [...r, current.id]);
    toast({ title: "📌 Marked for review!", description: "You'll see this card again soon!" });
    goNext();
  };

  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled); setCurrentIndex(0); setIsFlipped(false);
    toast({ title: "🔀 Shuffled!", description: "Cards are mixed up — let's go!" });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-140px)] pb-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">🃏</div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Speed Flashcards!</h1>
            <p className="text-sm text-foreground/55 font-medium">Flip, learn, and become a master! ⚡</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Stats */}
          <div className="flex gap-2">
            <span className="flex items-center gap-1 text-xs font-bold bg-green-400/15 text-green-600 px-3 py-1.5 rounded-full border border-green-300/40">
              <Check size={12} /> {mastered.length} Mastered
            </span>
            <span className="flex items-center gap-1 text-xs font-bold bg-yellow-400/15 text-yellow-600 px-3 py-1.5 rounded-full border border-yellow-300/40">
              📌 {reviewing.length} Review
            </span>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleShuffle} className="p-2.5 bg-white/50 dark:bg-black/40 border border-white/30 rounded-xl hover:bg-peblo-purple/10 hover:border-peblo-purple/30 transition-all shadow-sm">
            <Shuffle size={18} className="text-peblo-purple" />
          </motion.button>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full max-w-2xl mx-auto mb-8">
        <div className="flex justify-between text-xs font-bold text-foreground/55 mb-2">
          <span>Card {currentIndex + 1} of {deck.length}</span>
          <span>{Math.round(progress)}% through the deck 🎯</span>
        </div>
        <div className="w-full h-3 bg-white/20 dark:bg-black/20 rounded-full overflow-hidden border border-white/20">
          <motion.div className="h-full bg-gradient-to-r from-peblo-blue to-peblo-purple rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl perspective-1000">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ x: direction > 0 ? 200 : -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -200 : 200, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="w-full"
            >
              <motion.div
                className="w-full aspect-[4/3] relative cursor-pointer preserve-3d transition-all duration-500"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden glass-card rounded-[3rem] flex flex-col items-center justify-center text-center p-10 shadow-2xl border-2 border-white/50 dark:border-white/10 hover:shadow-peblo-purple/20 hover:border-peblo-purple/30 transition-all">
                  <div className="absolute top-6 left-8">
                    <span className="px-3 py-1.5 bg-peblo-purple/10 text-peblo-purple rounded-full text-xs font-bold">{current.emoji} {current.category}</span>
                  </div>
                  <div className="text-5xl mb-4">{current.emoji}</div>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold">{current.front}</h2>
                  <div className="absolute bottom-6 flex items-center gap-2 text-foreground/35 text-sm font-medium">
                    <RotateCcw size={15} /> Tap to flip!
                  </div>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 backface-hidden glass-card rounded-[3rem] flex flex-col items-center justify-center text-center p-10 shadow-2xl border-2 border-peblo-blue/30 bg-gradient-to-br from-white/70 to-peblo-blue/10 dark:from-black/60 dark:to-peblo-blue/10"
                  style={{ transform: "rotateY(180deg)" }}
                >
                  <div className="absolute top-6 left-8">
                    <span className="px-3 py-1.5 bg-peblo-blue/10 text-peblo-blue rounded-full text-xs font-bold">✅ Answer</span>
                  </div>
                  <p className="text-lg md:text-xl text-foreground/80 leading-relaxed font-medium max-w-md">{current.back}</p>
                  <div className="absolute bottom-6 flex gap-4 w-full justify-center px-10">
                    <motion.button whileTap={{ scale: 0.95 }} onClick={handleReview} className="flex-1 max-w-[140px] py-3 bg-yellow-400/20 text-yellow-700 dark:text-yellow-400 rounded-2xl font-bold border-2 border-yellow-300/40 hover:bg-yellow-400/30 transition-colors flex items-center justify-center gap-2">
                      <X size={16} /> Tricky 🤔
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={handleMastered} className="flex-1 max-w-[140px] py-3 bg-green-400/20 text-green-700 dark:text-green-400 rounded-2xl font-bold border-2 border-green-300/40 hover:bg-green-400/30 transition-colors flex items-center justify-center gap-2">
                      <Check size={16} /> Got it! 🎉
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav controls */}
        <div className="flex items-center gap-6 mt-8">
          <motion.button whileTap={{ scale: 0.9 }} onClick={goPrev} disabled={currentIndex === 0} className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl transition-all shadow-md ${currentIndex === 0 ? "opacity-30 cursor-not-allowed bg-white/20" : "bg-white/60 dark:bg-black/40 hover:bg-peblo-purple hover:text-white border border-white/30"}`}>
            <ArrowLeft size={22} />
          </motion.button>

          <div className="text-center">
            <div className="text-xl font-heading font-bold">{currentIndex + 1} / {deck.length}</div>
            <div className="text-xs text-foreground/50 font-medium">tap card to flip</div>
          </div>

          <motion.button whileTap={{ scale: 0.9 }} onClick={goNext} disabled={currentIndex === deck.length - 1} className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl transition-all shadow-md ${currentIndex === deck.length - 1 ? "opacity-30 cursor-not-allowed bg-white/20" : "bg-white/60 dark:bg-black/40 hover:bg-peblo-purple hover:text-white border border-white/30"}`}>
            <ArrowRight size={22} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
