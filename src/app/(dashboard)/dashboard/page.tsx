"use client";

import { motion } from "framer-motion";
import { BookOpen, Flame, Zap, Brain, TrendingUp, Clock, Layers, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

export default function DashboardPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6 pb-20">

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-6 border border-white/30 bg-gradient-to-r from-peblo-purple/10 via-peblo-pink/10 to-peblo-blue/10 relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 text-[120px] opacity-10 select-none">🚀</div>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-1">Hey there, Explorer! 👋</h1>
            <p className="text-foreground/60 font-medium text-lg">Your learning adventure awaits — let&apos;s go! 🌟</p>
          </div>
          <div className="flex items-center gap-3 bg-white/60 dark:bg-black/30 px-5 py-3 rounded-2xl border border-orange-300/50 shadow-md">
            <span className="text-3xl">🔥</span>
            <div>
              <p className="font-bold text-lg text-orange-500">12 Day Streak!</p>
              <p className="text-xs text-foreground/50 font-medium">Keep it up, champ!</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* XP Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-3xl p-5 border border-white/30"
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="font-bold text-lg">Level 14 — Explorer!</span>
          </div>
          <span className="text-sm font-bold text-peblo-purple bg-peblo-purple/10 px-3 py-1 rounded-full">2,450 / 3,000 XP</span>
        </div>
        <div className="h-4 bg-white/30 dark:bg-black/30 rounded-full overflow-hidden border border-white/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "82%" }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-peblo-purple via-peblo-pink to-peblo-blue rounded-full relative"
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full" />
          </motion.div>
        </div>
        <p className="text-xs text-foreground/50 mt-2 font-medium">550 XP more to reach Level 15 — Galaxy Master! 🌌</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { emoji: "📝", title: "My Notes", value: "48", sub: "+12 this week", color: "from-peblo-purple/20 to-purple-200/30", border: "border-peblo-purple/30" },
          { emoji: "🔥", title: "Day Streak", value: "12", sub: "Personal best!", color: "from-orange-200/30 to-red-200/30", border: "border-orange-300/40" },
          { emoji: "⚡", title: "XP Earned", value: "2,450", sub: "Level 14 Explorer", color: "from-yellow-200/30 to-amber-200/30", border: "border-yellow-300/40" },
          { emoji: "🏆", title: "Badges Won", value: "9", sub: "3 this month!", color: "from-peblo-pink/20 to-pink-200/30", border: "border-peblo-pink/30" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`glass-card rounded-3xl p-5 border ${stat.border} bg-gradient-to-br ${stat.color} relative overflow-hidden`}
          >
            <div className="text-3xl mb-2">{stat.emoji}</div>
            <div className="text-2xl font-heading font-bold">{stat.value}</div>
            <div className="text-xs font-bold text-foreground/50 uppercase tracking-wide">{stat.title}</div>
            <div className="text-xs font-medium text-peblo-purple mt-1">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-3xl p-6 border border-white/30"
      >
        <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">⚡</span> Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { emoji: "📝", label: "New Note", desc: "Start writing!", href: "/notes", color: "hover:border-peblo-purple/50 hover:bg-peblo-purple/10" },
            { emoji: "🎮", label: "Take a Quiz", desc: "Test yourself!", href: "/quiz", color: "hover:border-peblo-pink/50 hover:bg-peblo-pink/10" },
            { emoji: "🃏", label: "Flashcards", desc: "Quick review", href: "/flashcards", color: "hover:border-peblo-blue/50 hover:bg-peblo-blue/10" },
            { emoji: "📊", label: "My Progress", desc: "See your wins!", href: "/insights", color: "hover:border-yellow-300/50 hover:bg-yellow-100/20" },
          ].map((action, i) => (
            <Link key={i} href={action.href}>
              <motion.div
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`p-4 rounded-2xl border-2 border-white/30 bg-white/30 dark:bg-black/20 transition-all cursor-pointer text-center ${action.color}`}
              >
                <div className="text-3xl mb-2">{action.emoji}</div>
                <p className="font-bold text-sm">{action.label}</p>
                <p className="text-xs text-foreground/50">{action.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-card p-6 rounded-3xl border border-white/30"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-heading font-bold flex items-center gap-2">
              <span className="text-2xl">📈</span> This Week&apos;s Activity
            </h2>
            <span className="text-sm font-bold text-peblo-purple bg-peblo-purple/10 px-3 py-1 rounded-full">Great job! 🌟</span>
          </div>
          <div className="h-52 flex items-end justify-between gap-2 pt-4">
            {[
              { h: 40, day: "Mon", label: "2 notes" },
              { h: 70, day: "Tue", label: "5 notes" },
              { h: 45, day: "Wed", label: "3 notes" },
              { h: 90, day: "Thu", label: "8 notes" },
              { h: 65, day: "Fri", label: "5 notes" },
              { h: 30, day: "Sat", label: "1 note" },
              { h: 80, day: "Sun", label: "6 notes" },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-xs font-bold text-foreground/0 group-hover:text-foreground/60 transition-colors">{bar.label}</span>
                <div className="w-full relative rounded-t-xl bg-peblo-blue/10 overflow-hidden flex flex-col justify-end h-40">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${bar.h}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                    className="w-full bg-gradient-to-t from-peblo-purple to-peblo-pink rounded-t-xl group-hover:opacity-100 opacity-80 transition-opacity relative"
                  >
                    <div className="absolute top-0 left-0 right-0 h-2 bg-white/40 blur-[2px]" />
                  </motion.div>
                </div>
                <span className="text-xs text-foreground/50 font-bold">{bar.day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Favorite Subjects */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 rounded-3xl border border-white/30 flex flex-col"
        >
          <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
            <span className="text-2xl">🌍</span> My Adventures
          </h2>
          <div className="space-y-5 flex-1">
            {[
              { name: "🔬 Science Magic", progress: 75, color: "bg-peblo-purple" },
              { name: "🪐 Space & Planets", progress: 60, color: "bg-peblo-pink" },
              { name: "🦕 Dinosaur History", progress: 40, color: "bg-peblo-blue" },
              { name: "💻 Coding 101", progress: 25, color: "bg-yellow-400" },
            ].map((s, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-sm font-bold">
                  <span>{s.name}</span>
                  <span className="text-foreground/50">{s.progress}%</span>
                </div>
                <div className="h-3 w-full bg-foreground/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.progress}%` }}
                    transition={{ duration: 1.2, delay: 0.8 + i * 0.1 }}
                    className={`h-full ${s.color} rounded-full relative`}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/notes">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-5 py-2.5 border-2 border-peblo-purple/30 text-peblo-purple font-bold rounded-xl hover:bg-peblo-purple/10 transition-colors flex items-center justify-center gap-2"
            >
              See All Adventures <ArrowRight size={16} />
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6 rounded-3xl border border-white/30"
      >
        <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
          <span className="text-2xl">⏱️</span> Recent Activity
        </h2>
        <div className="space-y-5 pl-2">
          {[
            { emoji: "📝", action: "Created a new note", target: "Magic of Science", time: "2 hours ago", color: "bg-peblo-purple/10 text-peblo-purple" },
            { emoji: "🎮", action: "Generated a fun quiz on", target: "Cellular Respiration", time: "5 hours ago", color: "bg-peblo-pink/10 text-peblo-pink" },
            { emoji: "🃏", action: "Reviewed 20 flashcards in", target: "Spanish Words", time: "Yesterday", color: "bg-peblo-blue/10 text-peblo-blue" },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-center relative">
              {i !== 2 && <div className="absolute left-5 top-10 bottom-[-24px] w-[2px] bg-border" />}
              <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center shrink-0 z-10 text-lg ring-4 ring-background`}>
                {item.emoji}
              </div>
              <div>
                <p className="text-sm font-medium">
                  <span className="text-foreground/60">{item.action} </span>
                  <span className="font-bold">{item.target}</span>
                </p>
                <p className="text-xs text-foreground/40 mt-0.5">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Daily Challenge Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card rounded-3xl p-6 border-2 border-yellow-300/40 bg-gradient-to-r from-yellow-100/30 to-orange-100/30 relative overflow-hidden"
      >
        <div className="absolute -right-8 -top-8 text-[100px] opacity-10 select-none">⭐</div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">⭐</span>
              <span className="text-xs font-bold uppercase tracking-widest text-yellow-600 bg-yellow-200/60 px-2 py-0.5 rounded-full">Daily Challenge</span>
            </div>
            <h3 className="text-xl font-heading font-bold">Quiz: 5 Questions on Space! 🚀</h3>
            <p className="text-foreground/60 text-sm font-medium mt-1">Complete today&apos;s challenge to earn <strong className="text-yellow-600">+150 XP</strong> and a special badge!</p>
          </div>
          <Link href="/quiz">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="shrink-0 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2"
            >
              Accept Challenge! 🎯
            </motion.button>
          </Link>
        </div>
      </motion.div>

    </div>
  );
}
