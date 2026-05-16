"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  BookOpen, 
  Brain, 
  Layers, 
  BarChart2, 
  Settings, 
  Sparkles,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { name: "Command Center", href: "/dashboard", icon: LayoutDashboard },
  { name: "Magic Backpack", href: "/notes", icon: BookOpen },
  { name: "Fun Quiz", href: "/quiz", icon: Brain },
  { name: "Flashcards", href: "/flashcards", icon: Layers },
  { name: "Adventure Log", href: "/insights", icon: BarChart2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 h-screen hidden lg:flex flex-col border-r border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur-xl shrink-0 sticky top-0 z-40">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group mb-8">
          <div className="bg-peblo-purple p-2 rounded-xl text-white shadow-[0_0_15px_rgba(155,139,244,0.5)]">
            <Sparkles size={24} />
          </div>
          <span className="font-heading font-bold text-2xl tracking-tight text-foreground">
            Peblo AI
          </span>
        </Link>
        
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className="relative">
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white dark:bg-white/10 rounded-xl shadow-sm border border-white/50"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={cn(
                  "relative z-10 flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors duration-200",
                  isActive ? "text-peblo-purple" : "text-foreground/70 hover:text-foreground hover:bg-white/20 dark:hover:bg-white/5"
                )}>
                  <item.icon size={20} className={isActive ? "text-peblo-purple" : "text-foreground/50"} />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="mt-auto p-6 flex flex-col gap-4">
        <div className="glass-card p-4 rounded-2xl flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-peblo-purple/20 to-peblo-pink/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-12 h-12 bg-white dark:bg-black rounded-full flex items-center justify-center mb-3 shadow-md relative z-10">
            <Sparkles className="text-peblo-pink" size={20} />
          </div>
          <h4 className="font-bold text-sm mb-1 relative z-10">Upgrade to Pro</h4>
          <p className="text-xs text-foreground/60 mb-3 relative z-10">Get infinite AI credits & more.</p>
          <button className="w-full py-2 bg-foreground text-background text-xs font-bold rounded-lg hover:opacity-90 relative z-10">
            Upgrade
          </button>
        </div>
        
        <button 
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
