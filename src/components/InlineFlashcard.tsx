"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, X, RotateCcw } from "lucide-react";

type Flashcard = {
  front: string;
  back: string;
};

export function InlineFlashcard({ cards }: { cards: Flashcard[] }) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [direction, setDirection] = useState(0);
  const [mastered, setMastered] = useState<number[]>([]);

  const card = cards[current];
  const progress = ((current + 1) / cards.length) * 100;

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (current < cards.length - 1) {
      setFlipped(false); setDirection(1);
      setTimeout(() => setCurrent(i => i + 1), 120);
    }
  };
  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (current > 0) {
      setFlipped(false); setDirection(-1);
      setTimeout(() => setCurrent(i => i - 1), 120);
    }
  };
  const handleMastered = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMastered(m => m.includes(current) ? m : [...m, current]);
    if (current < cards.length - 1) goNext(e);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-peblo-purple">🃏 Flashcards</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded-full">
            ✓ {mastered.length}
          </span>
          <span className="text-[10px] font-bold text-foreground/40">{current + 1}/{cards.length}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-white/20 rounded-full mb-3 overflow-hidden">
        <motion.div className="h-full bg-gradient-to-r from-peblo-blue to-peblo-purple rounded-full"
          animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
      </div>

      {/* Card */}
      <AnimatePresence custom={direction} mode="wait">
        <motion.div key={current}
          custom={direction}
          initial={{ x: direction > 0 ? 60 : -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? -60 : 60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
          className="perspective-1000 w-full"
        >
          {/* Flip wrapper */}
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="relative w-full preserve-3d cursor-pointer"
            style={{ minHeight: 110 }}
            onClick={() => setFlipped(f => !f)}
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden glass-card rounded-2xl border border-white/40 flex flex-col items-center justify-center p-4 text-center min-h-[110px]">
              <p className="font-bold text-sm leading-snug">{card.front}</p>
              <div className="absolute bottom-2 flex items-center gap-1 text-[10px] text-foreground/30 font-medium">
                <RotateCcw size={10} /> tap to flip
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden glass-card rounded-2xl border border-peblo-blue/30 bg-gradient-to-br from-white/60 to-peblo-blue/10 dark:from-black/60 dark:to-peblo-blue/10 flex flex-col items-center justify-center p-4 text-center min-h-[110px]"
              style={{ transform: "rotateY(180deg)" }}>
              <p className="text-xs leading-relaxed text-foreground/80 font-medium">{card.back}</p>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center justify-between mt-3 gap-2">
        <button onClick={goPrev} disabled={current === 0}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border text-sm ${current === 0 ? "opacity-30 cursor-not-allowed bg-white/10 border-transparent" : "bg-white/50 dark:bg-black/30 border-white/30 hover:bg-peblo-purple/20 hover:border-peblo-purple/40"}`}>
          <ArrowLeft size={14} />
        </button>

        {/* Got it / Tricky */}
        {flipped && (
          <div className="flex gap-2 flex-1">
            <button onClick={e => { e.stopPropagation(); if (current < cards.length - 1) goNext(e); else setFlipped(false); }}
              className="flex-1 py-1.5 bg-yellow-400/20 text-yellow-700 dark:text-yellow-400 rounded-xl text-[11px] font-bold border border-yellow-300/40 flex items-center justify-center gap-1">
              <X size={11} /> Tricky
            </button>
            <button onClick={handleMastered}
              className="flex-1 py-1.5 bg-green-400/20 text-green-700 dark:text-green-400 rounded-xl text-[11px] font-bold border border-green-300/40 flex items-center justify-center gap-1">
              <Check size={11} /> Got it!
            </button>
          </div>
        )}

        <button onClick={goNext} disabled={current === cards.length - 1}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border text-sm ${current === cards.length - 1 ? "opacity-30 cursor-not-allowed bg-white/10 border-transparent" : "bg-white/50 dark:bg-black/30 border-white/30 hover:bg-peblo-purple/20 hover:border-peblo-purple/40"}`}>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
