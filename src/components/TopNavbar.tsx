"use client";

import { Bell, Search, Moon, Sun, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";

export function TopNavbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="h-20 px-6 flex items-center justify-between border-b border-white/20 bg-white/30 dark:bg-black/30 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" className="lg:hidden text-foreground">
          <Menu size={24} />
        </Button>

        <div className="relative max-w-md w-full hidden md:block">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40">
            <Search size={18} />
          </div>
          <Input
            placeholder="Search notes, flashcards, quizzes..."
            className="pl-10 bg-white/50 dark:bg-black/50 border-white/40 dark:border-white/10 rounded-full h-11 shadow-inner focus-visible:ring-peblo-purple/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full text-foreground/70 hover:text-peblo-purple hover:bg-white/50">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            toast({
              title: "No New Quests!",
              description: "You're all caught up on your magical adventures.",
            })
          }}
          className="rounded-full relative text-foreground/70 hover:text-peblo-purple hover:bg-white/50"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-peblo-pink rounded-full border border-background"></span>
        </Button>
        <div className="w-px h-8 bg-border mx-2 hidden sm:block"></div>
        <div className="flex items-center gap-3 cursor-pointer">
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm bg-white">
            <AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name || 'Guest'}`} />
            <AvatarFallback>{(user?.name || "Guest").substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-bold">{user?.name || "Guest"}</p>
            <p className="text-xs text-foreground/60">Day {user?.streak || 1} Streak</p>
          </div>
        </div>
      </div>
    </header>
  );
}
