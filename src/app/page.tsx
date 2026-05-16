"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import { Sparkles, Zap, Brain, Star, Rocket, Trophy, BookOpen, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

const bounce = {
  animate: { y: [0, -12, 0] },
  transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
};

export default function Home() {
  const { toast } = useToast();

  return (
    <main className="min-h-screen overflow-x-hidden">
      <FloatingNavbar />

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-36">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left text */}
            <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              {/* Badge */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-peblo-pink/20 text-peblo-pink font-bold mb-6 border border-peblo-pink/30 text-sm shadow-md"
              >
                <Star size={16} className="fill-peblo-pink" /> Super-powered learning for kids!
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-6 leading-tight">
                Learning is{" "}
                <span className="gradient-text">way more fun</span>{" "}
                with a buddy! 🚀
              </h1>

              <p className="text-xl text-foreground/70 mb-8 max-w-lg leading-relaxed font-medium">
                Take magic notes 📝, crush fun quizzes 🎮, earn XP ⚡, and chat with your personal AI buddy — all in one awesome place!
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="h-16 px-10 w-full sm:w-auto text-xl bg-gradient-to-r from-peblo-purple to-peblo-pink text-white rounded-2xl shadow-xl font-bold border-0">
                      🎉 Start for Free!
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/login">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" variant="outline" className="h-16 px-10 w-full sm:w-auto text-xl rounded-2xl border-2 border-peblo-purple text-peblo-purple font-bold bg-white/60 backdrop-blur-sm">
                      🔓 Log In
                    </Button>
                  </motion.div>
                </Link>
              </div>

              {/* Social proof */}
              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[11, 12, 13, 14].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                      <Image src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${i}`} alt="Kid" width={48} height={48} />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5 text-yellow-400 text-lg">{"★★★★★"}</div>
                  <p className="text-sm font-bold text-foreground/70">10,000+ happy young learners! 🌟</p>
                </div>
              </div>
            </motion.div>

            {/* Right mascot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative flex justify-center items-center h-[400px] md:h-[500px] mt-8 md:mt-0"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-peblo-blue/30 to-peblo-pink/30 rounded-full filter blur-[80px] animate-pulse" />
              <motion.div {...bounce} className="relative z-10 w-full h-full max-w-md">
                <Image src="/ai_mascot.png" alt="Peblo AI Buddy" fill className="object-contain drop-shadow-2xl" priority />
              </motion.div>
              {/* Floating bubbles */}
              {[
                { emoji: "📝", top: "10%", left: "5%", delay: 0 },
                { emoji: "🏆", top: "20%", right: "5%", delay: 0.5 },
                { emoji: "⚡", bottom: "20%", left: "8%", delay: 1 },
                { emoji: "🎮", bottom: "10%", right: "10%", delay: 1.5 },
              ].map((b, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: b.delay }}
                  className="absolute text-3xl bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-xl border border-white/60"
                  style={{ top: b.top, left: b.left, right: (b as any).right, bottom: b.bottom }}
                >
                  {b.emoji}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <section id="features" className="py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-heading font-bold mb-4"
            >
              What can you do? 🤩
            </motion.h2>
            <p className="text-xl text-foreground/60 font-medium">Loads of cool stuff packed in one magical place!</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: "🪄", title: "Magic Summaries", desc: "Turn boring long reading into bite-sized fun facts in seconds!", color: "from-peblo-purple/20 to-purple-200/30", border: "border-peblo-purple/30", link: "/notes" },
              { emoji: "🎮", title: "Fun Quizzes", desc: "Test your brain power with super cool quizzes made just for you!", color: "from-peblo-pink/20 to-pink-200/30", border: "border-peblo-pink/30", link: "/quiz" },
              { emoji: "⚡", title: "Speed Flashcards", desc: "Swipe through cards and memorize things lightning fast!", color: "from-peblo-blue/20 to-blue-200/30", border: "border-peblo-blue/30", link: "/flashcards" },
              { emoji: "🤖", title: "AI Buddy Chat", desc: "Ask your buddy anything and get answers in plain simple language!", color: "from-yellow-200/30 to-orange-200/30", border: "border-yellow-300/40", link: "/notes" },
              { emoji: "🏆", title: "Earn XP & Badges", desc: "Level up, earn rewards, and show off your learning streak!", color: "from-green-200/30 to-teal-200/30", border: "border-green-300/40", link: "/dashboard" },
              { emoji: "👯", title: "Study With Friends", desc: "Share notes and challenge your pals to beat your quiz score!", color: "from-peblo-pink/20 to-peblo-blue/20", border: "border-peblo-pink/30", link: "/dashboard" },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -8, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link href={f.link}>
                  <div className={`glass-card rounded-3xl p-8 border ${f.border} bg-gradient-to-br ${f.color} cursor-pointer h-full`}>
                    <div className="text-5xl mb-4">{f.emoji}</div>
                    <h3 className="text-xl font-heading font-bold mb-2">{f.title}</h3>
                    <p className="text-foreground/65 font-medium leading-relaxed">{f.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold text-center mb-16"
          >
            How it works 🛸
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-10 text-center">
            {[
              { step: "1", emoji: "🎒", title: "Pack Your Backpack", desc: "Create an account and add your subjects — it only takes 30 seconds!" },
              { step: "2", emoji: "🤖", title: "Chat With Your Buddy", desc: "Ask questions, get summaries, generate quizzes — your buddy does the heavy lifting!" },
              { step: "3", emoji: "🏆", title: "Level Up!", desc: "Earn XP, unlock badges, and watch your knowledge grow every single day!" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card rounded-3xl p-8 border border-white/40 relative overflow-hidden"
              >
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-peblo-purple/10 rounded-full blur-2xl" />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-peblo-purple to-peblo-pink flex items-center justify-center text-white text-2xl font-bold shadow-lg mx-auto mb-4">
                  {s.step}
                </div>
                <div className="text-5xl mb-4">{s.emoji}</div>
                <h3 className="text-xl font-heading font-bold mb-2">{s.title}</h3>
                <p className="text-foreground/65 font-medium leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI BUDDY CHAT DEMO ── */}
      <section id="meet-ai" className="py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Chat mockup */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-[2.5rem] p-6 border border-white/50 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/20">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-peblo-purple to-peblo-pink flex items-center justify-center shadow-lg text-2xl">🤖</div>
                <div>
                  <p className="font-bold text-peblo-purple">Peblo Buddy</p>
                  <p className="text-xs text-green-500 font-medium">● Online & ready!</p>
                </div>
              </div>
              <div className="space-y-4 min-h-[250px]">
                <div className="self-end bg-peblo-purple text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[80%] ml-auto shadow text-sm font-medium">
                  I don&apos;t understand fractions 😢
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-white/70 dark:bg-black/50 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow border border-white/40 text-sm"
                >
                  <p className="font-medium text-peblo-purple mb-1 text-xs">Peblo Buddy 🤖</p>
                  <p className="leading-relaxed text-foreground/80">
                    Imagine a pizza 🍕 cut into 4 equal slices. If you eat 1 slice, you ate <strong>1/4</strong> of the pizza! The bottom number is how many slices total, the top is how many you ate. Easy peasy!
                  </p>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-peblo-pink/20 text-peblo-pink text-xs rounded-full font-bold cursor-pointer hover:bg-peblo-pink/40 transition-colors">🎮 Quiz me!</span>
                    <span className="px-3 py-1 bg-peblo-blue/20 text-peblo-blue text-xs rounded-full font-bold cursor-pointer hover:bg-peblo-blue/40 transition-colors">📝 Save to notes</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl mb-4">🤖</div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                Meet Your AI Buddy!
              </h2>
              <p className="text-xl text-foreground/70 mb-8 leading-relaxed font-medium">
                Stuck on homework? Your buddy explains it like a friend — no big confusing words, just easy fun explanations! Available 24/7, never judges, always patient! 😄
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  { emoji: "✅", text: "Explains things simply, like talking to a friend" },
                  { emoji: "🎮", text: "Makes fun quizzes from your notes automatically" },
                  { emoji: "📊", text: "Tracks your progress and celebrates your wins" },
                  { emoji: "🌍", text: "Knows every subject — science, math, history & more!" },
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-lg font-medium"
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-foreground/80">{item.text}</span>
                  </motion.li>
                ))}
              </ul>
              <Link href="/signup">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="h-14 px-8 rounded-2xl bg-gradient-to-r from-peblo-purple to-peblo-pink text-white font-bold text-lg shadow-xl">
                    🚀 Try it for Free!
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-heading font-bold mb-4"
            >
              Kids love it! ❤️
            </motion.h2>
            <p className="text-xl text-foreground/60 font-medium">See what other students are saying</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Max", grade: "7th Grade", emoji: "🔬", quote: "Peblo helped me go from a C to an A in Science! The quizzes make studying actually fun. I love earning XP! 🚀", seed: "Max", stars: 5 },
              { name: "Emma", grade: "5th Grade", emoji: "🧮", quote: "I used to hate math. Now I ask Peblo to explain things and it makes SO much sense. My teacher is shocked! ✨", seed: "Emma", stars: 5 },
              { name: "Leo", grade: "8th Grade", emoji: "🦕", quote: "The flashcards are amazing for History. I beat my friend's quiz score last week and got a new badge! 🏆", seed: "Leo", stars: 5 },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="glass-card rounded-3xl p-8 border border-white/50 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-peblo-purple/10 rounded-full blur-2xl -mr-10 -mt-10" />
                <div className="text-yellow-400 text-2xl mb-4">{"★".repeat(t.stars)}</div>
                <p className="text-foreground/80 font-medium leading-relaxed mb-6 text-lg">&quot;{t.quote}&quot;</p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                    <Image src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${t.seed}`} alt={t.name} width={56} height={56} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-lg">{t.name}</h4>
                      <span className="text-xl">{t.emoji}</span>
                    </div>
                    <p className="text-sm text-foreground/60 font-medium">{t.grade} Student</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-[3rem] p-12 md:p-20 text-center border border-white/50 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-peblo-purple/10 via-peblo-pink/5 to-peblo-blue/10 -z-10" />
            <div className="text-6xl mb-6">🎓</div>
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Ready to become a{" "}
              <span className="gradient-text">Learning Superstar?</span>
            </h2>
            <p className="text-xl text-foreground/70 mb-10 max-w-xl mx-auto font-medium">
              Join over 10,000 kids who are having a blast learning every day. It&apos;s totally free to start! 🎉
            </p>
            <Link href="/signup">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                <Button size="lg" className="h-16 px-12 text-xl bg-gradient-to-r from-peblo-purple to-peblo-pink text-white rounded-2xl shadow-2xl font-bold border-0">
                  🚀 Create Free Account
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative pt-10 pb-10 border-t border-peblo-purple/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-peblo-purple to-peblo-pink p-2 rounded-xl text-white shadow-lg text-lg">✨</div>
            <span className="font-heading font-bold text-xl">Peblo AI</span>
          </div>
          <p className="text-foreground/50 text-sm font-medium">Made with ❤️ for curious minds everywhere © 2026</p>
          <div className="flex gap-6 text-sm font-medium text-foreground/50">
            <Link href="#" className="hover:text-peblo-purple transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-peblo-purple transition-colors">Terms</Link>
            <Link href="#features" className="hover:text-peblo-purple transition-colors">Features</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
