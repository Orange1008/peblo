"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Note, SEED_NOTES } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Lock, ExternalLink } from "lucide-react";

const STORAGE_KEY = "peblo_notes_v2";

export default function SharePage() {
  const params = useParams();
  const shareId = params?.shareId as string;
  const [note, setNote] = useState<Note | null | "loading">("loading");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const allNotes: Note[] = raw ? JSON.parse(raw) : SEED_NOTES;
      const found = allNotes.find(n => n.shareId === shareId);
      if (found && found.shared) {
        setNote(found);
      } else {
        setNote(null);
      }
    } catch {
      setNote(null);
    }
  }, [shareId]);

  if (note === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <Sparkles size={40} className="text-peblo-purple" />
        </motion.div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <div className="text-7xl mb-4">🔒</div>
        <h1 className="text-3xl font-heading font-bold mb-3">Note not found</h1>
        <p className="text-foreground/60 max-w-sm mb-8 font-medium">
          This note is private or the link has expired. Ask the owner to share it again!
        </p>
        <Link href="/">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-peblo-purple to-peblo-pink text-white rounded-2xl font-bold shadow-lg flex items-center gap-2">
            <Sparkles size={18} /> Go to Peblo AI
          </motion.button>
        </Link>
      </div>
    );
  }

  const updatedDate = new Date(note.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Shared background blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-peblo-purple/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-peblo-pink/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob pointer-events-none" />

      {/* Header bar */}
      <header className="sticky top-0 z-50 bg-white/60 dark:bg-black/60 backdrop-blur-md border-b border-white/20">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-peblo-purple to-peblo-pink p-2 rounded-xl text-white shadow-md group-hover:-rotate-12 transition-transform">
              <Sparkles size={20} />
            </div>
            <span className="font-heading font-bold text-xl">Peblo AI</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-full border border-green-200/50">
            🔓 Public Note
          </div>
        </div>
      </header>

      {/* Note content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          {/* Meta: folder + tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1.5 bg-peblo-purple/10 text-peblo-purple border border-peblo-purple/20 rounded-full text-xs font-bold">
              {note.emoji} {note.folder}
            </span>
            {note.tags.map(tag => (
              <span key={tag} className="px-3 py-1.5 bg-peblo-pink/10 text-peblo-pink border border-peblo-pink/20 rounded-full text-xs font-bold">
                #{tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 leading-tight">
            {note.title}
          </h1>

          {/* Author + date row */}
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/20">
            <div className="w-12 h-12 rounded-full bg-white shadow-md overflow-hidden border-2 border-white">
              <Image src="https://api.dicebear.com/7.x/adventurer/svg?seed=Alex" alt="Author" width={48} height={48} />
            </div>
            <div>
              <p className="font-bold">Alex Explorer</p>
              <p className="text-sm text-foreground/50">Last updated {updatedDate}</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose max-w-none">
            <div className="text-foreground/80 leading-loose text-lg font-medium whitespace-pre-wrap">
              {note.content || <span className="text-foreground/30 italic">This note has no content yet.</span>}
            </div>
          </div>
        </motion.div>

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 glass-card rounded-3xl p-8 border border-white/40 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-peblo-purple/10 to-peblo-pink/10 -z-10" />
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-2xl font-heading font-bold mb-2">Want to make notes like this?</h2>
          <p className="text-foreground/60 font-medium mb-6">
            Join Peblo AI for free and start your own learning adventure with AI-powered notes, quizzes, and more!
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/signup">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 bg-gradient-to-r from-peblo-purple to-peblo-pink text-white rounded-2xl font-bold shadow-lg flex items-center gap-2">
                <Sparkles size={18} /> Join Free! 🎉
              </motion.button>
            </Link>
            <Link href="/login">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 bg-white/60 dark:bg-black/30 border-2 border-white/40 rounded-2xl font-bold flex items-center gap-2">
                <ExternalLink size={16} /> Log In
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Privacy notice */}
        <div className="mt-6 flex items-center gap-2 text-xs text-foreground/40 font-medium justify-center">
          <Lock size={12} /> This is a publicly shared note from Peblo AI
        </div>
      </main>
    </div>
  );
}
