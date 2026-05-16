"use client";

import { motion } from "framer-motion";
import { useNotes } from "@/lib/notes-context";
import Link from "next/link";

function getDayOfWeek(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short" });
}

export default function InsightsPage() {
  const { notes } = useNotes();

  const activeNotes = notes.filter(n => !n.archived);
  const archivedNotes = notes.filter(n => n.archived);

  // Recently edited — top 5 by updatedAt
  const recentNotes = [...activeNotes]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  // Most-used tags
  const tagCount: Record<string, number> = {};
  notes.forEach(n => n.tags.forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; }));
  const topTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 8);

  // Total AI interactions
  const totalAI = notes.reduce((sum, n) => sum + (n.aiInteractions || 0), 0);

  // Weekly activity — count notes updated per day this week
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const weekStart = new Date(today); weekStart.setDate(today.getDate() - today.getDay());
  const weeklyActivity = DAYS.map(day => ({
    day,
    count: notes.filter(n => {
      const d = new Date(n.updatedAt);
      return getDayOfWeek(n.updatedAt) === day && d >= weekStart;
    }).length,
  }));
  const weekMax = Math.max(...weeklyActivity.map(d => d.count), 1);

  // Total shared notes
  const sharedCount = notes.filter(n => n.shared).length;

  // Heatmap: last 4 weeks
  const HEATMAP_DAYS = 28;
  const heatmapData = Array.from({ length: HEATMAP_DAYS }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (HEATMAP_DAYS - 1 - i));
    const iso = d.toISOString().split("T")[0];
    return notes.filter(n => n.updatedAt.startsWith(iso)).length;
  });
  function heatColor(v: number) {
    if (v === 0) return "bg-white/20 dark:bg-white/5";
    if (v === 1) return "bg-peblo-purple/25";
    if (v === 2) return "bg-peblo-purple/55";
    return "bg-peblo-purple";
  }

  const BADGES = [
    { emoji: "📝", name: "First Note!", unlocked: notes.length >= 1, color: "from-blue-400/30 to-blue-200/20", border: "border-blue-300/50" },
    { emoji: "🔥", name: "7 Day Streak!", unlocked: true, color: "from-orange-400/30 to-red-200/20", border: "border-orange-300/50" },
    { emoji: "🏆", name: "Quiz Master!", unlocked: true, color: "from-yellow-400/30 to-amber-200/20", border: "border-yellow-300/50" },
    { emoji: "🤖", name: "AI Whisperer!", unlocked: totalAI >= 10, color: "from-peblo-purple/30 to-purple-200/20", border: "border-peblo-purple/30" },
    { emoji: "⭐", name: "Star Learner!", unlocked: notes.length >= 5, color: "from-peblo-pink/30 to-pink-200/20", border: "border-peblo-pink/30" },
    { emoji: "🔗", name: "Sharer!", unlocked: sharedCount >= 1, color: "from-green-400/30 to-green-200/20", border: "border-green-300/50" },
    { emoji: "🌙", name: "30 Day Streak!", unlocked: false, color: "", border: "" },
    { emoji: "💎", name: "Diamond Mind!", unlocked: notes.length >= 20, color: "from-sky-400/30 to-sky-200/20", border: "border-sky-300/50" },
  ];
  const unlockedCount = BADGES.filter(b => b.unlocked).length;

  return (
    <div className="space-y-6 pb-20">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-6 border border-white/30 bg-gradient-to-r from-peblo-purple/10 to-peblo-pink/10 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 text-[100px] opacity-10 select-none">📊</div>
        <h1 className="text-3xl font-heading font-bold mb-1">My Adventure Log! 🗺️</h1>
        <p className="text-foreground/60 font-medium">Look at how much you&apos;ve grown, Explorer! Every day counts! 🌟</p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { emoji: "📝", label: "Total Notes", value: activeNotes.length.toString(), sub: `${archivedNotes.length} archived`, color: "from-peblo-purple/20 to-purple-200/15", border: "border-peblo-purple/30" },
          { emoji: "🤖", label: "AI Chats", value: totalAI.toString(), sub: "Questions answered!", color: "from-peblo-pink/20 to-pink-200/15", border: "border-peblo-pink/30" },
          { emoji: "🔗", label: "Shared Notes", value: sharedCount.toString(), sub: "publicly accessible", color: "from-green-300/20 to-green-200/15", border: "border-green-300/40" },
          { emoji: "🏅", label: "Badges", value: `${unlockedCount}/${BADGES.length}`, sub: `${BADGES.length - unlockedCount} more to unlock!`, color: "from-yellow-300/25 to-amber-200/20", border: "border-yellow-300/40" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className={`glass-card p-5 rounded-3xl border ${s.border} bg-gradient-to-br ${s.color}`}>
            <div className="text-3xl mb-2">{s.emoji}</div>
            <div className="text-2xl font-heading font-bold">{s.value}</div>
            <div className="text-xs font-bold text-foreground/50 uppercase tracking-wide">{s.label}</div>
            <div className="text-xs text-peblo-purple font-medium mt-1">{s.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-card p-6 rounded-3xl border border-white/30">
          <h2 className="text-xl font-heading font-bold mb-1 flex items-center gap-2">
            <span className="text-2xl">📅</span> Weekly Activity
          </h2>
          <p className="text-xs text-foreground/50 font-medium mb-5">Notes you worked on each day this week 📚</p>
          <div className="h-40 flex items-end gap-3">
            {weeklyActivity.map((d, i) => {
              const h = weekMax > 0 ? (d.count / weekMax) * 100 : 0;
              const isToday = d.day === DAYS[today.getDay()];
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-foreground/50">{d.count > 0 ? d.count : ""}</span>
                  <div className="w-full relative bg-white/20 dark:bg-black/20 rounded-xl overflow-hidden h-28 flex flex-col justify-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(h, d.count > 0 ? 10 : 0)}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                      className={`w-full rounded-xl ${isToday ? "bg-gradient-to-t from-peblo-purple to-peblo-pink" : "bg-gradient-to-t from-peblo-blue/60 to-peblo-purple/60"}`}
                    />
                  </div>
                  <span className={`text-xs font-bold ${isToday ? "text-peblo-purple" : "text-foreground/50"}`}>{d.day}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Most-used tags */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="glass-card p-6 rounded-3xl border border-white/30">
          <h2 className="text-xl font-heading font-bold mb-5 flex items-center gap-2">
            <span className="text-2xl">🏷️</span> Top Tags
          </h2>
          {topTags.length === 0 ? (
            <p className="text-foreground/40 text-sm font-medium text-center mt-4">No tags yet — add tags to your notes!</p>
          ) : (
            <div className="space-y-3">
              {topTags.map(([tag, count], i) => {
                const maxCount = topTags[0][1];
                return (
                  <div key={tag}>
                    <div className="flex justify-between text-sm font-bold mb-1">
                      <span className="text-peblo-purple">#{tag}</span>
                      <span className="text-foreground/50">{count} {count === 1 ? "note" : "notes"}</span>
                    </div>
                    <div className="h-2.5 bg-white/20 dark:bg-black/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / maxCount) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.08 }}
                        className="h-full bg-gradient-to-r from-peblo-purple to-peblo-pink rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Learning Calendar heatmap */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="glass-card p-6 rounded-3xl border border-white/30">
        <h2 className="text-xl font-heading font-bold mb-1 flex items-center gap-2">
          <span className="text-2xl">🔥</span> Learning Calendar (last 28 days)
        </h2>
        <p className="text-xs text-foreground/50 font-medium mb-5">Darker = more active that day!</p>
        <div className="grid grid-cols-7 gap-1.5">
          {DAYS.map(d => <div key={d} className="text-[10px] text-foreground/40 font-bold text-center">{d}</div>)}
          {heatmapData.map((v, i) => (
            <motion.div key={i} whileHover={{ scale: 1.2 }} title={`${v} note${v !== 1 ? "s" : ""} updated`}
              className={`h-8 rounded-lg cursor-pointer transition-all ${heatColor(v)}`} />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-foreground/40 font-medium">
          Less {["bg-white/20 dark:bg-white/5", "bg-peblo-purple/25", "bg-peblo-purple/55", "bg-peblo-purple"].map((c, i) => (
            <div key={i} className={`w-5 h-5 rounded ${c}`} />
          ))} More
        </div>
      </motion.div>

      {/* Recently edited notes */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass-card p-6 rounded-3xl border border-white/30">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-heading font-bold flex items-center gap-2"><span className="text-2xl">✏️</span> Recently Edited</h2>
          <Link href="/notes"><span className="text-xs font-bold text-peblo-purple hover:underline cursor-pointer">View all →</span></Link>
        </div>
        {recentNotes.length === 0 ? (
          <p className="text-foreground/40 text-sm font-medium">No notes yet! Create your first adventure 🚀</p>
        ) : (
          <div className="space-y-3">
            {recentNotes.map((n, i) => (
              <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.05 }}>
                <Link href="/notes">
                  <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/30 dark:bg-black/20 border border-white/20 hover:border-peblo-purple/30 hover:bg-peblo-purple/5 transition-all cursor-pointer group">
                    <div className="text-2xl">{n.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate group-hover:text-peblo-purple transition-colors">{n.title}</p>
                      <p className="text-xs text-foreground/45 font-medium">{n.folder} · {new Date(n.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    {n.tags.slice(0, 2).map(t => (
                      <span key={t} className="text-[10px] font-bold bg-peblo-blue/10 text-peblo-blue px-2 py-0.5 rounded-full hidden sm:block">#{t}</span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Badges */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="glass-card p-6 rounded-3xl border border-white/30">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold flex items-center gap-2"><span className="text-2xl">🏅</span> Badges</h2>
          <span className="text-sm font-bold text-peblo-purple bg-peblo-purple/10 px-3 py-1 rounded-full">{unlockedCount}/{BADGES.length} unlocked!</span>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {BADGES.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 + i * 0.04 }}
              whileHover={b.unlocked ? { scale: 1.1 } : {}}
              className={`flex flex-col items-center text-center p-3 rounded-2xl border-2 cursor-default transition-all ${b.unlocked ? `bg-gradient-to-br ${b.color} ${b.border} shadow-md` : "border-dashed border-white/20 bg-white/5 opacity-40"}`}>
              <div className="text-3xl mb-1">{b.unlocked ? b.emoji : "🔒"}</div>
              <span className="text-[10px] font-bold leading-tight">{b.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
