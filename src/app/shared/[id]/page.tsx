"use client";

import { motion } from "framer-motion";
import { Sparkles, Moon, Sun, Copy, Share2, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function SharedNotePage({ params }: { params: { id: string } }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen pb-20 relative selection:bg-peblo-purple/30">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-peblo-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-peblo-pink/10 rounded-full blur-3xl" />
      </div>

      {/* Floating Topbar */}
      <div className="sticky top-4 z-50 px-4 max-w-4xl mx-auto">
        <div className="glass-card rounded-2xl px-6 py-3 flex items-center justify-between shadow-lg border border-white/20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-peblo-purple p-1.5 rounded-lg text-white">
              <Sparkles size={16} />
            </div>
            <span className="font-heading font-bold tracking-tight">Peblo</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-foreground/60 hover:text-foreground hover:bg-white/20 rounded-lg transition-colors">
              <Copy size={18} />
            </button>
            <button className="p-2 text-foreground/60 hover:text-foreground hover:bg-white/20 rounded-lg transition-colors">
              <Share2 size={18} />
            </button>
            <div className="w-px h-6 bg-border mx-1"></div>
            <button onClick={toggleDarkMode} className="p-2 text-foreground/60 hover:text-peblo-purple hover:bg-white/20 rounded-lg transition-colors">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link href="/signup">
              <button className="ml-2 px-4 py-2 bg-foreground text-background text-sm font-bold rounded-xl hover:opacity-90">
                Save to my workspace
              </button>
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto mt-16 px-6 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex gap-2 mb-6">
            <span className="px-3 py-1 bg-peblo-purple/10 text-peblo-purple rounded-full text-xs font-bold">Physics</span>
            <span className="px-3 py-1 bg-peblo-blue/10 text-peblo-blue rounded-full text-xs font-bold">Quantum Mechanics</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-heading font-bold leading-tight mb-6 text-balance">
            Understanding Quantum Entanglement: Spooky Action at a Distance
          </h1>
          
          <div className="flex items-center justify-between py-6 border-y border-white/10">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-white/20">
                <AvatarImage src="https://i.pravatar.cc/150?img=11" />
                <AvatarFallback>AW</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-sm">Alex Walker</p>
                <p className="text-xs text-foreground/50">Updated Oct 24, 2026 • 5 min read</p>
              </div>
            </div>
            
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-peblo-pink/10 text-peblo-pink hover:bg-peblo-pink/20 rounded-xl transition-colors font-medium text-sm">
              <Heart size={16} /> 245
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.article 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg dark:prose-invert prose-p:leading-relaxed prose-headings:font-heading prose-a:text-peblo-purple max-w-none"
        >
          <p className="text-xl text-foreground/80 font-medium">
            Quantum entanglement is one of the most bizarre and fascinating phenomena in physics. It occurs when pairs or groups of particles are generated, interact, or share spatial proximity in ways such that the quantum state of each particle cannot be described independently of the state of the others, even when the particles are separated by a large distance.
          </p>
          
          <div className="my-10 p-6 glass-card rounded-2xl border border-peblo-purple/20 bg-peblo-purple/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={64}/></div>
            <h3 className="flex items-center gap-2 text-peblo-purple font-bold m-0 mb-2">
              <Sparkles size={20} /> AI Summary
            </h3>
            <p className="m-0 text-foreground/80">
              Imagine two magic coins! If you flip one in New York and it lands on Heads, the other one in Tokyo instantly lands on Heads too! They are "entangled" and connected, no matter how far apart they are.
            </p>
          </div>

          <h2>The EPR Paradox</h2>
          <p>
            In 1935, Albert Einstein, Boris Podolsky, and Nathan Rosen formulated the EPR paradox to argue that quantum mechanics was not a complete theory. They proposed that there must be "hidden variables" determining the outcome of measurements that we just couldn't see.
          </p>

          <blockquote>
            "I cannot seriously believe in it because the theory cannot be reconciled with the idea that physics should represent a reality in time and space, free from spooky actions at a distance." — Albert Einstein
          </blockquote>

          <h2>Bell's Theorem</h2>
          <p>
            In 1964, John Stewart Bell proved that quantum mechanics is incompatible with local hidden-variable theories. His theorem showed that if the universe worked the way Einstein suggested (with local hidden variables), the correlations between measurements of entangled particles would have a strict mathematical limit. 
          </p>
          
          <p>
            Experiments have consistently shown that quantum systems violate these limits, proving that the "spooky action" is a real feature of our universe!
          </p>
        </motion.article>
        
        {/* Footer CTA */}
        <div className="mt-16 pt-10 border-t border-white/10 text-center">
          <div className="inline-block p-8 glass-card rounded-3xl">
            <h3 className="text-2xl font-heading font-bold mb-3">Want to learn like Alex?</h3>
            <p className="text-foreground/60 mb-6 max-w-sm mx-auto">Create your own magical AI workspace to study faster and smarter.</p>
            <Link href="/signup">
              <button className="px-8 py-3 bg-gradient-to-r from-peblo-purple to-peblo-pink text-white font-bold rounded-xl shadow-lg hover:shadow-peblo-purple/40 hover:-translate-y-0.5 transition-all">
                Get Started for Free
              </button>
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
