"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`glass-card rounded-2xl px-6 py-3 flex items-center justify-between transition-all duration-300 ${
            isScrolled ? "shadow-lg bg-white/70 dark:bg-black/70" : "bg-white/40 dark:bg-black/40"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-peblo-purple p-2 rounded-xl text-white group-hover:rotate-12 transition-transform duration-300 shadow-[0_0_15px_rgba(155,139,244,0.5)]">
              <Sparkles size={24} />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-foreground">
              Peblo AI
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-foreground/80 hover:text-peblo-purple transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-foreground/80 hover:text-peblo-purple transition-colors">
              How it Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-foreground/80 hover:text-peblo-purple transition-colors">
              Testimonials
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-peblo-purple/10 hover:text-peblo-purple font-medium">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-peblo-purple to-peblo-pink hover:opacity-90 text-white shadow-lg hover:shadow-peblo-pink/50 transition-all duration-300 font-medium rounded-xl">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-foreground">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 mt-2 p-4 z-40 md:hidden"
          >
            <div className="glass-card rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
              <Link href="#features" className="text-foreground font-medium px-4 py-2 hover:bg-peblo-purple/10 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                Features
              </Link>
              <Link href="#how-it-works" className="text-foreground font-medium px-4 py-2 hover:bg-peblo-purple/10 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                How it Works
              </Link>
              <div className="h-[1px] bg-border my-2"></div>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Log in</Button>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-peblo-purple to-peblo-pink text-white">Get Started</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
