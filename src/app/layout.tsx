import type { Metadata } from "next";
import { Nunito, Quicksand } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/lib/auth-context";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "Peblo AI Study Buddy",
  description: "Learn, Explore & Grow with Your AI Study Buddy",
};

import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", nunito.variable, quicksand.variable)}>
      <body className="antialiased min-h-screen relative overflow-x-hidden text-foreground">
        <AuthProvider>
          {/* Global Image Background Layer */}
          <div
            className="fixed inset-0 z-[-2] bg-cover bg-center bg-no-repeat opacity-40 dark:opacity-20"
            style={{ backgroundImage: "url('/bg.png')" }}
          />

          {/* Floating Particles Background layer */}
          <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-peblo-light/80 to-blue-50/80 dark:from-peblo-dark/90 dark:to-indigo-950/90 backdrop-blur-[2px]" />
          <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-peblo-purple/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="fixed top-[20%] right-[-5%] w-72 h-72 bg-peblo-pink/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="fixed bottom-[-10%] left-[20%] w-80 h-80 bg-peblo-blue/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

          <div className="relative z-0 min-h-screen">
            {children}
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
