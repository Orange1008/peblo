"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, BookOpen, Brain, Layers, BarChart2, Settings } from "lucide-react";

const navItems = [
  { name: "Command Center", href: "/dashboard", icon: LayoutDashboard },
  { name: "Magic Backpack", href: "/notes", icon: BookOpen },
  { name: "Fun Quiz", href: "/quiz", icon: Brain },
  { name: "Flashcards", href: "/flashcards", icon: Layers },
  { name: "Adventure Log", href: "/insights", icon: BarChart2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-t border-white/20 shadow-2xl">
      <div className="flex items-center justify-around px-1 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.85 }}
                className={`flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-2xl mx-0.5 transition-all ${
                  isActive
                    ? "bg-gradient-to-br from-peblo-purple/20 to-peblo-pink/10 text-peblo-purple"
                    : "text-foreground/50 hover:text-peblo-purple"
                }`}
              >
                {isActive ? (
                  <motion.div
                    layoutId="mobileActiveTab"
                    className="absolute inset-0 rounded-2xl bg-peblo-purple/10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                ) : null}
                <item.icon size={20} className={isActive ? "text-peblo-purple" : ""} />
                <span className={`text-[9px] font-bold leading-tight text-center ${isActive ? "text-peblo-purple" : ""}`}>
                  {item.name.split(" ")[0]}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
