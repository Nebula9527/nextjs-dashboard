"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { lusitana } from "@/app/ui/fonts";
import { LogOut } from "lucide-react"; // 确保已安装 lucide-react

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setIsScrolled(currentScrollY > 0);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isVisible ? "translate-y-0" : "-translate-y-full",
          isScrolled
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className={`${lusitana.className} text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent`}
          >
            Dashboard
          </div>
          <nav className="flex items-center gap-4">
            <Button
              variant="gradient"
              className="h-9 px-4 rounded-lg text-white font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-sm transition-all duration-300"
            >
              <LogOut className="mr-2 h-4 w-4" />
              登出
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow mt-16">
        <div className="container mx-auto px-4 py-6">{children}</div>
      </main>
    </div>
  );
}
