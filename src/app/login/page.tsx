"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Sparkles, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/use-toast";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (res.ok) {
        login(data.token, data.user);
        toast({ title: "Welcome back!", description: "Successfully logged in." });
        router.push("/dashboard");
      } else {
        toast({ variant: "destructive", title: "Login failed", description: data.error || "Something went wrong" });
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
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-peblo-pink/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-peblo-blue/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center z-10">
        
        {/* Left Side: Illustration / Motivational */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex flex-col justify-center h-full p-8"
        >
          <Link href="/" className="flex items-center gap-2 mb-12 w-fit group">
            <div className="bg-peblo-purple p-2 rounded-xl text-white shadow-lg group-hover:rotate-12 transition-transform">
              <Sparkles size={24} />
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight text-foreground">
              Peblo AI
            </span>
          </Link>
          
          <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-6 text-balance leading-tight">
            Welcome back to your <span className="gradient-text">Learning Universe</span>
          </h1>
          <p className="text-lg text-foreground/70 mb-12 max-w-md">
            Your AI buddy missed you! Log in to pick up where you left off and conquer your next study session.
          </p>
          
          <div className="relative w-full max-w-sm h-64 bg-white/30 dark:bg-black/30 rounded-3xl border border-white/50 backdrop-blur-sm p-6 overflow-hidden">
             <div className="absolute top-4 right-4 text-peblo-purple opacity-50"><Sparkles /></div>
             <motion.div
               animate={{ y: [-5, 5, -5] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="w-full h-full rounded-2xl bg-gradient-to-br from-peblo-blue/30 to-peblo-purple/30 flex items-center justify-center"
             >
                <span className="text-4xl text-peblo-purple font-bold opacity-80">🤖✨</span>
             </motion.div>
          </div>
        </motion.div>

        {/* Right Side: Login Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="glass-card p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative">
            <div className="md:hidden flex justify-center mb-8">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="bg-peblo-purple p-2 rounded-xl text-white shadow-lg">
                  <Sparkles size={24} />
                </div>
              </Link>
            </div>
            
            <h2 className="text-3xl font-heading font-bold mb-2 text-center md:text-left">Log In</h2>
            <p className="text-foreground/60 mb-8 text-center md:text-left">Enter your details to access your account.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    className="pl-10 h-12 rounded-xl border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/50 focus-visible:ring-peblo-purple/50 shadow-inner"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2 group">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-foreground/80 font-semibold group-focus-within:text-peblo-purple transition-colors">Password</Label>
                  <Link href="#" className="text-sm font-medium text-peblo-purple hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-peblo-purple transition-colors">
                    <Lock size={18} />
                  </div>
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="pl-10 pr-10 h-12 rounded-xl border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/50 focus-visible:ring-peblo-purple/50 shadow-inner"
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
                className="w-full h-12 mt-4 bg-gradient-to-r from-peblo-purple to-peblo-pink hover:opacity-90 text-white rounded-xl shadow-lg hover:shadow-peblo-purple/50 transition-all duration-300 font-bold text-base relative overflow-hidden group"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                      <Sparkles size={18} />
                    </motion.div>
                    Logging in...
                  </span>
                ) : (
                  <span>Log In to Workspace</span>
                )}
                {/* Glowing effect on hover */}
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </Button>
            </form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background/80 backdrop-blur-sm px-2 text-foreground/50 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12 rounded-xl border-white/40 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/5">
                Google
              </Button>
              <Button variant="outline" className="h-12 rounded-xl border-white/40 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/5">
                Apple
              </Button>
            </div>

            <p className="mt-8 text-center text-sm text-foreground/70">
              Don't have an account?{" "}
              <Link href="/signup" className="font-bold text-peblo-purple hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
