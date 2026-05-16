"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Sparkles, Mail, Lock, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/use-toast";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      
      if (res.ok) {
        login(data.token, data.user);
        toast({ title: "Account created!", description: "Welcome to Peblo AI." });
        router.push("/dashboard");
      } else {
        toast({ variant: "destructive", title: "Signup failed", description: data.error || "Something went wrong" });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to connect to server" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements specific to auth page */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-peblo-blue/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-peblo-pink/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center z-10 flex-row-reverse">
        
        {/* Left Side (Actually Right Side visually due to flex-row-reverse on container isn't applied, let's reverse the order in code) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="order-2 md:order-1"
        >
          <div className="glass-card p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative">
            <div className="md:hidden flex justify-center mb-8">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="bg-peblo-purple p-2 rounded-xl text-white shadow-lg">
                  <Sparkles size={24} />
                </div>
              </Link>
            </div>
            
            <h2 className="text-3xl font-heading font-bold mb-2 text-center md:text-left">Start Your Adventure</h2>
            <p className="text-foreground/60 mb-8 text-center md:text-left">Create your magic backpack and get ready to learn!</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 group">
                <Label htmlFor="username" className="text-foreground/80 font-semibold group-focus-within:text-peblo-purple transition-colors">Username</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-peblo-purple transition-colors">
                    <UserIcon size={18} />
                  </div>
                  <Input 
                    id="username" 
                    type="text" 
                    placeholder="coolkid2026" 
                    className="pl-10 h-11 rounded-xl border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/50 focus-visible:ring-peblo-purple/50 shadow-inner"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="email" className="text-foreground/80 font-semibold group-focus-within:text-peblo-purple transition-colors">Email Address</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-peblo-purple transition-colors">
                    <Mail size={18} />
                  </div>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    className="pl-10 h-11 rounded-xl border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/50 focus-visible:ring-peblo-purple/50 shadow-inner"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="password" className="text-foreground/80 font-semibold group-focus-within:text-peblo-purple transition-colors">Password</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-peblo-purple transition-colors">
                    <Lock size={18} />
                  </div>
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="pl-10 pr-10 h-11 rounded-xl border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/50 focus-visible:ring-peblo-purple/50 shadow-inner"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 mt-6 bg-gradient-to-r from-peblo-purple to-peblo-pink hover:opacity-90 text-white rounded-xl shadow-lg hover:shadow-peblo-purple/50 transition-all duration-300 font-bold text-base relative overflow-hidden group"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                      <Sparkles size={18} />
                    </motion.div>
                    Creating account...
                  </span>
                ) : (
                  <span>Start Adventure</span>
                )}
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-foreground/70">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-peblo-purple hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Right Side: Illustration (Visual right, code order 2) */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex flex-col justify-center h-full p-8 order-1 md:order-2"
        >
          <div className="flex justify-end w-full mb-12">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-peblo-purple p-2 rounded-xl text-white shadow-lg group-hover:-rotate-12 transition-transform">
                <Sparkles size={24} />
              </div>
              <span className="font-heading font-bold text-2xl tracking-tight text-foreground">
                Peblo AI
              </span>
            </Link>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-6 text-balance leading-tight text-right">
            Unlock your <span className="gradient-text">Magic Brain Power</span>
          </h1>
          <p className="text-lg text-foreground/70 mb-12 max-w-md ml-auto text-right">
            Join thousands of kids who are having a blast learning new things. Your personalized AI buddy is waiting to play!
          </p>
          
          <div className="relative w-full max-w-sm h-64 bg-white/30 dark:bg-black/30 rounded-3xl border border-white/50 backdrop-blur-sm p-6 overflow-hidden ml-auto">
             <div className="absolute top-4 left-4 text-peblo-pink opacity-50"><Sparkles /></div>
             <motion.div
               animate={{ y: [-5, 5, -5] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="w-full h-full rounded-2xl bg-gradient-to-bl from-peblo-pink/30 to-peblo-purple/30 flex items-center justify-center"
             >
                <div className="text-center">
                  <span className="text-5xl block mb-2 opacity-90">🚀</span>
                  <span className="font-bold text-peblo-purple/80">Ready for liftoff</span>
                </div>
             </motion.div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
