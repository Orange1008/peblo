"use client";

import { motion } from "framer-motion";
import { User, Palette, Bell, Sparkles, Shield, LogOut, Moon, Sun, Monitor } from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

export default function SettingsPage() {
  const [theme, setTheme] = useState("system");
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    if (document.documentElement.classList.contains('dark')) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add('dark');
    } else if (newTheme === "light") {
      document.documentElement.classList.remove('dark');
    } else {
      // System theme logic would go here, for now just light
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Settings</h1>
        <p className="text-foreground/60">Manage your account, preferences, and AI buddy settings.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Settings Navigation Sidebar */}
        <div className="md:col-span-1 space-y-2">
          {[
            { name: "Profile", icon: User, active: true },
            { name: "Appearance", icon: Palette, active: false },
            { name: "Notifications", icon: Bell, active: false },
            { name: "AI Preferences", icon: Sparkles, active: false },
            { name: "Account Security", icon: Shield, active: false },
          ].map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left ${item.active
                  ? "bg-peblo-purple text-white shadow-md shadow-peblo-purple/30"
                  : "text-foreground/70 hover:bg-white/50 dark:hover:bg-white/5 hover:text-foreground"
                }`}
            >
              <item.icon size={18} className={item.active ? "text-white" : "text-foreground/50"} />
              {item.name}
            </button>
          ))}

          <div className="pt-6 mt-6 border-t border-white/20">
            <button
              onClick={() => {
                toast({
                  title: "Logging out...",
                  description: "See you next time, Explorer! 👋",
                })
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left text-red-500 hover:bg-red-500/10"
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="md:col-span-2 space-y-6">

          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-6 md:p-8"
          >
            <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
              <User size={20} className="text-peblo-blue" />
              Profile Settings
            </h2>

            <div className="flex items-center gap-6 mb-8">
              <Avatar className="h-24 w-24 border-4 border-white/50 shadow-lg bg-white">
                <AvatarImage src="https://api.dicebear.com/7.x/adventurer/svg?seed=Alex" />
                <AvatarFallback>AW</AvatarFallback>
              </Avatar>
              <div>
                <button
                  onClick={() => {
                    toast({
                      title: "Avatar Changer Activated ✨",
                      description: "Let's find you a new cool look!",
                    })
                  }}
                  className="px-4 py-2 bg-white/50 dark:bg-white/10 border border-white/40 rounded-xl font-medium text-sm hover:bg-white/80 transition-colors mb-2"
                >
                  Change Avatar
                </button>
                <p className="text-xs text-foreground/50">Pick a fun new adventurer!</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80">First Name</label>
                  <input type="text" defaultValue="Alex" className="w-full px-4 py-2 bg-white/50 dark:bg-black/50 border border-white/30 rounded-xl focus:outline-none focus:border-peblo-purple/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80">Last Name</label>
                  <input type="text" defaultValue="Walker" className="w-full px-4 py-2 bg-white/50 dark:bg-black/50 border border-white/30 rounded-xl focus:outline-none focus:border-peblo-purple/50" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/80">Email Address</label>
                <input type="email" defaultValue="alex@example.com" className="w-full px-4 py-2 bg-white/50 dark:bg-black/50 border border-white/30 rounded-xl focus:outline-none focus:border-peblo-purple/50" />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => {
                  toast({
                    title: "Settings Saved! 🚀",
                    description: "Your magical preferences have been updated.",
                  })
                }}
                className="px-6 py-2 bg-gradient-to-r from-peblo-purple to-peblo-pink text-white font-bold rounded-xl shadow-lg hover:shadow-peblo-purple/30 transition-all hover:-translate-y-0.5"
              >
                Save Changes
              </button>
            </div>
          </motion.div>

          {/* Theme Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-3xl p-6 md:p-8"
          >
            <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
              <Palette size={20} className="text-peblo-pink" />
              Appearance
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => handleThemeChange('light')}
                className={`p-4 rounded-2xl flex flex-col items-center gap-3 border-2 transition-all ${theme === 'light' ? 'border-peblo-purple bg-peblo-purple/5' : 'border-white/20 bg-white/20 hover:border-white/40'}`}
              >
                <Sun size={24} className={theme === 'light' ? 'text-peblo-purple' : 'text-foreground/50'} />
                <span className="font-medium text-sm">Light</span>
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`p-4 rounded-2xl flex flex-col items-center gap-3 border-2 transition-all ${theme === 'dark' ? 'border-peblo-purple bg-peblo-purple/5' : 'border-white/20 bg-black/20 hover:border-white/40'}`}
              >
                <Moon size={24} className={theme === 'dark' ? 'text-peblo-purple' : 'text-foreground/50'} />
                <span className="font-medium text-sm">Dark</span>
              </button>
              <button
                onClick={() => handleThemeChange('system')}
                className={`p-4 rounded-2xl flex flex-col items-center gap-3 border-2 transition-all ${theme === 'system' ? 'border-peblo-purple bg-peblo-purple/5' : 'border-white/20 bg-white/10 hover:border-white/40'}`}
              >
                <Monitor size={24} className={theme === 'system' ? 'text-peblo-purple' : 'text-foreground/50'} />
                <span className="font-medium text-sm">System</span>
              </button>
            </div>
          </motion.div>

          {/* AI Preferences Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-3xl p-6 md:p-8"
          >
            <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
              <Sparkles size={20} className="text-peblo-purple" />
              AI Preferences
            </h2>

            <div className="space-y-6">
              {[
                { title: "Auto-Generate Flashcards", desc: "Automatically create flashcards when saving new notes." },
                { title: "Smart Study Reminders", desc: "AI will remind you to study topics you struggle with." },
                { title: "Playful Explanations", desc: "Use emojis and playful language in 'Explain Like I'm 10'." },
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-foreground/80">{pref.title}</h4>
                    <p className="text-sm text-foreground/50">{pref.desc}</p>
                  </div>
                  {/* Custom Toggle */}
                  <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${i !== 1 ? 'bg-peblo-purple' : 'bg-white/30 dark:bg-white/10'}`}>
                    <motion.div
                      className="w-4 h-4 bg-white rounded-full shadow-sm"
                      animate={{ x: i !== 1 ? 24 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
